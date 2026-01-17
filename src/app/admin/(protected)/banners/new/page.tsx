"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import { supabase } from "@/lib/supabaseClient";

export default function NewBannerPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Banner image is required");
      return;
    }

    setLoading(true);
    try {
      // 1) upload to Supabase Storage
      const ext = file.name.split(".").pop() || "jpg";
      const path = `banners/${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("banner-images")
        .upload(path, file, { upsert: true });

      if (uploadErr) throw uploadErr;

      const { data } = supabase.storage.from("banner-images").getPublicUrl(path);
      const imageUrl = data.publicUrl;

      // 2) create banner row via admin API
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          image_url: imageUrl,
          is_active: isActive,
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message || "Failed to create banner");
      }

      router.push("/admin/banners");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-primary mb-4">Add Banner</h1>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4 bg-white p-4 rounded border">
        <div>
          <label className="text-sm font-medium">Banner Name</label>
          <input
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Winter Collection"
          />
        </div>

        <ImageUploader
          label="Banner Image"
          onFileSelected={(f) => setFile(f)}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active
        </label>

        <button
          disabled={loading}
          className="rounded bg-primary px-4 py-2 text-white text-sm disabled:opacity-60"
        >
          {loading ? "Saving..." : "Create Banner"}
        </button>
      </form>
    </div>
  );
}
