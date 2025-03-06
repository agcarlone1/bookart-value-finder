
import React from 'react';
import ProductCard from '@/components/ui-custom/ProductCard';
import ResultSkeleton from '@/components/ui-custom/ResultSkeleton';
import NoResultsMessage from '@/components/ui-custom/NoResultsMessage';

interface ProductListProps {
  products: any[];
  isSearching: boolean;
}

const ProductList = ({ products, isSearching }: ProductListProps) => {
  // Convert SerpAPI results to our ProductCard format
  const formatProducts = (results: any[]) => {
    return results.map(item => ({
      id: item.position.toString(),
      name: item.title,
      storeName: item.source,
      price: item.extracted_price,
      imageUrl: item.thumbnail,
      link: item.link
    }));
  };

  if (isSearching) {
    return <ResultSkeleton />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-slide-up">
      {products.length > 0 ? (
        formatProducts(products)
          .sort((a, b) => a.price - b.price)
          .map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product}
              isBestValue={index === 0}
              className="h-full"
            />
          ))
      ) : (
        <NoResultsMessage />
      )}
    </div>
  );
};

export default ProductList;
