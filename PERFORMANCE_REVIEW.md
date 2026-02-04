# Đánh giá và Đề xuất Tối ưu Hóa Hiệu năng Project Next.js

Dựa trên phân tích mã nguồn hiện tại, project của bạn có nền tảng tốt (Next.js 15, React 19, Turbopack) nhưng vẫn còn một số điểm cần cải thiện để tối ưu khả năng build và load trang.

## 1. Dọn dẹp Dependencies (Quan trọng)

Phát hiện lớn nhất là **sự dư thừa các thư viện editor**. Trong `package.json`, bạn có cài đặt cả `CKEditor 5` và `TinyMCE`, nhưng thực tế code chỉ sử dụng `TinyMCE` (theo file `CKEditor.tsx`).

### Hành động:
Gỡ bỏ các gói không sử dụng để giảm thời gian cài đặt và tránh rủi ro bundle nhầm:
```bash
npm uninstall ckeditor5 @ckeditor/ckeditor5-react
# hoặc
yarn remove ckeditor5 @ckeditor/ckeditor5-react
```

## 2. Tối ưu `next.config.ts`

File config hiện tại đang cấu hình transpile/optimize cho các gói không còn dùng hoặc không cần thiết.

### Hành động:
Cập nhật `next.config.ts`:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Xóa dòng transpilePackages vì CKEditor không còn dùng
  // transpilePackages: ["ckeditor5", "@ckeditor/ckeditor5-react"], 
  
  experimental: {
    // Xóa lodash nếu không dùng (kiểm tra không thấy dùng trong src)
    optimizePackageImports: ["lucide-react", "date-fns", "react-hook-form"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
      // Cân nhắc: "hostname: '**'" rất tiện lúc dev nhưng rủi ro về performance
      // và bảo mật ở production. Nên giới hạn domain cụ thể nếu có thể.
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // ... phần headers và rewrites giữ nguyên
};
```

## 3. Tối ưu hóa TinyMCE

Hiện tại `CKEditor.tsx` đang load script TinyMCE từ CDN (`cdnjs.cloudflare.com`).
```tsx
tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/7.1.1/tinymce.min.js"
```
**Vấn đề**: Phụ thuộc vào mạng quốc tế. Nếu đứt cáp hoặc CDN chậm, editor sẽ không hiện.
**Đề xuất**: Tải file `tinymce.min.js` (và các plugins/themes cần thiết) về thư mục `public/tinymce` của dự án và trỏ đường dẫn nội bộ:
```tsx
tinymceScriptSrc="/tinymce/tinymce.min.js"
```
Hoặc chấp nhận CDN nhưng nên dùng cơ chế preload nếu trang đó quan trọng.

## 4. Lazy Loading Components nặng

Nếu bạn dùng Chart.js (`react-chartjs-2`) ở các trang Dashboard, hãy đảm bảo import chúng dạng Dynamic Import nếu chúng không cần thiết ngay lập tức, đặc biệt nếu trang Dashboard quá nặng.

Ví dụ:
```tsx
import dynamic from 'next/dynamic';
const AdminPostStatistics = dynamic(() => import('./AdminPostStatistics'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false // Chart thường chỉ render client-side
});
```

## 5. Hình ảnh (`next/image`)

Bạn đã làm tốt việc dùng `next/image` và `sizes` trong `ComicCard.tsx`.
**Lưu ý thêm**:
- Các ảnh đầu trang (LCP - Largest Contentful Paint), ví dụ: Banner trang chủ, hoặc ảnh bìa truyện chi tiết, nên thêm thuộc tính `priority`.
```tsx
<Image src="..." alt="..." priority ... />
```
Điều này giúp Chrome tải ảnh đó sớm hơn, tăng điểm Core Web Vitals.

## 6. Phân tích Bundle

Nên cài thêm `@next/bundle-analyzer` để nhìn rõ gói nào đang chiếm dung lượng lớn nhất.

**Cách làm**:
1. `npm install @next/bundle-analyzer cross-env --save-dev`
2. Sửa `next.config.ts` để wrap config.
3. Chạy `ANALYZE=true npm run build` để xem biểu đồ.

---
**Tổng kết**: Project khá ổn, chỉ cần dọn dẹp thư viện rác (CKEditor) và tinh chỉnh config là sẽ mượt mà hơn.
