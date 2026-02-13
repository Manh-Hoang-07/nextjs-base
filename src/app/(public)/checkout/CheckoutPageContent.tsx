"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cartApi, getCartUuid, CartData } from "@/lib/api/public/cart";
import ShippingSelector from "@/components/Features/Ecommerce/ShippingMethods/Public/ShippingSelector";
import PaymentMethodSelector from "@/components/Features/Ecommerce/Payments/Public/PaymentMethodSelector";
import CartCouponInput from "@/components/Features/Ecommerce/Cart/CartCouponInput";
import { formatCurrency } from "@/utils/formatters";
import { useToastContext } from "@/contexts/ToastContext";
import apiClient from "@/lib/api/client";
import { publicEndpoints } from "@/lib/api/endpoints";
import { Loader2, ArrowLeft, ShoppingBag } from "lucide-react";

export default function CheckoutPageContent() {
    const router = useRouter();
    const { showSuccess, showError } = useToastContext();
    const [cart, setCart] = useState<CartData | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Form states
    const [shippingAddress, setShippingAddress] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        district: "",
        ward: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedShippingMethod, setSelectedShippingMethod] = useState<any>(null);
    const [shippingFee, setShippingFee] = useState(0);
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<number | null>(null);
    const [notes, setNotes] = useState("");
    const [debouncedDestination, setDebouncedDestination] = useState("");

    const handleShippingChange = useCallback(({ method, cost }: any) => {
        setSelectedShippingMethod(method);
        setShippingFee(cost);
        setErrors(prev => ({ ...prev, shipping: "" }));
    }, []);

    useEffect(() => {
        fetchCart();
    }, []);

    // Debounce shipping calculation destination
    useEffect(() => {
        const timer = setTimeout(() => {
            const dest = `${shippingAddress.district}, ${shippingAddress.city}`;
            // Only update if destination has significant info
            if (shippingAddress.district || shippingAddress.city) {
                setDebouncedDestination(dest);
            }
        }, 800); // Wait 800ms after last typing

        return () => clearTimeout(timer);
    }, [shippingAddress.city, shippingAddress.district]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await cartApi.getCart();
            if (response.data.success) {
                setCart(response.data.data);
                if (response.data.data.items.length === 0) {
                    router.push("/cart");
                }
            }
        } catch (error) {
            showError("Không thể tải thông tin giỏ hàng");
        } finally {
            setLoading(false);
        }
    };

    const handleApplyCoupon = (result: any) => {
        if (result.cart) {
            setCart(result.cart);
        } else {
            fetchCart();
        }
    };

    const handleRemoveCoupon = () => {
        fetchCart();
    };

    const calculateTotal = () => {
        if (!cart) return 0;
        // Strip any non-numeric characters just in case the API returns formatted strings
        const parseAmount = (val: any) => {
            if (typeof val === 'number') return val;
            if (!val) return 0;
            const cleaned = val.toString().replace(/[^\d.-]/g, '');
            return parseFloat(cleaned) || 0;
        };

        const subtotal = parseAmount(cart.subtotal);
        const discount = parseAmount(cart.discount_amount);
        return Math.max(0, subtotal - discount + shippingFee);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!shippingAddress.name.trim()) newErrors.name = "Họ tên không được để trống";
        if (!shippingAddress.phone.trim()) newErrors.phone = "Số điện thoại không được để trống";
        if (!shippingAddress.address.trim()) newErrors.address = "Địa chỉ không được để trống";
        if (!shippingAddress.city.trim()) newErrors.city = "Vui lòng nhập Tỉnh/Thành phố";
        if (!shippingAddress.district.trim()) newErrors.district = "Vui lòng nhập Quận/Huyện";

        if (!selectedShippingMethod) newErrors.shipping = "Vui lòng chọn phương thức vận chuyển";
        if (!selectedPaymentMethodId) newErrors.payment = "Vui lòng chọn phương thức thanh toán";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleOrderSubmit = async () => {
        const uuid = getCartUuid();
        if (!uuid || !cart) return;

        if (!validateForm()) {
            showError("Vui lòng hoàn thiện các thông tin bắt buộc");
            return;
        }

        try {
            setProcessing(true);
            const payload = {
                cart_uuid: uuid,
                customer_name: shippingAddress.name,
                customer_phone: shippingAddress.phone,
                customer_email: shippingAddress.email,
                shipping_address: {
                    name: shippingAddress.name,
                    phone: shippingAddress.phone,
                    address: shippingAddress.address,
                    city: shippingAddress.city,
                    district: shippingAddress.district,
                    ward: shippingAddress.ward,
                },
                shipping_method_id: selectedShippingMethod.id,
                payment_method_id: selectedPaymentMethodId,
                notes: notes,
            };

            const resp = await apiClient.post(publicEndpoints.orders.checkout, payload);

            if (resp.data.success) {
                showSuccess("Đặt hàng thành công!");
                const { is_online, payment_url, order_number } = resp.data.data;

                if (is_online && payment_url) {
                    // TRƯỜNG HỢP ONLINE (VNPAY, MoMo...)
                    window.location.href = payment_url;
                } else {
                    // TRƯỜNG HỢP OFFLINE (COD, Chuyển khoản)
                    router.push(`/checkout/success?orderCode=${order_number}`);
                }
            }
        } catch (error: any) {
            showError(error.response?.data?.message || "Đã xảy ra lỗi khi đặt hàng");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="mt-4 text-gray-500">Đang tải thông tin thanh toán...</p>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form & Methods */}
            <div className="lg:col-span-8 space-y-8">
                {/* Shipping Information */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">1</span>
                        Thông tin giao hàng
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={shippingAddress.name}
                                onChange={(e) => {
                                    setShippingAddress({ ...shippingAddress, name: e.target.value });
                                    if (errors.name) setErrors({ ...errors, name: "" });
                                }}
                                placeholder="Nhập họ và tên"
                                className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`}
                            />
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                Số điện thoại <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                value={shippingAddress.phone}
                                onChange={(e) => {
                                    setShippingAddress({ ...shippingAddress, phone: e.target.value });
                                    if (errors.phone) setErrors({ ...errors, phone: "" });
                                }}
                                placeholder="Nhập số điện thoại"
                                className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`}
                            />
                            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Email (Không bắt buộc)</label>
                            <input
                                type="email"
                                value={shippingAddress.email}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                                placeholder="Nhập email"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                Địa chỉ cụ thể <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={shippingAddress.address}
                                onChange={(e) => {
                                    setShippingAddress({ ...shippingAddress, address: e.target.value });
                                    if (errors.address) setErrors({ ...errors, address: "" });
                                }}
                                placeholder="Số nhà, tên đường..."
                                className={`w-full px-4 py-3 rounded-xl border ${errors.address ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`}
                            />
                            {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                Tỉnh / Thành phố <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={shippingAddress.city}
                                onChange={(e) => {
                                    setShippingAddress({ ...shippingAddress, city: e.target.value });
                                    if (errors.city) setErrors({ ...errors, city: "" });
                                }}
                                placeholder="Tỉnh / Thành phố"
                                className={`w-full px-4 py-3 rounded-xl border ${errors.city ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`}
                            />
                            {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                Quận / Huyện <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={shippingAddress.district}
                                onChange={(e) => {
                                    setShippingAddress({ ...shippingAddress, district: e.target.value });
                                    if (errors.district) setErrors({ ...errors, district: "" });
                                }}
                                placeholder="Quận / Huyện"
                                className={`w-full px-4 py-3 rounded-xl border ${errors.district ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`}
                            />
                            {errors.district && <p className="text-xs text-red-500">{errors.district}</p>}
                        </div>
                    </div>
                </section>

                {/* Shipping Method */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">2</span>
                        Phương thức vận chuyển
                    </h2>
                    <ShippingSelector
                        cartValue={Number(cart.subtotal)}
                        destination={debouncedDestination}
                        onShippingChange={handleShippingChange}
                    />
                    {errors.shipping && <p className="text-sm text-red-500 mt-2">{errors.shipping}</p>}
                </section>

                {/* Payment Method */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">3</span>
                        Phương thức thanh toán
                    </h2>
                    <PaymentMethodSelector
                        selectedId={selectedPaymentMethodId}
                        onSelect={(id) => {
                            setSelectedPaymentMethodId(id);
                            if (errors.payment) setErrors({ ...errors, payment: "" });
                        }}
                        disableCOD={cart.items.some(item => item.product?.is_digital)}
                    />
                    {errors.payment && <p className="text-sm text-red-500 mt-2">{errors.payment}</p>}
                </section>

                {/* Notes */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Ghi chú đơn hàng</h2>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ghi chú thêm về đơn hàng của bạn (ví dụ: giao giờ hành chính...)"
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    />
                </section>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-primary" />
                                Đơn hàng của bạn
                            </h2>
                        </div>
                        <div className="p-6">
                            {/* Items Summary (brief) */}
                            <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 pr-2 custom-scrollbar">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                            <img
                                                src={item.product?.image || "/images/placeholder.svg"}
                                                alt={item.product_name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight mb-1">{item.product_name}</p>
                                            <p className="text-xs text-gray-500 mb-1">
                                                {item.variant_name || "Mặc định"} x {item.quantity}
                                            </p>
                                            <p className="text-sm font-bold text-primary">
                                                {formatCurrency(Number(item.total_price))}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon */}
                            <div className="mb-6 pt-6 border-t border-gray-100">
                                <CartCouponInput
                                    cartUuid={cart.cart_uuid}
                                    cartId={cart.cart_id}
                                    onApplied={handleApplyCoupon}
                                    onRemoved={handleRemoveCoupon}
                                    initialCoupon={cart.applied_coupon}
                                />
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 pt-6 border-t border-gray-100 mt-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính</span>
                                    <span className="font-medium">
                                        {formatCurrency(cart.subtotal)}
                                    </span>
                                </div>
                                {cart.discount_amount && Number(cart.discount_amount) > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Giảm giá</span>
                                        <span className="font-medium">
                                            -{formatCurrency(cart.discount_amount)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>Phí vận chuyển</span>
                                    <span className="font-medium">
                                        {shippingFee > 0 ? formatCurrency(shippingFee) : "Chưa tính"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                                    <span className="text-2xl font-black text-primary">
                                        {formatCurrency(calculateTotal())}
                                    </span>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={handleOrderSubmit}
                                disabled={processing}
                                className="w-full mt-8 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:translate-y-[-2px] transition-all disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden relative"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Đang xử lý đặt hàng...
                                    </>
                                ) : (
                                    <>
                                        Xác nhận đặt hàng
                                        <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Bảo mật thanh toán 100%
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push("/cart")}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors pl-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    );
}
