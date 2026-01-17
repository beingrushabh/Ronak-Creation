"use client";

import { useState, ChangeEvent } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  onFileSelected: (file: File | null) => void;
  label?: string;
  initialUrl?: string | null;
}

/**
 * ImageUploader provides a simple file input with image preview. It does not
 * upload the file itself; use onFileSelected to handle upload logic in the
 * parent component. If initialUrl is provided, it displays the existing
 * image until a new file is selected.
 */
export default function ImageUploader({ onFileSelected, label, initialUrl }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      onFileSelected(file);
    } else {
      onFileSelected(null);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="font-medium text-sm block">{label}</label>}
      {previewUrl && (
        <div className="relative w-40 h-40 border rounded overflow-hidden">
          <Image src={previewUrl} alt="Preview" fill className="object-cover" />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="text-sm"
      />
    </div>
  );
}