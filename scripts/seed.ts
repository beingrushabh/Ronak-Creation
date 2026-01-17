/*
 * Seed script for Ronak Creation catalog.
 *
 * This script inserts sample products and banners into your Supabase project.
 * To run it, ensure your environment variables SUPABASE_SERVICE_ROLE_KEY and
 * NEXT_PUBLIC_SUPABASE_URL are set in .env.local, then execute:
 *   npm run seed
 *
 * Alternatively you can run the SQL in supabase/seed.sql directly via
 * the Supabase SQL editor.
 */
import { createClient } from '@supabase/supabase-js';

async function seed() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const supabase = createClient(url, serviceKey);
  // Example insertion (simplified). For complete seed data see supabase/seed.sql.
  const { error } = await supabase.from('products').insert([
    {
      heading: 'Example Lehenga',
      price: 1500,
      discount: 10,
      fabric_category: 'net',
      work_category: 'sequence',
      measurement: 'Free size',
      fabric: 'Net',
      work: 'Sequence',
      colour: 'Pink',
      stitch_type: 'Semi-stitched',
      care_guide: 'Dry clean only',
      no_of_pieces: 1,
      available_colours_hex: ['#FFC0CB', '#FADADD'],
      trending: true,
      image_url: 'https://placehold.co/600x800',
    },
  ]);
  if (error) {
    console.error('Seeding failed:', error.message);
  } else {
    console.log('Seed data inserted');
  }
}

seed();