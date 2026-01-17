-- Seed data for Ronak Creation catalog

insert into public.products (
  heading, price, discount, fabric_category, work_category,
  measurement, fabric, work, colour, stitch_type, care_guide,
  no_of_pieces, available_colours_hex, trending, image_url
) values
  (
    'Elegant Net Lehenga', 1200, 10,
    'net', 'sequence',
    'Free size', 'Net', 'Sequence', 'Pink', 'Semi-stitched', 'Dry clean only',
    1, '["#FFC0CB", "#FADADD"]', true,
    'https://placehold.co/600x800'
  ),
  (
    'Royal Velvet Bridal Set', 3000, 20,
    'velvet', 'gliter dori with diamond',
    'Free size', 'Velvet', 'Glitter Dori with diamond', 'Red', 'Semi-stitched', 'Dry clean only',
    3, '["#8B0000", "#B22222"]', true,
    'https://placehold.co/600x800'
  ),
  (
    'Satin Partywear Lehenga', 1800, 5,
    'satin', 'multi sequence work',
    'Free size', 'Satin', 'Multi sequence work', 'Blue', 'Semi-stitched', 'Dry clean only',
    2, '["#4169E1", "#87CEFA"]', false,
    'https://placehold.co/600x800'
  ),
  (
    'Jorjet Designer Lehenga', 1600, 15,
    'jorjet', 'sequence with bids',
    'Free size', 'Jorjet', 'Sequence with beads', 'Green', 'Semi-stitched', 'Dry clean only',
    2, '["#228B22", "#32CD32"]', false,
    'https://placehold.co/600x800'
  ),
  (
    'Vichitra Festive Wear', 1400, 0,
    'vichitra', 'gliterdori with jarkan',
    'Free size', 'Vichitra', 'Glitter dori with jarkan', 'Purple', 'Semi-stitched', 'Dry clean only',
    1, '["#800080", "#C71585"]', false,
    'https://placehold.co/600x800'
  ),
  (
    'Jimmycho Contemporary Lehenga', 2000, 8,
    'jimmycho', 'sequence with gliter dori',
    'Free size', 'Jimmycho', 'Sequence with glitter dori', 'Maroon', 'Semi-stitched', 'Dry clean only',
    2, '["#800000", "#A52A2A"]', false,
    'https://placehold.co/600x800'
  ),
  (
    'Fandy Satin Classic Lehenga', 2200, 10,
    'fandy-satin', 'sequence',
    'Free size', 'Fandy satin', 'Sequence', 'Orange', 'Semi-stitched', 'Dry clean only',
    1, '["#FFA500", "#FF8C00"]', false,
    'https://placehold.co/600x800'
  ),
  (
    'Premium Net Sequence Lehenga', 2500, 12,
    'net', 'sequence with bids',
    'Free size', 'Net', 'Sequence with beads', 'Yellow', 'Semi-stitched', 'Dry clean only',
    1, '["#FFFF00", "#FFD700"]', true,
    'https://placehold.co/600x800'
  );

-- Seed banners
insert into public.banners (name, image_url, is_active, sort_order) values
  ('Festive Collection', 'https://placehold.co/1200x400', true, 1),
  ('New Arrivals', 'https://placehold.co/1200x400', true, 2),
  ('Wedding Season', 'https://placehold.co/1200x400', true, 3);

-- Seed settings row
insert into public.settings (active_banner_count) values (3);