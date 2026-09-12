# Surakshitam Naturals complete product image gallery

This package contains 78 square product-gallery images for 34 Surakshitam Naturals products. Partner-brand products were intentionally excluded. The final reel-reference batch adds 18 images for nine additional products, with two images per item.

## Image sequence

Each product folder follows the same three-image order:

1. `01-listing-front-clean` — primary shop/listing image
2. `02-...-lifestyle` — ingredient-led secondary gallery image
3. `03-...-detail` or `03-...-usage` — texture, packaging, or usage detail

Batch 02 products use a two-image sequence:

1. `01-listing-front-clean` — primary shop/listing image
2. `02-...-lifestyle` or `02-...-usage` — ingredient-led secondary gallery image

Use the WebP files in the product folders on the website. Lossless PNG generation masters are preserved under `masters/`.

## Products included

- `natural-dishwash-liquid`
- `natural-dishwash-bar`
- `natural-floor-cleaner`
- `herbal-shampoo`
- `shea-butter-soap`
- `neem-tulsi-soap`
- `papaya-soap`
- `triple-butter-soap`
- `rose-face-wash`
- `lavender-body-wash`
- `washing-machine-liquid`
- `natural-utensil-shine`
- `beetroot-soap`
- `glycerine-soap`
- `body-lotion`
- `face-cream`
- `herbal-bath-powder`
- `foot-cream`
- `face-pack`
- `aloe-vera-gel`
- `strawberry-lip-balm`
- `herbal-hair-pack`
- `hair-oil`
- `rosemary-hair-spray`
- `hair-serum`
- `aloe-vera-soap`
- `charcoal-soap`
- `coffee-soap`
- `goat-milk-soap`
- `henna-powder`
- `honey-soap`
- `manjista-soap`
- `red-wine-soap`
- `sandal-soap`

## Batch 02 reference status

Genuine product/original/reel references were available for Natural Utensil Shine (Natural Pitambari), Beetroot Soap, Glycerine Soap, Body Lotion, Strawberry Lip Balm, Hair Oil, and Rosemary Hair Spray.

The project did not contain confirmed genuine pack photos for Washing Machine Liquid, Face Cream, Herbal Bath Powder, Foot Cream, Face Pack, Aloe Vera Gel, Herbal Hair Pack, or Hair Serum. Their images are coherent packaging concepts and should be compared with current physical stock before publishing.

## Final reel-reference products

Aloe Vera Soap, Charcoal Soap, Coffee Soap, Goat Milk Soap, Henna Powder, Honey Soap, Manjista Soap, Red Wine Soap, and Sandal Soap were prepared from matching Surakshitam reel references. These nine products are not currently present in `lib/catalog.ts`; their image sets are ready for later catalog creation.

The reel file named `handwash-liquid-bottle.webp` visibly contains Dish Washing Liquid, which is already represented by `natural-dishwash-liquid`. It was intentionally excluded to prevent a mislabeled duplicate.

## Integration guidance for an AI coding agent

For each matching catalog product, use the WebP files from its identically named folder in filename order. Set the `01` file as the listing/card image and use the remaining files as the product-detail gallery. Preserve this order. Do not apply these files to partner-brand products.

All assets are square and designed to crop safely in responsive desktop and mobile product cards. Generated packaging should still be checked against current stock before production launch because small printed label details can vary in AI-assisted product photography.
