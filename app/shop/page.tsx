'use client';

import { useState, useMemo, useEffect } from 'react';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
// import { mockProducts } from '@/lib/mock-data';
import { Product } from '@/lib/store';
import { sanity } from '@/lib/sanity';
import { fetchAllProducts } from '@/lib/groq-queries/allProducts';
import FancyLoader from '@/components/FancyLoader';

export default function ShopPage() {

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // ✅ NEW

  useEffect(() => {
    const getProducts = async () => {
      try {
        const products = await fetchAllProducts();
        console.log(products)
        setAllProducts(products);
      } finally {
        setLoading(false); // ✅ NEW
      }
    };

    getProducts();
  }, []);


  const [showFilters, setShowFilters] = useState(false);
  const { filters, updateFilters, clearFilters } = useStore();

  // ✅ Make these robust to undefined arrays
  const brands = [...new Set(allProducts.map(p => p.brand))];
  const categories = [...new Set(allProducts.map(p => p.category))];
  const allSizes = [...new Set(allProducts.flatMap(p => p.sizes ?? []))].sort();   // ✅ CHANGED
  const allColors = [...new Set(allProducts.flatMap(p => p.colors ?? []))];        // ✅ CHANGED

  // Filter products
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }

      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Size filter
      if (filters.sizes.length > 0 && !filters.sizes.some(size => (product.sizes ?? []).includes(size))) { // ✅ CHANGED
        return false;
      }

      // Color filter
      if (filters.colors.length > 0 && !filters.colors.some(color =>
        (product.colors ?? []).some(pc => pc.toLowerCase().includes(color.toLowerCase())) // ✅ CHANGED
      )) {
        return false;
      }

      // Stock filter
      if (filters.inStock && !product.inStock) {
        return false;
      }

      return true;
    });
  }, [allProducts, filters]); // ✅ CHANGED: include allProducts so it recomputes after fetch

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    
    switch (filters.sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'rating':
        return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); // (tiny safety)
      case 'newest':
        return sorted; // Would sort by date if we had it
      default:
        // Featured first, then others
        return sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
    }
  }, [filteredProducts, filters.sortBy]);

  const handleFilterChange = (key: string, value: any) => {
    updateFilters({ [key]: value });
  };

  const toggleArrayFilter = (key: string, value: string) => {
    const current = filters[key as keyof typeof filters] as string[];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    updateFilters({ [key]: updated });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== filters.inStock
  ) || filters.priceRange[0] > 0 || filters.priceRange[1] < 5000;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Shop Sneakers</h1>
            <p className="text-muted-foreground mt-2">
              {loading ? 'Loading…' : `${sortedProducts.length} products found`} {/* ✅ CHANGED */}
            </p>
          </div>

          {/* Sort & Filter Controls */}
          <div className="flex items-center space-x-4">
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="input-field text-sm"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name A-Z</option>
            </select>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`w-full lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-semibold">Filters</h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Brand Filter */}
                <div>
                  <h4 className="font-medium mb-3">Brand</h4>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.brands.includes(brand)}
                          onChange={() => toggleArrayFilter('brands', brand)}
                          className="rounded border-border"
                        />
                        <span className="text-sm">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <h4 className="font-medium mb-3">Category</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category)}
                          onChange={() => toggleArrayFilter('categories', category)}
                          className="rounded border-border"
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceRange[0]}
                        onChange={(e) => handleFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                        className="input-field text-sm flex-1"
                      />
                      <span className="text-muted-foreground">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange[1]}
                        onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                        className="input-field text-sm flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Size Filter */}
                <div>
                  <h4 className="font-medium mb-3">Size</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {allSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => toggleArrayFilter('sizes', size)}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          filters.sizes.includes(size)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border hover:bg-secondary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Filter */}
                <div>
                  <h4 className="font-medium mb-3">Color</h4>
                  <div className="space-y-2">
                    {allColors.map(color => (
                      <label key={color} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.colors.includes(color)}
                          onChange={() => toggleArrayFilter('colors', color)}
                          className="rounded border-border"
                        />
                        <span className="text-sm">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Stock Filter */}
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-sm">In Stock Only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? ( // ✅ NEW
              <FancyLoader items={9} />
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
