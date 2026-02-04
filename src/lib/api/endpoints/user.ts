type Id = string | number;

export const userEndpoints = {
    auth: {
        login: "/api/login",
        register: "/api/register",
        sendOtpRegister: "/api/register/send-otp",
        sendOtpForgotPassword: "/api/forgot-password/send-otp",
        resetPassword: "/api/reset-password",
        logout: "/api/logout",
        refresh: "/api/refresh",
    },
    profile: {
        me: "/api/user/profile",
        update: "/api/user/profile",
        changePassword: "/api/user/profile/change-password",
    },
    groups: {
        list: "/api/user/groups",
    },
    uploads: {
        file: "/api/upload/file",
        files: "/api/upload/files",
        image: "/api/upload/image",
    },
    comments: {
        list: "/api/user/comic-comments",
        create: "/api/user/comic-comments",
        update: (id: Id) => `/api/user/comic-comments/${id}`,
        delete: (id: Id) => `/api/user/comic-comments/${id}`,
    },
    reviews: {
        list: "/api/user/reviews",
        comic: (comicId: Id) => `/api/user/reviews/comic/${comicId}`,
    },
} as const;


