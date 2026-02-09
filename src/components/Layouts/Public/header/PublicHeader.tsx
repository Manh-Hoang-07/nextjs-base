"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Bars3Icon,
  XMarkIcon,
  PhoneIcon,
  ChevronDownIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useSystemConfig } from "@/hooks/useSystemConfig";
import { Suspense } from "react";
import SearchInput from "@/components/Features/Comics/Search/Public/SearchInput";

import { SystemConfig } from "@/types/api";

interface PublicHeaderProps {
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
  onCloseMobileMenu?: () => void;
  currentPath?: string;
  systemConfig: SystemConfig | null;
}

export function PublicHeader({
  mobileMenuOpen = false,
  onToggleMobileMenu = () => { },
  onCloseMobileMenu = () => { },
  currentPath = "",
  systemConfig,
}: PublicHeaderProps) {
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Mobile search state
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync scroll lock with menu state
  useEffect(() => {
    if (internalMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [internalMobileMenuOpen]);

  // Handle pathname changes (auto-close menu)
  useEffect(() => {
    setInternalMobileMenuOpen(false);
    setIsSearchOpen(false); // Close search on navigation
  }, [pathname]);

  const siteName = systemConfig?.site_name || "Comic Haven";

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Navigation items
  const navigationItems = [
    { name: "Trang chủ", path: "/", icon: "" },
    {
      name: "Thể loại",
      path: "/comics/categories",
      icon: "",
      children: [
        { name: "Hành động", path: "/comics/categories/hanh-dong", icon: "" },
        { name: "Phiêu lưu", path: "/comics/categories/phieu-luu", icon: "" },
        { name: "Học đường", path: "/comics/categories/hoc-duong", icon: "" },
        { name: "Chuyển sinh", path: "/comics/categories/chuyen-sinh", icon: "" },
      ],
    },
    { name: "Mới cập nhật", path: "/comics?sort=last_chapter_updated_at:desc", icon: "" },
    { name: "Truyện HOT", path: "/comics?sort=view_count:desc", icon: "" },
    { name: "Hoàn thành", path: "/comics?status=completed", icon: "" },
    { name: "Tin tức", path: "/posts", icon: "" },
  ];

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

  const toggleMobileSubmenu = (name: string) => {
    setExpandedMobileMenus((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  /* Modern header with translucency */
  const headerClass = scrolled
    ? "bg-white/80 backdrop-blur-xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border-b border-gray-200/50"
    : "bg-white border-b border-gray-100";

  const handleToggle = () => {
    setInternalMobileMenuOpen(!internalMobileMenuOpen);
    onToggleMobileMenu();
  };

  const handleClose = () => {
    setInternalMobileMenuOpen(false);
    onCloseMobileMenu();
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-in-out ${headerClass} ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo area */}
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/" className="flex items-center gap-3 group">
                <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105 overflow-hidden shrink-0`}>
                  {systemConfig?.site_logo ? (
                    <Image
                      src={systemConfig.site_logo}
                      alt={siteName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  )}
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900 whitespace-nowrap">
                  {siteName}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - REMOVED strictly as requested */}

            <div className="hidden lg:block flex-1 max-w-2xl px-8">
              <Suspense fallback={<div className="w-full h-12 bg-gray-100/50 rounded-2xl animate-pulse"></div>}>
                <SearchInput />
              </Suspense>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Mobile Search Icon */}
              <button
                className="lg:hidden p-3 rounded-full text-gray-500 hover:bg-gray-100 transition-all active:scale-95"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                {isSearchOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <MagnifyingGlassIcon className="w-6 h-6" />
                )}
              </button>

              {/* Account button moved to menu as requested */}

              <button
                className="p-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all active:scale-95 z-[70]"
                onClick={handleToggle}
                aria-label="Toggle menu"
              >
                <Bars3Icon className="w-7 h-7" />
              </button>
            </div>
          </div>

          {/* Mobile Search Overlay */}
          <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? "max-h-20 opacity-100 pb-4" : "max-h-0 opacity-0"}`}>
            <Suspense>
              <SearchInput />
            </Suspense>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {internalMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[80] backdrop-blur-sm transition-all duration-300"
          onClick={handleClose}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-[300px] bg-white z-[90] shadow-2xl transform transition-transform duration-300 ease-in-out ${internalMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <span className="font-bold text-lg text-gray-900">Danh mục</span>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <div key={item.name} className="overflow-hidden">
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleMobileSubmenu(item.name)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left font-medium transition-colors ${isActive(item.path) ? "bg-primary/5 text-primary" : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{item.icon}</span>
                          {item.name}
                        </div>
                        <ChevronDownIcon
                          className={`w-5 h-5 text-gray-400 transition-transform ${expandedMobileMenus.includes(item.name) ? "rotate-180" : ""
                            }`}
                        />
                      </button>
                      <div
                        className={`space-y-1 pl-12 pr-2 transition-all duration-300 ${expandedMobileMenus.includes(item.name)
                          ? "max-h-[500px] opacity-100 py-2"
                          : "max-h-0 opacity-0 overflow-hidden"
                          }`}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            href={child.path}
                            onClick={handleClose}
                            className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === child.path
                              ? "text-primary bg-primary/5"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                              }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.path}
                      onClick={handleClose}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive(item.path) ? "bg-primary/5 text-primary" : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="p-5 border-t border-gray-100">
            <Link href="/contact" onClick={handleClose}>
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium shadow-lg shadow-primary/25 active:scale-95 transition-all">
                <PhoneIcon className="w-5 h-5" />
                <span>Tài khoản</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}



