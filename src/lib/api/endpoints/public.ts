type Id = string | number;

export const publicEndpoints = {
    posts: {
        list: "/api/public/posts",
        featured: "/api/public/posts/featured",
        showBySlug: (slug: string) => `/api/public/posts/${slug}`,
        comments: (postId: Id) => `/api/public/posts/${postId}/comments`,
    },
    postCategories: {
        list: "/api/public/post-categories",
        showBySlug: (slug: string) => `/api/public/post-categories/${slug}`,
    },
    postTags: {
        list: "/api/public/post-tags",
        showBySlug: (slug: string) => `/api/public/post-tags/${slug}`,
    },
    contacts: {
        create: "/api/public/contacts",
    },
    systemConfigs: {
        getByGroup: (group: string) => `/api/public/system-configs/${group}`,
        general: "/api/public/system-configs/general",
    },
    banners: {
        list: "/api/public/banners",
        show: (id: Id) => `/api/public/banners/${id}`,
        getByLocation: (locationCode: string) => `/api/public/banners/location/${locationCode}`,
    },
    homepage: "/api/public/homepage",
    projects: {
        list: "/api/projects",
        featured: "/api/projects/featured",
        showBySlug: (slug: string) => `/api/projects/${slug}`,
    },
    aboutSections: {
        list: "/api/about-sections",
        showBySlug: (slug: string) => `/api/about-sections/${slug}`,
        getByType: (type: string) => `/api/about-sections/type/${type}`,
    },
    staff: {
        list: "/api/staff",
        show: (id: Id) => `/api/staff/${id}`,
        getByDepartment: (department: string) => `/api/staff/department/${department}`,
    },
    testimonials: {
        list: "/api/testimonials",
        featured: "/api/testimonials/featured",
        getByProject: (projectId: Id) => `/api/testimonials/project/${projectId}`,
    },
    partners: {
        list: "/api/partners",
        getByType: (type: string) => `/api/partners/type/${type}`,
    },
    gallery: {
        list: "/api/gallery",
        featured: "/api/gallery/featured",
        showBySlug: (slug: string) => `/api/gallery/${slug}`,
    },
    certificates: {
        list: "/api/certificates",
        show: (id: Id) => `/api/certificates/${id}`,
        getByType: (type: string) => `/api/certificates/type/${type}`,
    },
    faqs: {
        list: "/api/faqs",
        popular: "/api/faqs/popular",
        show: (id: Id) => `/api/faqs/${id}`,
        markHelpful: (id: Id) => `/api/faqs/${id}/helpful`,
    },
    discounts: {
        available: "/api/public/discounts/coupons/available",
        validate: "/api/public/discounts/validate-coupon",
        apply: "/api/public/discounts/apply-coupon",
        remove: (cartId: string | number) => `/api/public/discounts/remove-coupon/${cartId}`,
    },
    orders: {
        checkout: "/api/public/orders",
        myOrders: "/api/public/orders",
        detail: (id: Id) => `/api/public/orders/${id}`,
        access: "/api/public/orders/acces",
        cancel: (id: Id) => `/api/public/orders/${id}/cancel`,
    },
    payments: {
        list: "/api/public/payments",
        createUrl: "/api/public/payments/create-url",
        verify: (gateway: string) => `/api/public/payments/verify/${gateway}`,
        show: (id: string | number) => `/api/public/payments/${id}`,
    },
    shippingMethods: {
        list: "/api/public/shipping-methods",
        active: "/api/public/shipping-methods/active",
        show: (id: Id) => `/api/public/shipping-methods/${id}`,
        calculate: "/api/public/shipping-methods/calculate",
    },
    productCategories: {
        list: "/api/public/product-categories",
        tree: "/api/public/product-categories/tree",
        root: "/api/public/product-categories/root",
        products: (id: Id) => `/api/public/product-categories/${id}/products`,
        showBySlug: (slug: string) => `/api/public/product-categories/${slug}`,
    },
    reviews: {
        comic: (comicId: Id) => `/api/public/reviews/comics/${comicId}`,
    },
    comments: {
        comic: (comicId: Id) => `/api/public/comic-comments/comics/${comicId}`,
        chapter: (chapterId: Id) => `/api/public/comic-comments/chapters/${chapterId}`,
    },
    comics: {
        list: "/api/public/comics",
        detail: (slug: string) => `/api/public/comics/${slug}`,
        chapters: (slug: string) => `/api/public/comics/${slug}/chapters`,
    },
    comicCategories: {
        list: "/api/public/comic-categories",
        show: (id: Id) => `/api/public/comic-categories/${id}`,
    },
    menus: {
        list: "/api/public/menus",
    },
} as const;


