import { UserImageResponse } from "@/lib/backend-client";

export function resolveUserImageSrc(img: UserImageResponse): string | null {
    if (img.oauth_image) return img.oauth_image;
    if (img.image && img.imageType) return `data:${img.imageType};base64,${img.image}`;
    return null;
}