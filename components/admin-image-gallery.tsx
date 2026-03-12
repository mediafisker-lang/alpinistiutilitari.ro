"use client";

import { useState } from "react";

export function AdminImageGallery({ urls }: { urls: string[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {urls.map((url, index) => (
          <button
            key={url}
            type="button"
            onClick={() => setSelectedImage(url)}
            className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-left"
          >
            <img
              src={url}
              alt={`Poza sesizare ${index + 1}`}
              className="h-20 w-full object-cover"
            />
          </button>
        ))}
      </div>

      {selectedImage ? (
        <button
          type="button"
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4"
        >
          <img
            src={selectedImage}
            alt="Preview imagine sesizare"
            className="max-h-[85vh] max-w-[90vw] rounded-2xl bg-white object-contain shadow-2xl"
          />
        </button>
      ) : null}
    </>
  );
}
