src/components/
├── comics/                           ← Module: SỐ NHIỀU
│   ├── comic/                        ← Entity: SỐ ÍT, không prefix
│   │   ├── domain/
│   │   ├── admin/                    ← Scope: SỐ ÍT
│   │   │   ├── AdminComics.tsx
│   │   │   ├── ComicList.tsx
│   │   │   ├── ComicForm.tsx
│   │   │   ├── ComicFilter.tsx
│   │   │   ├── CreateComic.tsx
│   │   │   ├── EditComic.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/                   ← Scope: SỐ ÍT
│   │   │   ├── ComicCard.tsx
│   │   │   ├── ComicDetail.tsx
│   │   │   ├── ComicSection.tsx
│   │   │   ├── TrendingHero.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── user/                     ← Scope: SỐ ÍT
│   │   │   ├── MyComics.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── category/                     ← Entity: SỐ ÍT (KHÔNG dùng comic-category)
│   │   ├── domain/
│   │   ├── admin/
│   │   │   ├── AdminComicCategories.tsx
│   │   │   ├── ComicCategoryList.tsx
│   │   │   ├── ComicCategoryForm.tsx
│   │   │   ├── ComicCategoryFilter.tsx
│   │   │   ├── CreateComicCategory.tsx
│   │   │   ├── EditComicCategory.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/
│   │   │   ├── CategorySelect.tsx
│   │   │   ├── CategorySidebar.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── chapter/                      ← Entity: SỐ ÍT (KHÔNG dùng comic-chapter)
│   │   ├── domain/
│   │   ├── admin/
│   │   │   ├── AdminChapters.tsx
│   │   │   ├── ChapterList.tsx
│   │   │   ├── ChapterForm.tsx
│   │   │   ├── ChapterFilter.tsx
│   │   │   ├── CreateChapter.tsx
│   │   │   ├── EditChapter.tsx
│   │   │   ├── PageManager.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/
│   │   │   ├── ChapterList.tsx
│   │   │   ├── ReadingToolbar.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── comment/                      ← Entity: SỐ ÍT
│   │   ├── domain/
│   │   ├── admin/
│   │   │   ├── AdminComicComments.tsx
│   │   │   ├── ComicCommentFilter.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/
│   │   │   ├── CommentSection.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── user/
│   │   │   ├── MyComments.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── review/                       ← Entity: SỐ ÍT
│   │   ├── domain/
│   │   ├── admin/
│   │   ├── public/
│   │   │   ├── ReviewSection.tsx
│   │   │   └── index.ts
│   │   ├── user/
│   │   └── index.ts
│   │
│   ├── bookmark/                     ← Entity: SỐ ÍT
│   │   ├── domain/
│   │   ├── user/
│   │   │   ├── BookmarkButton.tsx
│   │   │   ├── BookmarkList.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── follow/                       ← Entity: SỐ ÍT
│   │   ├── domain/
│   │   ├── user/
│   │   │   ├── FollowButton.tsx
│   │   │   ├── FollowingList.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── reading-history/              ← Entity: SỐ ÍT (từ ghép)
│   │   ├── domain/
│   │   ├── user/
│   │   │   ├── HistoryList.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── stats/                        ← Entity: SỐ NHIỀU (stats luôn số nhiều)
│   │   ├── domain/
│   │   ├── admin/
│   │   │   ├── ComicStatistics.tsx
│   │   │   └── index.ts
│   │   ├── public/
│   │   ├── user/
│   │   └── index.ts
│   │
│   ├── homepage/                     ← Entity: SỐ ÍT (feature đặc biệt)
│   │   └── public/
│   │       ├── HomePageContent.tsx
│   │       └── index.ts
│   │
│   └── shared/                       ← Shared trong module comics
│       ├── ComicCard.tsx
│       └── index.ts
│
├── posts/                            ← Module: SỐ NHIỀU
│   ├── post/                         ← Entity: SỐ ÍT
│   │   ├── domain/
│   │   ├── admin/
│   │   │   ├── AdminPosts.tsx
│   │   │   ├── PostList.tsx
│   │   │   ├── PostForm.tsx
│   │   │   ├── PostFilter.tsx
│   │   │   ├── CreatePost.tsx
│   │   │   ├── EditPost.tsx
│   │   │   ├── AdminPostStatistics.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/
│   │   │   ├── PostList.tsx
│   │   │   ├── PostCard.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── user/
│   │   └── index.ts
│   │
│   ├── category/                     ← Entity: SỐ ÍT (KHÔNG dùng post-category)
│   │   ├── domain/
│   │   ├── admin/
│   │   │   ├── AdminPostCategories.tsx
│   │   │   ├── PostCategoryList.tsx
│   │   │   ├── PostCategoryForm.tsx
│   │   │   ├── PostCategoryFilter.tsx
│   │   │   ├── CreatePostCategory.tsx
│   │   │   ├── EditPostCategory.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/
│   │   └── index.ts
│   │
│   ├── tag/                          ← Entity: SỐ ÍT (KHÔNG dùng post-tag)
│   │   ├── domain/
│   │   ├── admin/
│   │   │   ├── AdminPostTags.tsx
│   │   │   ├── PostTagList.tsx
│   │   │   ├── PostTagForm.tsx
│   │   │   ├── PostTagFilter.tsx
│   │   │   ├── CreatePostTag.tsx
│   │   │   ├── EditPostTag.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/
│   │   └── index.ts
│   │
│   ├── comment/                      ← Entity: SỐ ÍT
│   │   ├── domain/
│   │   ├── admin/
│   │   │   ├── AdminPostComments.tsx
│   │   │   ├── PostCommentFilter.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/
│   │   │   ├── PostComments.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── user/
│   │   └── index.ts
│   │
│   └── shared/
│
├── products/                         ← Module: SỐ NHIỀU
│   ├── product/                      ← Entity: SỐ ÍT
│   │   ├── domain/
│   │   ├── admin/
│   │   │   ├── AdminProducts.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductFilter.tsx
│   │   │   ├── CreateProduct.tsx
│   │   │   ├── EditProduct.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── user/
│   │   └── index.ts
│   │
│   ├── category/                     ← Entity: SỐ ÍT
│   │   ├── admin/
│   │   │   ├── AdminProductCategories.tsx
│   │   │   ├── ProductCategoryList.tsx
│   │   │   ├── ProductCategoryForm.tsx
│   │   │   ├── ProductCategoryFilter.tsx
│   │   │   ├── CreateProductCategory.tsx
│   │   │   ├── EditProductCategory.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/
│   │   │   ├── CategoryMenu.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── variant/                      ← Entity: SỐ ÍT
│   │   ├── admin/
│   │   │   ├── AdminProductVariants.tsx
│   │   │   ├── ProductVariantList.tsx
│   │   │   ├── ProductVariantForm.tsx
│   │   │   ├── ProductVariantFilter.tsx
│   │   │   ├── CreateProductVariant.tsx
│   │   │   ├── EditProductVariant.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── attribute/                    ← Entity: SỐ ÍT
│   │   ├── admin/
│   │   │   ├── AdminProductAttributes.tsx
│   │   │   ├── ProductAttributeList.tsx
│   │   │   ├── ProductAttributeForm.tsx
│   │   │   ├── ProductAttributeFilter.tsx
│   │   │   ├── CreateProductAttribute.tsx
│   │   │   ├── EditProductAttribute.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── attribute-value/              ← Entity: SỐ ÍT (từ ghép)
│   │   ├── admin/
│   │   │   ├── AdminProductAttributeValues.tsx
│   │   │   ├── ProductAttributeValueList.tsx
│   │   │   ├── ProductAttributeValueForm.tsx
│   │   │   ├── ProductAttributeValueFilter.tsx
│   │   │   ├── CreateProductAttributeValue.tsx
│   │   │   ├── EditProductAttributeValue.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── order/                        ← Entity: SỐ ÍT
│   │   ├── domain/
│   │   ├── admin/
│   │   │   ├── AdminOrders.tsx
│   │   │   ├── OrderList.tsx
│   │   │   ├── OrderDetail.tsx
│   │   │   ├── OrderFilter.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── user/
│   │   │   ├── MyOrders.tsx
│   │   │   ├── OrderTracking.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── coupon/                       ← Entity: SỐ ÍT
│   │   ├── admin/
│   │   │   ├── AdminCoupons.tsx
│   │   │   ├── CouponList.tsx
│   │   │   ├── CouponForm.tsx
│   │   │   ├── CouponFilter.tsx
│   │   │   ├── CreateCoupon.tsx
│   │   │   ├── EditCoupon.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── shipping-method/              ← Entity: SỐ ÍT (từ ghép)
│   │   ├── admin/
│   │   │   ├── AdminShippingMethods.tsx
│   │   │   ├── ShippingMethodList.tsx
│   │   │   ├── ShippingMethodForm.tsx
│   │   │   ├── ShippingMethodFilter.tsx
│   │   │   ├── CreateShippingMethod.tsx
│   │   │   ├── EditShippingMethod.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/
│   │   │   ├── ShippingSelector.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── warehouse/                    ← Entity: SỐ ÍT
│   │   ├── admin/
│   │   │   ├── AdminWarehouses.tsx
│   │   │   ├── WarehouseList.tsx
│   │   │   ├── WarehouseForm.tsx
│   │   │   ├── WarehouseFilter.tsx
│   │   │   ├── CreateWarehouse.tsx
│   │   │   ├── EditWarehouse.tsx
│   │   │   ├── WarehouseInventory.tsx
│   │   │   ├── InventoryFilter.tsx
│   │   │   ├── UpdateInventoryModal.tsx
│   │   │   ├── WarehouseImportList.tsx
│   │   │   ├── ImportDetail.tsx
│   │   │   ├── ImportFilter.tsx
│   │   │   ├── CreateImportModal.tsx
│   │   │   ├── WarehouseExportList.tsx
│   │   │   ├── ExportDetail.tsx
│   │   │   ├── ExportFilter.tsx
│   │   │   ├── CreateExportModal.tsx
│   │   │   ├── WarehouseTransferList.tsx
│   │   │   ├── TransferDetail.tsx
│   │   │   ├── TransferFilter.tsx
│   │   │   ├── CreateTransferModal.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   └── shared/
│
├── introduction/                     ← Module: SỐ ÍT (tên riêng)
│   ├── about-section/                ← Entity: SỐ ÍT
│   │   ├── admin/
│   │   │   ├── AdminAboutSections.tsx
│   │   │   ├── AboutSectionList.tsx
│   │   │   ├── AboutSectionForm.tsx
│   │   │   ├── AboutSectionFilter.tsx
│   │   │   ├── CreateAboutSection.tsx
│   │   │   ├── EditAboutSection.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/
│   │   └── index.ts
│   │
│   ├── staff/                        ← Entity: SỐ ÍT (danh từ không đếm được)
│   │   ├── admin/
│   │   │   ├── AdminStaff.tsx
│   │   │   ├── StaffList.tsx
│   │   │   ├── StaffForm.tsx
│   │   │   ├── StaffFilter.tsx
│   │   │   ├── CreateStaff.tsx
│   │   │   ├── EditStaff.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/
│   │   │   ├── StaffList.tsx
│   │   │   ├── StaffCarousel.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── certificate/                  ← Entity: SỐ ÍT
│   │   ├── admin/
│   │   │   ├── AdminCertificates.tsx
│   │   │   ├── CertificateList.tsx
│   │   │   ├── CertificateForm.tsx
│   │   │   ├── CertificateFilter.tsx
│   │   │   ├── CreateCertificate.tsx
│   │   │   ├── EditCertificate.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/
│   │   │   ├── CertificateList.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── testimonial/                  ← Entity: SỐ ÍT
│   │   ├── admin/
│   │   │   ├── AdminTestimonials.tsx
│   │   │   ├── TestimonialList.tsx
│   │   │   ├── TestimonialForm.tsx
│   │   │   ├── TestimonialFilter.tsx
│   │   │   ├── CreateTestimonial.tsx
│   │   │   ├── EditTestimonial.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/
│   │   └── index.ts
│   │
│   ├── faq/                          ← Entity: SỐ ÍT
│   │   ├── admin/
│   │   │   ├── AdminFAQs.tsx
│   │   │   ├── FAQList.tsx
│   │   │   ├── FAQForm.tsx
│   │   │   ├── FAQFilter.tsx
│   │   │   ├── CreateFAQ.tsx
│   │   │   ├── EditFAQ.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/
│   │   │   ├── FaqAccordion.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── contact/                      ← Entity: SỐ ÍT
│   │   ├── admin/
│   │   │   ├── AdminContacts.tsx
│   │   │   ├── ContactList.tsx
│   │   │   ├── ContactFilter.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/
│   │   │   ├── ContactForm.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── project/                      ← Entity: SỐ ÍT
│   │   ├── admin/
│   │   │   ├── AdminProjects.tsx
│   │   │   ├── ProjectList.tsx
│   │   │   ├── ProjectForm.tsx
│   │   │   ├── ProjectFilter.tsx
│   │   │   ├── CreateProject.tsx
│   │   │   ├── EditProject.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/
│   │   │   ├── ProjectFilter.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── gallery/                      ← Entity: SỐ ÍT (danh từ tập hợp)
│   │   ├── admin/
│   │   │   ├── AdminGallery.tsx
│   │   │   ├── GalleryList.tsx
│   │   │   ├── GalleryForm.tsx
│   │   │   ├── GalleryFilter.tsx
│   │   │   ├── CreateGallery.tsx
│   │   │   ├── EditGallery.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/
│   │   └── index.ts
│   │
│   ├── partner/                      ← Entity: SỐ ÍT
│   │   ├── admin/
│   │   │   ├── AdminPartners.tsx
│   │   │   ├── PartnerList.tsx
│   │   │   ├── PartnerForm.tsx
│   │   │   ├── PartnerFilter.tsx
│   │   │   ├── CreatePartner.tsx
│   │   │   ├── EditPartner.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/
│   │   │   ├── PartnerCarousel.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   └── shared/
│
├── marketing/                        ← Module: SỐ ÍT (danh từ không đếm được)
│   ├── banner/                       ← Entity: SỐ ÍT
│   │   ├── admin/
│   │   │   ├── AdminBanners.tsx
│   │   │   ├── BannerList.tsx
│   │   │   ├── BannerForm.tsx
│   │   │   ├── BannerFilter.tsx
│   │   │   ├── CreateBanner.tsx
│   │   │   ├── EditBanner.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/
│   │   │   ├── BannerGrid.tsx
│   │   │   ├── BannerSlider.tsx
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── SidebarBanner.tsx
│   │   │   ├── SimpleBanner.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── banner-location/              ← Entity: SỐ ÍT (từ ghép)
│   │   ├── admin/
│   │   │   ├── AdminBannerLocations.tsx
│   │   │   ├── BannerLocationList.tsx
│   │   │   ├── BannerLocationForm.tsx
│   │   │   ├── BannerLocationFilter.tsx
│   │   │   ├── CreateBannerLocation.tsx
│   │   │   ├── EditBannerLocation.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   └── shared/
│
├── payments/                         ← Module: SỐ NHIỀU
│   ├── payment-method/               ← Entity: SỐ ÍT (từ ghép)
│   │   ├── admin/
│   │   │   ├── AdminPaymentMethods.tsx
│   │   │   ├── PaymentMethodList.tsx
│   │   │   ├── PaymentMethodForm.tsx
│   │   │   ├── PaymentMethodFilter.tsx
│   │   │   ├── CreatePaymentMethod.tsx
│   │   │   ├── EditPaymentMethod.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── public/
│   │   │   ├── PaymentMethodSelector.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   └── shared/
│
├── users/                            ← Module: SỐ NHIỀU
│   ├── user/                         ← Entity: SỐ ÍT
│   │   ├── admin/
│   │   │   ├── AdminUsers.tsx
│   │   │   ├── UserList.tsx
│   │   │   ├── UserForm.tsx
│   │   │   ├── UserFilter.tsx
│   │   │   ├── CreateUser.tsx
│   │   │   ├── EditUser.tsx
│   │   │   ├── AssignRole.tsx
│   │   │   ├── ChangePassword.tsx
│   │   │   ├── ChangePasswordForm.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── user/
│   │   │   ├── UserProfile.tsx
│   │   │   ├── UpdateProfile.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── role/                         ← Entity: SỐ ÍT
│   │   ├── admin/
│   │   │   ├── AdminRoles.tsx
│   │   │   ├── RoleList.tsx
│   │   │   ├── RoleForm.tsx
│   │   │   ├── RoleFilter.tsx
│   │   │   ├── CreateRole.tsx
│   │   │   ├── EditRole.tsx
│   │   │   ├── AssignPermissions.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── permission/                   ← Entity: SỐ ÍT
│   │   ├── admin/
│   │   │   ├── AdminPermissions.tsx
│   │   │   ├── PermissionList.tsx
│   │   │   ├── PermissionForm.tsx
│   │   │   ├── PermissionFilter.tsx
│   │   │   ├── CreatePermission.tsx
│   │   │   ├── EditPermission.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   └── shared/
│
├── core/                             ← Module: SỐ ÍT (danh từ tập hợp)
│   ├── group/                        ← Entity: SỐ ÍT
│   │   ├── admin/
│   │   │   ├── AdminGroups.tsx
│   │   │   ├── GroupList.tsx
│   │   │   ├── GroupForm.tsx
│   │   │   ├── GroupFilter.tsx
│   │   │   ├── CreateGroup.tsx
│   │   │   ├── EditGroup.tsx
│   │   │   ├── GroupMembers.tsx
│   │   │   ├── AddMemberModal.tsx
│   │   │   ├── EditMemberRolesModal.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── menu/                         ← Entity: SỐ ÍT
│   │   ├── admin/
│   │   │   ├── AdminMenus.tsx
│   │   │   ├── MenuList.tsx
│   │   │   ├── MenuForm.tsx
│   │   │   ├── MenuFilter.tsx
│   │   │   ├── CreateMenu.tsx
│   │   │   ├── EditMenu.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── context/                      ← Entity: SỐ ÍT
│   │   ├── admin/
│   │   │   ├── AdminContexts.tsx
│   │   │   ├── ContextList.tsx
│   │   │   ├── ContextForm.tsx
│   │   │   ├── ContextFilter.tsx
│   │   │   ├── CreateContext.tsx
│   │   │   ├── EditContext.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── content-template/             ← Entity: SỐ ÍT (từ ghép)
│   │   ├── admin/
│   │   │   ├── AdminContentTemplates.tsx
│   │   │   ├── ContentTemplateList.tsx
│   │   │   ├── ContentTemplateForm.tsx
│   │   │   ├── ContentTemplateFilter.tsx
│   │   │   ├── ContentTemplateTestModal.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── system-config/                ← Entity: SỐ ÍT (từ ghép)
│   │   ├── admin/
│   │   │   ├── AdminSystemConfigs.tsx
│   │   │   ├── SystemConfigList.tsx
│   │   │   ├── SystemConfigForm.tsx
│   │   │   ├── ContactChannelsManager.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   └── shared/
│
└── shared/                           ← Global Shared
    ├── ui/
    │   ├── data-display/
    │   │   ├── Actions.tsx
    │   │   ├── DataTable.tsx
    │   │   ├── Pagination.tsx
    │   │   ├── StatusBadge.tsx
    │   │   ├── UserCard.tsx
    │   │   └── index.ts
    │   │
    │   ├── feedback/
    │   │   ├── BannerSkeleton.tsx
    │   │   ├── ConfirmModal.tsx
    │   │   ├── LoadingSpinner.tsx
    │   │   ├── Modal.tsx
    │   │   ├── PostCardSkeleton.tsx
    │   │   ├── ProductCardSkeleton.tsx
    │   │   ├── SkeletonLoader.tsx
    │   │   ├── ToastContainer.tsx
    │   │   └── index.ts
    │   │
    │   ├── filters/
    │   │   ├── DateRangeFilter.tsx
    │   │   ├── MultiSelectFilter.tsx
    │   │   ├── SelectFilter.tsx
    │   │   ├── TextFilter.tsx
    │   │   └── index.ts
    │   │
    │   ├── forms/
    │   │   ├── CKEditor.tsx
    │   │   ├── FormField.tsx
    │   │   ├── FormWrapper.tsx
    │   │   ├── ImageUploader.tsx
    │   │   ├── MultipleImageUploader.tsx
    │   │   ├── MultipleSelect.tsx
    │   │   ├── SearchableSelect.tsx
    │   │   ├── SimpleEditor.tsx
    │   │   ├── SingleSelectEnhanced.tsx
    │   │   ├── Upload.tsx
    │   │   └── index.ts
    │   │
    │   ├── media/
    │   │   ├── BaseSlider.tsx
    │   │   ├── HtmlContent.tsx
    │   │   ├── OptimizedImage.tsx
    │   │   └── index.ts
    │   │
    │   └── navigation/
    │       ├── Button.tsx
    │       ├── GroupSwitcher.tsx
    │       ├── NavigationProgress.tsx
    │       ├── OptimizedLink.tsx
    │       ├── PageBanner.tsx
    │       ├── PageMeta.tsx
    │       ├── PageTransition.tsx
    │       ├── ShareButton.tsx
    │       └── index.ts
    │
    ├── layout/
    │   ├── admin/
    │   │   ├── header/
    │   │   │   ├── AdminHeader.tsx
    │   │   │   ├── HeaderBar.tsx
    │   │   │   ├── UserDropdown.tsx
    │   │   │   └── index.ts
    │   │   │
    │   │   ├── sidebar/
    │   │   │   ├── AdminSidebar.tsx
    │   │   │   ├── SidebarMenu.tsx
    │   │   │   └── index.ts
    │   │   │
    │   │   ├── AdminLayoutClient.tsx
    │   │   └── index.ts
    │   │
    │   └── public/
    │       ├── header/
    │       │   ├── PublicHeader.tsx
    │       │   └── index.ts
    │       │
    │       ├── footer/
    │       │   ├── PublicFooter.tsx
    │       │   ├── SystemFooter.tsx
    │       │   └── index.ts
    │       │
    │       ├── contact-channels/
    │       │   ├── ContactChannels.tsx
    │       │   ├── FloatingContactChannels.tsx
    │       │   └── index.ts
    │       │
    │       ├── sections/
    │       │   ├── CustomSection.tsx
    │       │   └── index.ts
    │       │
    │       ├── PublicLayoutWrapper.tsx
    │       └── index.ts
    │
    ├── admin/
    │   ├── AdminFilter.tsx
    │   ├── IconSelector.tsx
    │   └── index.ts
    │
    └── birthday/
        ├── BirthdayContent.tsx
        └── index.ts


✅ CHUẨN MỰC DUY NHẤT - PHIÊN BẢN CUỐI CÙNG
QUY TẮC ĐƠN GIẢN:
Cấp độQuy tắcVí dụModule (cấp 1)Số nhiềucomics/, posts/, products/Entity (cấp 2)Số ít, KHÔNG prefixcomic/, chapter/, comment/Scope (cấp 3)Số ítadmin/, public/, user/

📋 BẢNG QUY TẮC CHỐT
Cấp độQuy tắcVí dụ ✅Sai ❌ModuleSố nhiềucomics/, posts/, products/, users/, payments/comic/, post/, product/Module đặc biệtSố ítintroduction/, marketing/, core/introductions/EntitySố ítcomic/, chapter/, comment/, category/comics/, chapters/, comments/, categories/Entity (từ ghép)Số ít + gạch nốireading-history/, attribute-value/, banner-location/reading_history/, attributeValue/ScopeSố ítadmin/, public/, user/admins/, publics/, users/PrefixKHÔNG dùngcomics/chapter/comics/comic-chapter/Trường hợp đặc biệtTheo từstaff/ (không đếm được), stats/ (luôn số nhiều)staffs/, stat/

🎯 TÓM TẮT

Module: SỐ NHIỀU - comics/, posts/, products/, users/, payments/
Entity: SỐ ÍT - comic/, chapter/, comment/, category/, tag/
Scope: SỐ ÍT - admin/, public/, user/
KHÔNG PREFIX - comics/chapter/ (KHÔNG phải comics/comic-chapter/)
Từ ghép: GẠCH NỐI - reading-history/, payment-method/, attribute-value/

Đây là CHUẨN DUY NHẤT - Không thay đổi! ✅