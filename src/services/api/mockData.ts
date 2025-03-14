
import { ShoppingResult } from './types';

// Extended mock data for development and testing
export const mockSearchResults: ShoppingResult[] = [
  {
    position: 1,
    title: "Demo Product - Best Value",
    link: "https://example.com/product1",
    source: "Demo Store",
    price: "$24.99",
    extracted_price: 24.99,
    thumbnail: "https://picsum.photos/id/1/200/300",
    delivery: "Free shipping",
    rating: 4.5,
    reviews: 120
  },
  {
    position: 2,
    title: "Demo Product - Premium",
    link: "https://example.com/product2",
    source: "Another Store",
    price: "$34.99",
    extracted_price: 34.99,
    thumbnail: "https://picsum.photos/id/2/200/300",
    delivery: "Free shipping",
    rating: 4.2,
    reviews: 85
  },
  {
    position: 3,
    title: "Demo Product - Standard",
    link: "https://example.com/product3",
    source: "Discount Store",
    price: "$19.99",
    extracted_price: 19.99,
    thumbnail: "https://picsum.photos/id/3/200/300",
    delivery: "$4.99 shipping",
    rating: 3.9,
    reviews: 220
  },
  {
    position: 4,
    title: "Demo Product - Deluxe Edition",
    link: "https://example.com/product4",
    source: "Luxury Store",
    price: "$49.99",
    extracted_price: 49.99,
    thumbnail: "https://picsum.photos/id/4/200/300",
    delivery: "Free shipping",
    rating: 4.7,
    reviews: 68
  },
  {
    position: 5,
    title: "Demo Product - Budget Option",
    link: "https://example.com/product5",
    source: "Value Shop",
    price: "$14.99",
    extracted_price: 14.99,
    thumbnail: "https://picsum.photos/id/5/200/300",
    delivery: "$3.99 shipping",
    rating: 3.5,
    reviews: 145
  }
];
