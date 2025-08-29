// get single product by id

// lib/data/product.ts
import { sanity } from "../sanity";

// lib/groq/product-by-id.groq.ts
export const productByIdQuery = /* groq */ `
*[_type == "product" && _id == $id][0]{
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



export async function fetchProductById(id: string) {
  return sanity.fetch(productByIdQuery, { id });
}

