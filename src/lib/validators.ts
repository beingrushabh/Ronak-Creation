import { z } from 'zod';

// Allowed fabric categories and work categories from the business spec.
export const fabricCategories = [
  'net',
  'jimmycho',
  'satin',
  'velvet',
  'jorjet',
  'vichitra',
  'fandy-satin',
] as const;

export const workCategories = [
  'Gliter-dori',
  'sequence',
  'gliter dori with diamond',
  'gliterdori with jarkan',
  'multi sequence work',
  'sequence with bids',
  'sequence with gliter dori',
] as const;

// Product form validation schema
export const productFormSchema = z.object({
  heading: z.string().nonempty('Heading is required'),
  price: z.coerce.number().int().min(0, 'Price must be positive'),
  discount: z.coerce.number().int().min(0).max(100, 'Discount must be between 0 and 100'),
  fabricCategory: z.enum(fabricCategories, {
    errorMap: () => ({ message: 'Please select a valid fabric category' }),
  }),
  workCategory: z.enum(workCategories, {
    errorMap: () => ({ message: 'Please select a valid work category' }),
  }),
  measurement: z.string().optional(),
  fabric: z.string().optional(),
  work: z.string().optional(),
  colour: z.string().optional(),
  stitchType: z.string().optional(),
  careGuide: z.string().optional(),
  noOfPieces: z.coerce.number().int().min(1).max(10).optional(),
  availableColoursHex: z.array(z.string().regex(/^#([0-9A-Fa-f]{6})$/, 'Invalid HEX colour')).optional(),
  trending: z.boolean().optional(),
  imageFile: z.any().refine((file) => file instanceof File, {
    message: 'Image is required',
  }),
});

// Banner form validation schema
export const bannerFormSchema = z.object({
  name: z.string().nonempty('Name is required'),
  imageFile: z.any().refine((file) => file instanceof File, {
    message: 'Image is required',
  }),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
});

// Login schema
export const loginSchema = z.object({
  password: z.string().nonempty('Password is required'),
});