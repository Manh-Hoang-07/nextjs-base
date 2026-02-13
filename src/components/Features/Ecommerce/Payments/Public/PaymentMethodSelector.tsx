"use client";

import { useEffect, useState } from "react";
import { usePayments } from "@/hooks/usePayments";
import { Check } from "lucide-react";

export interface PaymentMethod {
    id: number;
    code: string;
    name: string;
    type: "online" | "offline";
    icon_url?: string;
    description?: string;
}

interface PaymentMethodSelectorProps {
    selectedId: number | null;
    onSelect: (id: number) => void;
    disableCOD?: boolean;
}

export default function PaymentMethodSelector({
    selectedId,
    onSelect,
    disableCOD = false,
}: PaymentMethodSelectorProps) {
    const { fetchPaymentMethods, isLoading } = usePayments();
    const [methods, setMethods] = useState<PaymentMethod[]>([]);

    useEffect(() => {
        const loadMethods = async () => {
            const data = await fetchPaymentMethods();
            setMethods(data);
            if (data.length > 0 && !selectedId) {
                const firstAvailable = data.find((m: any) => !(disableCOD && m.code === "cod")) || data[0];
                onSelect(firstAvailable.id);
            }
        };
        loadMethods();
    }, []);

    if (methods.length === 0 && !isLoading) {
        return (
            <div className="p-4 border border-dashed rounded-lg text-gray-500 text-center">
                Không có phương thức thanh toán khả dụng.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Phương thức thanh toán</h3>
            <div className="grid gap-3">
                {methods.map((method) => {
                    const isCOD = method.code === "cod";
                    const isDisabled = disableCOD && isCOD;
                    const isSelected = selectedId === method.id;

                    return (
                        <div
                            key={method.id}
                            onClick={() => !isDisabled && onSelect(method.id)}
                            className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${isSelected
                                    ? "border-primary bg-primary/5"
                                    : "border-gray-100 hover:border-gray-200"
                                } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-gray-100 p-2">
                                {method.icon_url ? (
                                    <img src={method.icon_url} alt={method.name} className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <div className="text-primary font-bold">{method.name[0]}</div>
                                )}
                            </div>
                            <div className="ml-4 flex-grow">
                                <div className="font-semibold text-gray-900">{method.name}</div>
                                {method.description && (
                                    <div className="text-sm text-gray-500">{method.description}</div>
                                )}
                                {isDisabled && (
                                    <div className="text-xs text-red-500 mt-1">
                                        Không áp dụng cho sản phẩm số
                                    </div>
                                )}
                            </div>
                            {isSelected && (
                                <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
