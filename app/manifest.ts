import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "SAKEfolio",
        short_name: "SAKEfolio",
        description: "日本酒の飲酒記録、評価、プロ評価との比較ができるアプリケーション",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0f172a",
        icons: [
            {
                src: "/images/pwa/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/images/pwa/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
            {
                src: "/images/pwa/apple-icon.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
