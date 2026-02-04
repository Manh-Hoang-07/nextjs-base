src/
├─ app/
│  ├─ (admin)/                          # Admin routes - yêu cầu đăng nhập admin
│  │  └─ admin/
│  │     ├─ dashboard/                  # Trang tổng quan
│  │     │
│  │     ├─ comics/                     # Quản lý truyện tranh
│  │     │  ├─ categories/             # Danh mục truyện
│  │     │  ├─ list/                   # Danh sách truyện (thay vì comics/comics)
│  │     │  ├─ chapters/               # Quản lý chương
│  │     │  ├─ comments/               # Bình luận
│  │     │  ├─ reviews/                # Đánh giá (nên tách riêng khỏi comments)
│  │     │  ├─ management/             # Công cụ quản lý chung
│  │     │  └─ statistics/             # Thống kê (đổi từ stats)
│  │     │
│  │     ├─ ecommerce/                 # Thương mại điện tử
│  │     │  ├─ products/               # Sản phẩm
│  │     │  │  ├─ list/               # Danh sách SP (thay vì products/products)
│  │     │  │  ├─ categories/         # Danh mục SP
│  │     │  │  ├─ attributes/         # Thuộc tính
│  │     │  │  ├─ attribute-values/   # Giá trị thuộc tính
│  │     │  │  └─ variants/           # Biến thể
│  │     │  ├─ orders/                # Đơn hàng
│  │     │  ├─ coupons/               # Mã giảm giá
│  │     │  ├─ shipping-methods/      # Phương thức vận chuyển
│  │     │  └─ warehouses/            # Kho hàng
│  │     │     ├─ list/               # Danh sách kho (thay vì warehouses/warehouses)
│  │     │     ├─ [id]/
│  │     │     │  └─ inventory/       # Tồn kho từng kho
│  │     │     ├─ imports/            # Nhập kho
│  │     │     │  └─ [id]/           # Chi tiết phiếu nhập
│  │     │     ├─ exports/            # Xuất kho
│  │     │     │  └─ [id]/           # Chi tiết phiếu xuất
│  │     │     └─ transfers/          # Chuyển kho
│  │     │        └─ [id]/           # Chi tiết phiếu chuyển
│  │     │
│  │     ├─ posts/                     # Quản lý bài viết/blog
│  │     │  ├─ list/                  # Danh sách bài viết (thay vì posts/posts)
│  │     │  ├─ categories/            # Danh mục bài viết
│  │     │  ├─ tags/                  # Tags
│  │     │  ├─ comments/              # Bình luận
│  │     │  └─ statistics/            # Thống kê
│  │     │
│  │     ├─ marketing/                 # Marketing
│  │     │  ├─ banners/               # Banner quảng cáo
│  │     │  ├─ locations/             # Vị trí hiển thị banner
│  │     │  └─ campaigns/             # Chiến dịch marketing (có thể thêm)
│  │     │
│  │     ├─ introduction/              # Giới thiệu công ty/dự án
│  │     │  ├─ about/                 # Về chúng tôi
│  │     │  ├─ services/              # Dịch vụ (nên có admin)
│  │     │  ├─ projects/              # Dự án
│  │     │  ├─ staff/                 # Nhân sự
│  │     │  ├─ partners/              # Đối tác
│  │     │  ├─ certificates/          # Chứng nhận
│  │     │  ├─ testimonials/          # Lời chứng thực/đánh giá KH
│  │     │  ├─ galleries/             # Thư viện ảnh
│  │     │  ├─ faqs/                  # Câu hỏi thường gặp
│  │     │  └─ contacts/              # Liên hệ
│  │     │
│  │     ├─ core/                      # Hệ thống lõi
│  │     │  ├─ iam/                   # Identity & Access Management
│  │     │  │  ├─ users/             # Người dùng
│  │     │  │  ├─ roles/             # Vai trò
│  │     │  │  └─ permissions/       # Quyền hạn
│  │     │  ├─ groups/                # Nhóm người dùng
│  │     │  │  └─ [id]/
│  │     │  │     └─ members/        # Thành viên nhóm
│  │     │  ├─ menus/                 # Quản lý menu
│  │     │  ├─ content-templates/     # Template nội dung
│  │     │  ├─ contexts/              # Ngữ cảnh/cấu hình
│  │     │  └─ system-config/         # Cấu hình hệ thống
│  │     │     ├─ general/           # Cài đặt chung
│  │     │     ├─ email/             # Cấu hình email
│  │     │     └─ notifications/     # Thông báo (có thể thêm)
│  │     │
│  │     └─ payment-methods/           # Phương thức thanh toán
│  │
│  ├─ (auth)/                          # Authentication routes - không yêu cầu đăng nhập
│  │  ├─ login/                       # Đăng nhập
│  │  ├─ register/                    # Đăng ký
│  │  ├─ forgot-password/             # Quên mật khẩu
│  │  ├─ reset-password/              # Đặt lại mật khẩu (nên thêm)
│  │  └─ oauth/                       # OAuth callbacks (nhóm lại thay vì google/)
│  │     ├─ google/
│  │     │  └─ callback/
│  │     └─ facebook/                 # Dễ mở rộng thêm provider
│  │        └─ callback/
│  │
│  ├─ (user)/                          # User routes - yêu cầu đăng nhập user
│  │  └─ user/
│  │     ├─ dashboard/                # Trang tổng quan user (nên thêm)
│  │     ├─ profile/                  # Hồ sơ cá nhân
│  │     │  ├─ edit/                 # Chỉnh sửa
│  │     │  └─ change-password/      # Đổi mật khẩu
│  │     ├─ bookmarks/                # Đánh dấu
│  │     ├─ follows/                  # Theo dõi
│  │     ├─ reading-history/          # Lịch sử đọc
│  │     ├─ orders/                   # Đơn hàng của user (nên thêm)
│  │     ├─ reviews/                  # Đánh giá của user (nên thêm)
│  │     └─ notifications/            # Thông báo (nên thêm)
│  │
│  ├─ (public)/                        # Public routes - ai cũng truy cập được
│  │  ├─ home/                        # Trang chủ (hoặc để trống dùng page.tsx)
│  │  │
│  │  ├─ comics/                      # Truyện tranh
│  │  │  ├─ categories/
│  │  │  │  └─ [slug]/
│  │  │  └─ [slug]/                  # Chi tiết truyện
│  │  │
│  │  ├─ chapters/                    # Đọc chương
│  │  │  └─ [id]/
│  │  │
│  │  ├─ posts/                       # Blog/Tin tức
│  │  │  ├─ categories/
│  │  │  │  └─ [slug]/
│  │  │  ├─ tags/
│  │  │  │  └─ [slug]/
│  │  │  └─ [slug]/                  # Chi tiết bài viết
│  │  │
│  │  ├─ products/                    # Sản phẩm (nên thêm nếu có ecommerce public)
│  │  │  ├─ categories/
│  │  │  │  └─ [slug]/
│  │  │  └─ [slug]/
│  │  │
│  │  ├─ about/                       # Về chúng tôi
│  │  ├─ services/                    # Dịch vụ
│  │  │  └─ [id]/
│  │  ├─ projects/                    # Dự án
│  │  │  └─ [slug]/
│  │  ├─ staff/                       # Đội ngũ
│  │  ├─ partners/                    # Đối tác (nên thêm)
│  │  ├─ certificates/                # Chứng nhận
│  │  │  └─ [id]/
│  │  ├─ galleries/                   # Thư viện ảnh
│  │  │  └─ [id]/
│  │  ├─ testimonials/                # Phản hồi khách hàng (nên thêm)
│  │  ├─ faqs/                        # FAQ
│  │  ├─ contacts/                    # Liên hệ
│  │  └─ search/                      # Tìm kiếm toàn site (nên thêm)
│  │
│  └─ api/                             # API routes
│     ├─ auth/                        # Auth APIs (nên thêm)
│     ├─ public/                      # Public APIs
│     │  ├─ system-config/
│     │  │  └─ general/
│     │  └─ search/                   # Search API (nên thêm)
│     ├─ admin/                       # Admin APIs (nên thêm nếu cần)
│     ├─ user/                        # User APIs (nên thêm nếu cần)
│     ├─ webhooks/                    # Webhooks (payment, oauth, etc.)
│     └─ revalidate/                  # Revalidation
│
├─ components/                         # React components
│  ├─ Features/                       # ✅ PascalCase - Feature-based components
│  │  ├─ Comics/                      # ✅ PascalCase
│  │  │  ├─ Categories/
│  │  │  │  ├─ Admin/
│  │  │  │  │  ├─ ComicCategoryList.tsx
│  │  │  │  │  ├─ ComicCategoryForm.tsx
│  │  │  │  │  └─ ComicCategoryCard.tsx
│  │  │  │  └─ Public/
│  │  │  │     ├─ ComicCategoryGrid.tsx
│  │  │  │     └─ ComicCategoryFilter.tsx
│  │  │  ├─ Chapters/
│  │  │  │  ├─ Admin/
│  │  │  │  │  ├─ ChapterList.tsx
│  │  │  │  │  ├─ ChapterForm.tsx
│  │  │  │  │  └─ ChapterUpload.tsx
│  │  │  │  └─ Public/
│  │  │  │     ├─ ChapterReader.tsx
│  │  │  │     ├─ ChapterNavigation.tsx
│  │  │  │     └─ ChapterComments.tsx
│  │  │  ├─ ComicList/                # ✅ Đổi từ list/ → ComicList/
│  │  │  │  ├─ Admin/
│  │  │  │  │  ├─ ComicTable.tsx
│  │  │  │  │  ├─ ComicForm.tsx
│  │  │  │  │  ├─ ComicCard.tsx
│  │  │  │  │  └─ ComicFilters.tsx
│  │  │  │  └─ Public/
│  │  │  │     ├─ ComicGrid.tsx
│  │  │  │     ├─ ComicCard.tsx
│  │  │  │     ├─ ComicDetails.tsx
│  │  │  │     └─ ComicSidebar.tsx
│  │  │  ├─ Comments/
│  │  │  │  ├─ Admin/
│  │  │  │  │  ├─ CommentModeration.tsx
│  │  │  │  │  └─ CommentList.tsx
│  │  │  │  └─ Public/
│  │  │  │     ├─ CommentForm.tsx
│  │  │  │     ├─ CommentItem.tsx
│  │  │  │     └─ CommentThread.tsx
│  │  │  ├─ Reviews/
│  │  │  │  └─ Public/
│  │  │  │     ├─ ReviewForm.tsx
│  │  │  │     ├─ ReviewList.tsx
│  │  │  │     └─ ReviewStats.tsx
│  │  │  ├─ Homepage/
│  │  │  │  └─ Public/
│  │  │  │     ├─ FeaturedComics.tsx
│  │  │  │     ├─ TrendingComics.tsx
│  │  │  │     ├─ NewReleases.tsx
│  │  │  │     └─ PopularCategories.tsx
│  │  │  └─ Shared/                  # Components dùng chung
│  │  │     ├─ ComicRating.tsx
│  │  │     ├─ ComicBadge.tsx
│  │  │     └─ ComicProgress.tsx
│  │  │
│  │  ├─ Ecommerce/                   # ✅ PascalCase
│  │  │  ├─ Products/
│  │  │  │  ├─ Attributes/
│  │  │  │  │  └─ Admin/
│  │  │  │  │     ├─ AttributeList.tsx
│  │  │  │  │     └─ AttributeForm.tsx
│  │  │  │  ├─ AttributeValues/
│  │  │  │  │  └─ Admin/
│  │  │  │  │     ├─ AttributeValueList.tsx
│  │  │  │  │     └─ AttributeValueForm.tsx
│  │  │  │  ├─ Categories/
│  │  │  │  │  ├─ Admin/
│  │  │  │  │  │  ├─ ProductCategoryList.tsx
│  │  │  │  │  │  └─ ProductCategoryForm.tsx
│  │  │  │  │  └─ Public/
│  │  │  │  │     ├─ CategoryTree.tsx
│  │  │  │  │     └─ CategoryFilter.tsx
│  │  │  │  ├─ ProductList/          # ✅ Đổi từ list/ → ProductList/
│  │  │  │  │  ├─ Admin/
│  │  │  │  │  │  ├─ ProductTable.tsx
│  │  │  │  │  │  ├─ ProductForm.tsx
│  │  │  │  │  │  └─ ProductBulkActions.tsx
│  │  │  │  │  └─ Public/
│  │  │  │  │     ├─ ProductGrid.tsx
│  │  │  │  │     ├─ ProductCard.tsx
│  │  │  │  │     ├─ ProductDetails.tsx
│  │  │  │  │     └─ ProductFilters.tsx
│  │  │  │  └─ Variants/
│  │  │  │     └─ Admin/
│  │  │  │        ├─ VariantList.tsx
│  │  │  │        ├─ VariantForm.tsx
│  │  │  │        └─ VariantMatrix.tsx
│  │  │  ├─ Orders/
│  │  │  │  └─ Admin/
│  │  │  │     ├─ OrderList.tsx
│  │  │  │     ├─ OrderDetails.tsx
│  │  │  │     ├─ OrderStatusUpdate.tsx
│  │  │  │     └─ OrderTimeline.tsx
│  │  │  ├─ Coupons/
│  │  │  │  └─ Admin/
│  │  │  │     ├─ CouponList.tsx
│  │  │  │     ├─ CouponForm.tsx
│  │  │  │     └─ CouponUsageStats.tsx
│  │  │  ├─ ShippingMethods/
│  │  │  │  ├─ Admin/
│  │  │  │  │  ├─ ShippingMethodList.tsx
│  │  │  │  │  └─ ShippingMethodForm.tsx
│  │  │  │  └─ Public/
│  │  │  │     ├─ ShippingMethodSelector.tsx
│  │  │  │     └─ ShippingCostCalculator.tsx
│  │  │  └─ Warehouses/
│  │  │     └─ Admin/
│  │  │        ├─ WarehouseList/
│  │  │        │  ├─ WarehouseTable.tsx
│  │  │        │  └─ WarehouseForm.tsx
│  │  │        ├─ Inventory/
│  │  │        │  ├─ InventoryTable.tsx
│  │  │        │  ├─ InventoryAdjustment.tsx
│  │  │        │  └─ StockAlerts.tsx
│  │  │        ├─ Imports/
│  │  │        │  ├─ ImportList.tsx
│  │  │        │  ├─ ImportForm.tsx
│  │  │        │  └─ ImportDetails.tsx
│  │  │        ├─ Exports/
│  │  │        │  ├─ ExportList.tsx
│  │  │        │  ├─ ExportForm.tsx
│  │  │        │  └─ ExportDetails.tsx
│  │  │        └─ Transfers/
│  │  │           ├─ TransferList.tsx
│  │  │           ├─ TransferForm.tsx
│  │  │           └─ TransferDetails.tsx
│  │  │
│  │  ├─ Posts/                       # ✅ PascalCase
│  │  │  ├─ Categories/
│  │  │  │  └─ Admin/
│  │  │  │     ├─ PostCategoryList.tsx
│  │  │  │     └─ PostCategoryForm.tsx
│  │  │  ├─ Tags/
│  │  │  │  └─ Admin/
│  │  │  │     ├─ TagList.tsx
│  │  │  │     └─ TagForm.tsx
│  │  │  ├─ PostList/                # ✅ Đổi từ list/ → PostList/
│  │  │  │  ├─ Admin/
│  │  │  │  │  ├─ PostTable.tsx
│  │  │  │  │  ├─ PostForm.tsx
│  │  │  │  │  ├─ PostEditor.tsx
│  │  │  │  │  └─ PostPreview.tsx
│  │  │  │  └─ Public/
│  │  │  │     ├─ PostGrid.tsx
│  │  │  │     ├─ PostCard.tsx
│  │  │  │     ├─ PostDetails.tsx
│  │  │  │     ├─ PostSidebar.tsx
│  │  │  │     └─ RelatedPosts.tsx
│  │  │  └─ Comments/
│  │  │     └─ Admin/
│  │  │        ├─ PostCommentList.tsx
│  │  │        └─ PostCommentModeration.tsx
│  │  │
│  │  ├─ Introduction/                # ✅ PascalCase
│  │  │  ├─ About/
│  │  │  │  └─ Admin/
│  │  │  │     ├─ AboutSectionList.tsx
│  │  │  │     └─ AboutSectionForm.tsx
│  │  │  ├─ Services/
│  │  │  │  ├─ Admin/
│  │  │  │  │  ├─ ServiceList.tsx
│  │  │  │  │  └─ ServiceForm.tsx
│  │  │  │  └─ Public/
│  │  │  │     ├─ ServiceGrid.tsx
│  │  │  │     ├─ ServiceCard.tsx
│  │  │  │     └─ ServiceDetails.tsx
│  │  │  ├─ Projects/
│  │  │  │  ├─ Admin/
│  │  │  │  │  ├─ ProjectList.tsx
│  │  │  │  │  └─ ProjectForm.tsx
│  │  │  │  └─ Public/
│  │  │  │     ├─ ProjectGrid.tsx
│  │  │  │     ├─ ProjectCard.tsx
│  │  │  │     └─ ProjectDetails.tsx
│  │  │  ├─ Staff/
│  │  │  │  ├─ Admin/
│  │  │  │  │  ├─ StaffList.tsx
│  │  │  │  │  └─ StaffForm.tsx
│  │  │  │  └─ Public/
│  │  │  │     ├─ StaffGrid.tsx
│  │  │  │     └─ StaffCard.tsx
│  │  │  ├─ Partners/
│  │  │  │  ├─ Admin/
│  │  │  │  │  ├─ PartnerList.tsx
│  │  │  │  │  └─ PartnerForm.tsx
│  │  │  │  └─ Public/
│  │  │  │     ├─ PartnerGrid.tsx
│  │  │  │     └─ PartnerLogo.tsx
│  │  │  ├─ Certificates/
│  │  │  │  ├─ Admin/
│  │  │  │  │  ├─ CertificateList.tsx
│  │  │  │  │  └─ CertificateForm.tsx
│  │  │  │  └─ Public/
│  │  │  │     ├─ CertificateGrid.tsx
│  │  │  │     └─ CertificateCard.tsx
│  │  │  ├─ Testimonials/
│  │  │  │  └─ Admin/
│  │  │  │     ├─ TestimonialList.tsx
│  │  │  │     └─ TestimonialForm.tsx
│  │  │  ├─ Galleries/               # ✅ Số nhiều
│  │  │  │  └─ Admin/
│  │  │  │     ├─ GalleryList.tsx
│  │  │  │     ├─ GalleryForm.tsx
│  │  │  │     └─ GalleryUpload.tsx
│  │  │  ├─ Faqs/
│  │  │  │  ├─ Admin/
│  │  │  │  │  ├─ FaqList.tsx
│  │  │  │  │  └─ FaqForm.tsx
│  │  │  │  └─ Public/
│  │  │  │     ├─ FaqAccordion.tsx
│  │  │  │     └─ FaqSearch.tsx
│  │  │  └─ Contacts/
│  │  │     ├─ Admin/
│  │  │     │  ├─ ContactList.tsx
│  │  │     │  └─ ContactDetails.tsx
│  │  │     └─ Public/
│  │  │        ├─ ContactForm.tsx
│  │  │        ├─ ContactInfo.tsx
│  │  │        └─ ContactMap.tsx
│  │  │
│  │  ├─ Marketing/                   # ✅ PascalCase
│  │  │  ├─ Banners/
│  │  │  │  ├─ Admin/
│  │  │  │  │  ├─ BannerList.tsx
│  │  │  │  │  ├─ BannerForm.tsx
│  │  │  │  │  └─ BannerPreview.tsx
│  │  │  │  └─ Public/
│  │  │  │     ├─ BannerSlider.tsx
│  │  │  │     └─ BannerCarousel.tsx
│  │  │  └─ Locations/
│  │  │     └─ Admin/
│  │  │        ├─ LocationList.tsx
│  │  │        └─ LocationForm.tsx
│  │  │
│  │  ├─ Payments/                    # ✅ PascalCase
│  │  │  └─ Methods/
│  │  │     └─ Admin/
│  │  │        ├─ PaymentMethodList.tsx
│  │  │        └─ PaymentMethodForm.tsx
│  │  │
│  │  ├─ Core/                        # ✅ PascalCase
│  │  │  ├─ Iam/                      # Identity & Access Management
│  │  │  │  ├─ Users/
│  │  │  │  │  └─ Admin/
│  │  │  │  │     ├─ UserList.tsx
│  │  │  │  │     ├─ UserForm.tsx
│  │  │  │  │     ├─ UserDetails.tsx
│  │  │  │  │     └─ UserPermissions.tsx
│  │  │  │  ├─ Roles/
│  │  │  │  │  └─ Admin/
│  │  │  │  │     ├─ RoleList.tsx
│  │  │  │  │     ├─ RoleForm.tsx
│  │  │  │  │     └─ RolePermissions.tsx
│  │  │  │  └─ Permissions/
│  │  │  │     └─ Admin/
│  │  │  │        ├─ PermissionList.tsx
│  │  │  │        ├─ PermissionForm.tsx
│  │  │  │        └─ PermissionMatrix.tsx
│  │  │  ├─ Groups/
│  │  │  │  └─ Admin/
│  │  │  │     ├─ GroupList.tsx
│  │  │  │     ├─ GroupForm.tsx
│  │  │  │     └─ GroupMembers.tsx
│  │  │  ├─ Menus/
│  │  │  │  └─ Admin/
│  │  │  │     ├─ MenuList.tsx
│  │  │  │     ├─ MenuForm.tsx
│  │  │  │     └─ MenuBuilder.tsx
│  │  │  ├─ ContentTemplates/
│  │  │  │  └─ Admin/
│  │  │  │     ├─ TemplateList.tsx
│  │  │  │     ├─ TemplateForm.tsx
│  │  │  │     └─ TemplateEditor.tsx
│  │  │  ├─ Contexts/
│  │  │  │  └─ Admin/
│  │  │  │     ├─ ContextList.tsx
│  │  │  │     └─ ContextForm.tsx
│  │  │  └─ SystemConfig/
│  │  │     └─ Admin/
│  │  │        ├─ GeneralSettings.tsx
│  │  │        ├─ EmailSettings.tsx
│  │  │        └─ NotificationSettings.tsx
│  │  │
│  │  └─ Users/                       # ✅ PascalCase - User-facing features
│  │     ├─ Profile/
│  │     │  ├─ ProfileView.tsx
│  │     │  ├─ ProfileEdit.tsx
│  │     │  └─ PasswordChange.tsx
│  │     ├─ Bookmarks/
│  │     │  ├─ BookmarkList.tsx
│  │     │  └─ BookmarkCard.tsx
│  │     ├─ Follows/
│  │     │  ├─ FollowList.tsx
│  │     │  └─ FollowCard.tsx
│  │     ├─ ReadingHistory/
│  │     │  ├─ HistoryList.tsx
│  │     │  └─ HistoryCard.tsx
│  │     └─ Notifications/
│  │        ├─ NotificationList.tsx
│  │        ├─ NotificationItem.tsx
│  │        └─ NotificationSettings.tsx
│  │
│  ├─ Layouts/                        # ✅ PascalCase - Layout components
│  │  ├─ Admin/
│  │  │  ├─ AdminLayout.tsx
│  │  │  ├─ AdminHeader/
│  │  │  │  ├─ AdminHeader.tsx
│  │  │  │  ├─ UserMenu.tsx
│  │  │  │  └─ NotificationBell.tsx
│  │  │  ├─ AdminSidebar/
│  │  │  │  ├─ AdminSidebar.tsx
│  │  │  │  ├─ NavItem.tsx
│  │  │  │  └─ NavGroup.tsx
│  │  │  └─ AdminFooter/
│  │  │     └─ AdminFooter.tsx
│  │  ├─ Public/
│  │  │  ├─ PublicLayout.tsx
│  │  │  ├─ PublicHeader/
│  │  │  │  ├─ PublicHeader.tsx
│  │  │  │  ├─ MainNav.tsx
│  │  │  │  ├─ MobileNav.tsx
│  │  │  │  └─ SearchBar.tsx
│  │  │  ├─ PublicFooter/
│  │  │  │  ├─ PublicFooter.tsx
│  │  │  │  ├─ FooterLinks.tsx
│  │  │  │  └─ FooterSocial.tsx
│  │  │  ├─ ContactChannels/
│  │  │  │  ├─ FloatingContact.tsx
│  │  │  │  └─ SocialLinks.tsx
│  │  │  └─ Sections/
│  │  │     ├─ Hero.tsx
│  │  │     ├─ Features.tsx
│  │  │     └─ CallToAction.tsx
│  │  └─ User/
│  │     ├─ UserLayout.tsx
│  │     ├─ UserHeader/
│  │     │  └─ UserHeader.tsx
│  │     └─ UserSidebar/
│  │        └─ UserSidebar.tsx
│  │
│  ├─ UI/                             # ✅ PascalCase - UI Design System
│  │  ├─ Forms/                      # Form controls
│  │  │  ├─ Input.tsx
│  │  │  ├─ Textarea.tsx
│  │  │  ├─ Select.tsx
│  │  │  ├─ Checkbox.tsx
│  │  │  ├─ Radio.tsx
│  │  │  ├─ DatePicker.tsx
│  │  │  ├─ TimePicker.tsx
│  │  │  ├─ FileUpload.tsx
│  │  │  └─ FormField.tsx
│  │  ├─ DataDisplay/                # Tables, lists, cards
│  │  │  ├─ Table/
│  │  │  │  ├─ Table.tsx
│  │  │  │  ├─ TableHeader.tsx
│  │  │  │  ├─ TableBody.tsx
│  │  │  │  ├─ TableRow.tsx
│  │  │  │  └─ TableCell.tsx
│  │  │  ├─ Card/
│  │  │  │  ├─ Card.tsx
│  │  │  │  ├─ CardHeader.tsx
│  │  │  │  ├─ CardBody.tsx
│  │  │  │  └─ CardFooter.tsx
│  │  │  ├─ List/
│  │  │  │  ├─ List.tsx
│  │  │  │  └─ ListItem.tsx
│  │  │  ├─ Badge.tsx
│  │  │  ├─ Tag.tsx
│  │  │  ├─ Avatar.tsx
│  │  │  └─ Stats.tsx
│  │  ├─ Feedback/                   # Toasts, alerts, modals
│  │  │  ├─ Toast/
│  │  │  │  ├─ Toast.tsx
│  │  │  │  ├─ ToastContainer.tsx
│  │  │  │  └─ useToast.ts
│  │  │  ├─ Alert.tsx
│  │  │  ├─ Modal/
│  │  │  │  ├─ Modal.tsx
│  │  │  │  ├─ ModalHeader.tsx
│  │  │  │  ├─ ModalBody.tsx
│  │  │  │  └─ ModalFooter.tsx
│  │  │  ├─ Dialog.tsx
│  │  │  ├─ Loading.tsx
│  │  │  ├─ Spinner.tsx
│  │  │  ├─ Skeleton.tsx
│  │  │  └─ Progress.tsx
│  │  ├─ Navigation/                 # Breadcrumbs, tabs, pagination
│  │  │  ├─ Breadcrumb/
│  │  │  │  ├─ Breadcrumb.tsx
│  │  │  │  └─ BreadcrumbItem.tsx
│  │  │  ├─ Tabs/
│  │  │  │  ├─ Tabs.tsx
│  │  │  │  ├─ TabList.tsx
│  │  │  │  ├─ Tab.tsx
│  │  │  │  └─ TabPanel.tsx
│  │  │  ├─ Pagination/
│  │  │  │  ├─ Pagination.tsx
│  │  │  │  └─ PaginationItem.tsx
│  │  │  ├─ Stepper/
│  │  │  │  ├─ Stepper.tsx
│  │  │  │  └─ Step.tsx
│  │  │  └─ Menu/
│  │  │     ├─ Menu.tsx
│  │  │     └─ MenuItem.tsx
│  │  ├─ Media/                      # Image, video players
│  │  │  ├─ Image.tsx
│  │  │  ├─ ImageGallery.tsx
│  │  │  ├─ VideoPlayer.tsx
│  │  │  └─ AudioPlayer.tsx
│  │  ├─ Filters/                    # Filter components
│  │  │  ├─ SearchFilter.tsx
│  │  │  ├─ DateRangeFilter.tsx
│  │  │  ├─ CategoryFilter.tsx
│  │  │  └─ SortFilter.tsx
│  │  └─ Overlays/                   # Modals, drawers, tooltips
│  │     ├─ Drawer/
│  │     │  ├─ Drawer.tsx
│  │     │  └─ DrawerContent.tsx
│  │     ├─ Popover/
│  │     │  ├─ Popover.tsx
│  │     │  └─ PopoverContent.tsx
│  │     ├─ Tooltip.tsx
│  │     └─ Dropdown/
│  │        ├─ Dropdown.tsx
│  │        └─ DropdownItem.tsx
│  │
│  └─ Shared/                         # ✅ PascalCase - Shared components
│     ├─ Birthday/
│     │  └─ BirthdayWish.tsx
│     ├─ SEO/
│     │  ├─ Meta.tsx
│     │  ├─ OpenGraph.tsx
│     │  └─ JsonLd.tsx
│     ├─ Analytics/
│     │  ├─ GoogleAnalytics.tsx
│     │  └─ FacebookPixel.tsx
│     └─ ErrorBoundaries/
│        ├─ ErrorBoundary.tsx
│        └─ ErrorFallback.tsx
│
├─ lib/                               # Libraries & utilities
│  ├─ api/                           # API clients
│  │  ├─ client/                    # Client-side API (cho browser)
│  │  │  ├─ axios-client.ts
│  │  │  └─ fetch-client.ts
│  │  ├─ server/                    # Server-side API (cho server components)
│  │  │  └─ fetch-server.ts
│  │  ├─ endpoints/                 # API endpoint definitions
│  │  │  ├─ comics.ts
│  │  │  ├─ products.ts
│  │  │  ├─ posts.ts
│  │  │  └─ users.ts
│  │  └─ interceptors/              # Request/response interceptors
│  │     ├─ auth-interceptor.ts
│  │     └─ error-interceptor.ts
│  ├─ auth/                          # Authentication utilities
│  │  ├─ session.ts
│  │  ├─ permissions.ts
│  │  └─ jwt.ts
│  ├─ database/                      # Database utilities
│  │  ├─ prisma.ts                  # Prisma client
│  │  ├─ mongodb.ts                 # MongoDB client (nếu dùng)
│  │  └─ queries/                   # Shared queries
│  ├─ validations/                   # Validation schemas (Zod, Yup, etc.)
│  │  ├─ comics.ts
│  │  ├─ products.ts
│  │  ├─ users.ts
│  │  └─ auth.ts
│  ├─ constants/                     # App constants
│  │  ├─ app.ts
│  │  ├─ routes.ts
│  │  ├─ permissions.ts
│  │  └─ status.ts
│  └─ stores/                        # State management (Zustand, Redux, etc.)
│     ├─ auth-store.ts
│     ├─ ui-store.ts
│     ├─ cart-store.ts
│     └─ notification-store.ts
│
├─ hooks/                             # Custom React hooks
│  ├─ auth/
│  │  ├─ use-auth.ts
│  │  ├─ use-user.ts
│  │  └─ use-permissions.ts
│  ├─ data/
│  │  ├─ use-comics.ts
│  │  ├─ use-products.ts
│  │  └─ use-posts.ts
│  ├─ ui/
│  │  ├─ use-media-query.ts
│  │  ├─ use-toast.ts
│  │  ├─ use-modal.ts
│  │  └─ use-theme.ts
│  └─ utils/
│     ├─ use-local-storage.ts
│     ├─ use-debounce.ts
│     └─ use-clipboard.ts
│
├─ types/                             # TypeScript types
│  ├─ api/                           # API types
│  │  ├─ request.ts
│  │  └─ response.ts
│  ├─ models/                        # Data models
│  │  ├─ comic.ts
│  │  ├─ product.ts
│  │  ├─ post.ts
│  │  └─ user.ts
│  ├─ ui/                            # UI component types
│  │  └─ common.ts
│  └─ index.ts                       # Export all types
│
├─ utils/                             # Utility functions
│  ├─ formatters/                    # Formatters
│  │  ├─ date.ts
│  │  ├─ number.ts
│  │  ├─ currency.ts
│  │  └─ text.ts
│  ├─ validators/                    # Validation helpers
│  │  ├─ email.ts
│  │  ├─ phone.ts
│  │  └─ url.ts
│  ├─ helpers/                       # General helpers
│  │  ├─ string.ts
│  │  ├─ array.ts
│  │  ├─ object.ts
│  │  └─ file.ts
│  └─ transformers/                  # Data transformers
│     ├─ api-to-model.ts
│     └─ model-to-view.ts
│
├─ styles/                            # Global styles
│  ├─ globals.css
│  ├─ variables.css
│  ├─ themes/
│  │  ├─ light.css
│  │  └─ dark.css
│  └─ fonts/
│     └─ custom-fonts.css
│
├─ config/                            # Configuration files
│  ├─ site.ts                        # Site metadata
│  ├─ navigation.ts                  # Navigation config
│  ├─ features.ts                    # Feature flags
│  └─ env.ts                         # Environment variables
│
├─ middleware/                        # Next.js middlewares
│  └─ auth-middleware.ts
│
└─ public/                            # Static files
   ├─ images/
   │  ├─ logos/
   │  ├─ banners/
   │  └─ placeholders/
   ├─ icons/
   │  └─ favicon.ico
   └─ fonts/


═══════════════════════════════════════════════════════════════
QUY TẮC NAMING HOÀN CHỈNH:
═══════════════════════════════════════════════════════════════

1. ✅ ROUTES (app/): kebab-case
   - app/(admin)/admin/comics/categories/
   - app/(public)/posts/categories/[slug]/

2. ✅ COMPONENTS: PascalCase
   - components/Features/Comics/ComicList/
   - components/UI/Forms/Input.tsx
   - components/Layouts/Admin/AdminHeader.tsx

3. ✅ FILES:
   - Component files: PascalCase.tsx (Input.tsx, ComicCard.tsx)
   - Utility files: kebab-case.ts (use-auth.ts, date-formatter.ts)
   - Config files: kebab-case.ts (site-config.ts)
   - Hook files: use-*.ts (use-auth.ts, use-modal.ts)

4. ✅ FOLDERS:
   - Component folders: PascalCase (Comics/, Header/, UserMenu/)
   - Utility folders: kebab-case (api/, formatters/, validators/)
   - Route folders: kebab-case (posts/, user-profile/)

5. ✅ EXPORTS:
   - Named exports cho utilities: export const formatDate = ...
   - Default exports cho components: export default ComicCard
   - Named exports cho types: export type Comic = ...

═══════════════════════════════════════════════════════════════
VÍ DỤ CỤ THỂ:
═══════════════════════════════════════════════════════════════

📁 components/Features/Comics/ComicList/Admin/
├─ ComicTable.tsx              # Component chính
├─ ComicFilters.tsx            # Component phụ
├─ ComicTableRow.tsx           # Sub-component
├─ use-comic-table.ts          # Custom hook (camelCase với use-)
└─ comic-table.types.ts        # Types file (kebab-case)

📁 lib/api/endpoints/
├─ comics.ts                   # kebab-case
├─ products.ts                 # kebab-case
└─ users.ts                    # kebab-case

📁 app/(public)/comics/
├─ page.tsx                    # Next.js convention
├─ layout.tsx                  # Next.js convention
└─ [slug]/
   └─ page.tsx

═══════════════════════════════════════════════════════════════
LỢI ÍCH CỦA CẤU TRÚC MỚI:
═══════════════════════════════════════════════════════════════

✅ Nhất quán: Tất cả components đều PascalCase
✅ Dễ đọc: Nhìn vào là biết đây là component
✅ Dễ import: import { ComicCard } from '@/components/Features/Comics/ComicList/Public'
✅ Autocomplete tốt: IDE suggest chính xác hơn
✅ Tránh conflict: Không bị nhầm với utility functions
✅ Team-friendly: Ai cũng hiểu convention
✅ Scalable: Dễ mở rộng khi project lớn