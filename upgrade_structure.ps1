$base = "d:\ecommerce-fe\src\components"
$admin = "$base\admin"
$public = "$base\public"

function MkDir($path) { if (!(Test-Path $path)) { New-Item -ItemType Directory -Force -Path $path | Out-Null } }
function MvDirContent($src, $dest) { 
    if (Test-Path $src) { 
        Get-ChildItem -Path $src | Move-Item -Destination $dest -Force
        if ((Get-ChildItem -Path $src).Count -eq 0) { Remove-Item -Path $src -Force }
    } 
}
function MvFile($src, $dest) { if (Test-Path $src) { Move-Item -Path $src -Destination $dest -Force } }

# --- COMICS ---
MkDir "$base\comics\comic\admin"
MvDirContent "$admin\comics\comics-management" "$base\comics\comic\admin"

MkDir "$base\comics\category\admin"
MvDirContent "$admin\comics\categories" "$base\comics\category\admin"

MkDir "$base\comics\chapter\admin"
MvDirContent "$admin\comics\chapters" "$base\comics\chapter\admin"

MkDir "$base\comics\comment\admin"
MvDirContent "$admin\comics\comments" "$base\comics\comment\admin"

MkDir "$base\comics\review\admin"
MvDirContent "$admin\comics\review" "$base\comics\review\admin"

MkDir "$base\comics\stats\admin"
MvDirContent "$admin\comics\stats" "$base\comics\stats\admin"

MkDir "$base\comics\category\public"
MvFile "$public\comics\CategorySelect.tsx" "$base\comics\category\public"
MvFile "$public\comics\CategorySidebar.tsx" "$base\comics\category\public"

MkDir "$base\comics\chapter\public"
MvFile "$public\comics\ChapterList.tsx" "$base\comics\chapter\public"
MvFile "$public\comics\ReadingToolbar.tsx" "$base\comics\chapter\public"
MvFile "$public\comics\Pagination.tsx" "$base\comics\chapter\public"

MkDir "$base\comics\comic\public"
MvFile "$public\comics\ComicCard.tsx" "$base\comics\comic\public"
MvFile "$public\comics\ComicSection.tsx" "$base\comics\comic\public"
MvFile "$public\comics\TrendingHero.tsx" "$base\comics\comic\public"

MkDir "$base\comics\comment\public"
MvDirContent "$public\comics\comments" "$base\comics\comment\public"

MkDir "$base\comics\review\public"
MvDirContent "$public\comics\reviews" "$base\comics\review\public"

MkDir "$base\comics\homepage\public"
MvFile "$public\home\HomePageContent.tsx" "$base\comics\homepage\public"

MkDir "$base\comics\shared"
MvFile "$public\home\ComicCard.tsx" "$base\comics\shared"

# --- PRODUCTS ---
MkDir "$base\products\product\admin"
MvDirContent "$admin\ecommerce\products\products-management" "$base\products\product\admin"

MkDir "$base\products\category\admin"
MvDirContent "$admin\ecommerce\products\categories" "$base\products\category\admin"

MkDir "$base\products\variant\admin"
MvDirContent "$admin\ecommerce\products\variants" "$base\products\variant\admin"

MkDir "$base\products\attribute\admin"
MvDirContent "$admin\ecommerce\products\attributes" "$base\products\attribute\admin"

MkDir "$base\products\attribute-value\admin"
MvDirContent "$admin\ecommerce\products\attribute-values" "$base\products\attribute-value\admin"

MkDir "$base\products\coupon\admin"
MvDirContent "$admin\ecommerce\coupons" "$base\products\coupon\admin"

MkDir "$base\products\order\admin"
MvDirContent "$admin\ecommerce\orders" "$base\products\order\admin"

MkDir "$base\products\shipping-method\admin"
MvDirContent "$admin\ecommerce\shippings" "$base\products\shipping-method\admin"

MkDir "$base\products\warehouse\admin"
MvDirContent "$admin\ecommerce\warehouses" "$base\products\warehouse\admin"

MkDir "$base\products\category\public"
MvFile "$public\ecommerce\CategoryMenu.tsx" "$base\products\category\public"

MkDir "$base\products\shipping-method\public"
MvFile "$public\ecommerce\ShippingSelector.tsx" "$base\products\shipping-method\public"

# --- POSTS ---
MkDir "$base\posts\post\admin"
MvDirContent "$admin\post\post" "$base\posts\post\admin"

MkDir "$base\posts\category\admin"
MvDirContent "$admin\post\category" "$base\posts\category\admin"

MkDir "$base\posts\tag\admin"
MvDirContent "$admin\post\tag" "$base\posts\tag\admin"

MkDir "$base\posts\comment\admin"
MvDirContent "$admin\post\comment" "$base\posts\comment\admin"

MkDir "$base\posts\post\public"
MvDirContent "$public\posts" "$base\posts\post\public"

# --- USERS ---
MkDir "$base\users\user\admin"
MvDirContent "$admin\core\iam\user" "$base\users\user\admin"

MkDir "$base\users\role\admin"
MvDirContent "$admin\core\iam\role" "$base\users\role\admin"

MkDir "$base\users\permission\admin"
MvDirContent "$admin\core\iam\permission" "$base\users\permission\admin"

# --- CORE ---
MkDir "$base\core\group\admin"
MvDirContent "$admin\core\groups" "$base\core\group\admin"

MkDir "$base\core\menu\admin"
MvDirContent "$admin\core\menus" "$base\core\menu\admin"

MkDir "$base\core\context\admin"
MvDirContent "$admin\core\contexts" "$base\core\context\admin"

MkDir "$base\core\content-template\admin"
MvDirContent "$admin\core\content-templates" "$base\core\content-template\admin"

MkDir "$base\core\system-config\admin"
MvDirContent "$admin\core\system-configs" "$base\core\system-config\admin"

# --- INTRODUCTION ---
MkDir "$base\introduction\about-section\admin"
MvDirContent "$admin\introduction\about" "$base\introduction\about-section\admin"

MkDir "$base\introduction\certificate\admin"
MvDirContent "$admin\introduction\certificate" "$base\introduction\certificate\admin"
MkDir "$base\introduction\certificate\public"
MvDirContent "$public\certificates" "$base\introduction\certificate\public"

MkDir "$base\introduction\testimonial\admin"
MvDirContent "$admin\introduction\testimonial" "$base\introduction\testimonial\admin"

MkDir "$base\introduction\faq\admin"
MvDirContent "$admin\introduction\faq" "$base\introduction\faq\admin"
MkDir "$base\introduction\faq\public"
MvFile "$public\home\FaqAccordion.tsx" "$base\introduction\faq\public"

MkDir "$base\introduction\contact\admin"
MvDirContent "$admin\introduction\contact" "$base\introduction\contact\admin"
MkDir "$base\introduction\contact\public"
MvDirContent "$public\contact" "$base\introduction\contact\public"

MkDir "$base\introduction\project\admin"
MvDirContent "$admin\introduction\project" "$base\introduction\project\admin"
MkDir "$base\introduction\project\public"
MvDirContent "$public\projects" "$base\introduction\project\public"

MkDir "$base\introduction\gallery\admin"
MvDirContent "$admin\introduction\gallery" "$base\introduction\gallery\admin"

MkDir "$base\introduction\partner\admin"
MvDirContent "$admin\introduction\partner" "$base\introduction\partner\admin"
MkDir "$base\introduction\partner\public"
MvFile "$public\home\PartnerCarousel.tsx" "$base\introduction\partner\public"

MkDir "$base\introduction\staff\admin"
MvDirContent "$admin\introduction\staff" "$base\introduction\staff\admin"
MkDir "$base\introduction\staff\public"
MvFile "$public\home\StaffCarousel.tsx" "$base\introduction\staff\public"
MvDirContent "$public\staff" "$base\introduction\staff\public"

MkDir "$base\introduction\service\public"
MvFile "$public\services\ServiceFilter.tsx" "$base\introduction\service\public"

# --- MARKETING ---
MkDir "$base\marketing\banner\admin"
MvDirContent "$admin\marketing\banners" "$base\marketing\banner\admin"

MkDir "$base\marketing\banner-location\admin"
MvDirContent "$admin\marketing\locations" "$base\marketing\banner-location\admin"

MkDir "$base\marketing\banner\public"
MvDirContent "$public\banners" "$base\marketing\banner\public"

# --- PAYMENTS ---
MkDir "$base\payments\payment-method\admin"
MvDirContent "$admin\payment\methods" "$base\payments\payment-method\admin"

# --- SHARED ---
MkDir "$base\shared\ui"
MvDirContent "$base\ui" "$base\shared\ui"
Remove-Item -Path "$base\ui" -Force -Recurse -ErrorAction SilentlyContinue

MkDir "$base\shared\layout"
MvDirContent "$base\layout" "$base\shared\layout"
Remove-Item -Path "$base\layout" -Force -Recurse -ErrorAction SilentlyContinue

MkDir "$base\shared\admin"
MvDirContent "$admin\shared" "$base\shared\admin"

# --- CLEANUP ---
# Remove empty dirs in admin and public
Get-ChildItem -Path $admin -Recurse | Where-Object { $_.PSIsContainer -and @(Get-ChildItem -Path $_.FullName).Count -eq 0 } | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
Get-ChildItem -Path $public -Recurse | Where-Object { $_.PSIsContainer -and @(Get-ChildItem -Path $_.FullName).Count -eq 0 } | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue

# Try to remove admin and public if empty
if ((Get-ChildItem -Path $admin).Count -eq 0) { Remove-Item -Path $admin -Force }
if ((Get-ChildItem -Path $public).Count -eq 0) { Remove-Item -Path $public -Force }
