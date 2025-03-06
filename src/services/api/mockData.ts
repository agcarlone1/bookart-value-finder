
import { ShoppingResult } from './types';

// Mock data for development and testing
export const mockSearchResults: ShoppingResult[] = [
  {
    position: 1,
    title: "Mock Product 1",
    link: "https://example.com/product1",
    source: "Example Store",
    price: "$24.99",
    extracted_price: 24.99,
    thumbnail: "https://picsum.photos/200/300",
    delivery: "Free shipping",
    rating: 4.5,
    reviews: 120
  },
  {
    position: 2,
    title: "Mock Product 2",
    link: "https://example.com/product2",
    source: "Another Store",
    price: "$34.99",
    extracted_price: 34.99,
    thumbnail: "https://picsum.photos/200/301",
    delivery: "Free shipping",
    rating: 4.2,
    reviews: 85
  },
  {
    position: 3,
    title: "Mock Product 3",
    link: "https://example.com/product3",
    source: "Discount Store",
    price: "$19.99",
    extracted_price: 19.99,
    thumbnail: "https://picsum.photos/200/302",
    delivery: "$4.99 shipping",
    rating: 3.9,
    reviews: 220
  }
];
