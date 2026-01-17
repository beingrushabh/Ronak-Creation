"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productFormSchema, fabricCategories, workCategories } from '@/lib/validators';
import type { z } from 'zod';
import { supabase } from '@/lib/supabaseClient';
import ImageUploader from '@/components/ImageUploader';
import ColorHexInput from '@/components/ColorHexInput';
import { useRouter, useParams } from 'next/navigation';

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
  });

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (!error && data) {
        // Populate form values
        reset({
          heading: data.heading,
          price: data.price,
          discount: data.discount,
          fabricCategory: data.fabric_category,
          workCategory: data.work_category,
          measurement: data.measurement ?? undefined,
          fabric: data.fabric ?? undefined,
          work: data.work ?? undefined,
          colour: data.colour ?? undefined,
          stitchType: data.stitch_type ?? undefined,
          careGuide: data.care_guide ?? undefined,
          noOfPieces: data.no_of_pieces ?? undefined,
          availableColoursHex: data.available_colours_hex ?? [],
          trending: data.trending ?? false,
        });
        setImageUrl(data.image_url);
      }
      setLoading(false);
    }
    if (id) fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (values: ProductFormValues) => {
    try {
      let finalImageUrl = imageUrl;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const filePath = `products/${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from('catalog-images').upload(filePath, imageFile);
        if (uploadError) {
          alert('Failed to upload image');
          return;
        }
        const { data: publicData } = supabase.storage.from('catalog-images').getPublicUrl(filePath);
        finalImageUrl = publicData.publicUrl;
      }
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          image_url: finalImageUrl,
        }),
      });
      if (res.ok) {
        router.push('/admin/products');
      } else {
        const json = await res.json();
        alert(json.message || 'Failed to update product');
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred');
    }
  };

  if (loading) {
    return <p>Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Heading</label>
            <input {...register('heading')} className="border p-2 rounded w-full text-sm" />
            {errors.heading && <p className="text-red-600 text-xs">{errors.heading.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Price (₹)</label>
            <input type="number" {...register('price', { valueAsNumber: true })} className="border p-2 rounded w-full text-sm" />
            {errors.price && <p className="text-red-600 text-xs">{errors.price.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Discount (%)</label>
            <input type="number" {...register('discount', { valueAsNumber: true })} className="border p-2 rounded w-full text-sm" />
            {errors.discount && <p className="text-red-600 text-xs">{errors.discount.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Fabric Category</label>
            <select {...register('fabricCategory')} className="border p-2 rounded w-full text-sm">
              {fabricCategories.map((fabric) => (
                <option key={fabric} value={fabric}>{fabric.replace(/-/g, ' ')}</option>
              ))}
            </select>
            {errors.fabricCategory && <p className="text-red-600 text-xs">{errors.fabricCategory.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Work Category</label>
            <select {...register('workCategory')} className="border p-2 rounded w-full text-sm">
              {workCategories.map((work) => (
                <option key={work} value={work}>{work}</option>
              ))}
            </select>
            {errors.workCategory && <p className="text-red-600 text-xs">{errors.workCategory.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Measurement</label>
            <input {...register('measurement')} className="border p-2 rounded w-full text-sm" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Fabric (spec)</label>
            <input {...register('fabric')} className="border p-2 rounded w-full text-sm" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Work (spec)</label>
            <input {...register('work')} className="border p-2 rounded w-full text-sm" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Colour (main)</label>
            <input {...register('colour')} className="border p-2 rounded w-full text-sm" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Stitch Type</label>
            <input {...register('stitchType')} className="border p-2 rounded w-full text-sm" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Care Guide</label>
            <input {...register('careGuide')} className="border p-2 rounded w-full text-sm" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">No. of Pieces</label>
            <input type="number" {...register('noOfPieces', { valueAsNumber: true })} className="border p-2 rounded w-full text-sm" />
            {errors.noOfPieces && <p className="text-red-600 text-xs">{errors.noOfPieces.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <ColorHexInput
              values={[]}
              onChange={(vals) => setValue('availableColoursHex', vals)}
              label="Available Colours (hex codes)"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" {...register('trending')} />
              <span>Trending</span>
            </label>
          </div>
          <div className="sm:col-span-2">
            <ImageUploader
              label="Product Image"
              initialUrl={imageUrl || undefined}
              onFileSelected={(file) => {
                setImageFile(file);
                setValue('imageFile', file as any);
              }}
            />
            {errors.imageFile && <p className="text-red-600 text-xs">{errors.imageFile.message}</p>}
          </div>
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving…' : 'Update Product'}
        </button>
      </form>
    </div>
  );
}