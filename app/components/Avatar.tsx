"use client";

import { useState } from "react";

type AvatarProps = {
  initials: string;
  color: string;
  size?: number;
  imageSrc?: string | null;
};

export default function Avatar({
  initials,
  color,
  size = 40,
  imageSrc,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const showImage = imageSrc && !imgError;

  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        background: showImage
          ? undefined
          : `linear-gradient(135deg, ${color}, ${color}CC)`,
        fontSize: size * 0.36,
      }}
    >
      {showImage ? (
        <img
          src={imageSrc}
          alt={initials}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        initials
      )}
    </div>
  );
}