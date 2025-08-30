// lib/groq/featured-products.groq.ts
import { sanity } from "../sanity";

export const featuredProductsQuery = `
*[_type == "product" && featured == true && inStock == true && !(_id in path('drafts.**'))]
| order(name asc)[0...$limit]  // end is exclusive
{
  _id,
  name,
  brand,
  price,
  originalPrice,
  sizes,
  colors,
  category,
  description,
  inStock,
  featured,
  rating,
  reviews,
  _createdAt,
  "image": coalesce(mainImage.asset->url, images[0].asset->url),
  "images": array::compact(coalesce([mainImage.asset->url], []) + images[].asset->url)
}
`;

// Fetch at most `limit` featured products (defaults to 6)
export async function fetchFeaturedProducts(limit = 3) {
  return sanity.fetch(featuredProductsQuery, { limit });
}
