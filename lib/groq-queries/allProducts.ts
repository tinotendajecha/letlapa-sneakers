import { sanity } from "../sanity";

// lib/groq/all-products.groq.ts
export const allProductsQuery = `
*[_type == "product" && !(_id in path('drafts.**'))]
| order(featured desc, name asc)
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

// Logic for pulling products from sanity studio
export async function fetchAllProducts() {
    const products = await sanity.fetch(allProductsQuery);
    return products;
  };
