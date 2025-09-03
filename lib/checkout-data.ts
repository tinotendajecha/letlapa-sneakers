export type CartItem = {
  productId: string;
  name: string;
  brand?: string;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number; // cents
};

export type SavedAddress = {
  id: string;
  label?: string;
  line1: string;
  line2?: string;
  suburb?: string;
  province: "Gauteng" | "Western Cape" | "KwaZulu-Natal" | "Eastern Cape" | "Free State" | "Limpopo" | "Mpumalanga" | "North West" | "Northern Cape";
  postalCode?: string;
  country?: "South Africa";
  isDefault?: boolean;
};

export type CheckoutData = {
  contact: {
    fullName: string;
    email: string;
    cellNumber: string;
    whatsappNumber: string;
    whatsappSameAsCell: boolean;
  };
  shipping: {
    useExistingAddress: string;
    addressLine1: string;
    addressLine2?: string;
    suburb: string;
    province: "Gauteng" | "Western Cape" | "KwaZulu-Natal" | "Eastern Cape" | "Free State" | "Limpopo" | "Mpumalanga" | "North West" | "Northern Cape";
    postalCode: string;
    country: string;
    saveAsDefault: boolean;
  };
  delivery: {
    deliveryWindow: "anytime" | "weekdays" | "evenings" | "weekends";
    instructions: string;
  };
};

export const MOCK_USER = {
  id: "u_123",
  name: "Thabo Mokoena",
  email: "thabo@example.com",
  phone: "+27 82 123 4567",
  whatsapp: "+27 82 123 4567",
  savedAddresses: [
    {
      id: "addr_1",
      label: "Home",
      line1: "123 Main Street",
      line2: "Unit 4B",
      suburb: "Sandton",
      province: "Gauteng" as const,
      postalCode: "2196",
      country: "South Africa" as const,
      isDefault: true
    },
    {
      id: "addr_2",
      label: "Work",
      line1: "456 Business Ave",
      line2: "Floor 15",
      suburb: "Cape Town",
      province: "Western Cape" as const,
      postalCode: "8001",
      country: "South Africa" as const,
      isDefault: false
    }
  ] as SavedAddress[]
};

export const MOCK_CART: CartItem[] = [
  {
    productId: "jordan_4_red",
    name: "Air Jordan 4 Retro",
    brand: "Jordan",
    image: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg",
    size: "US 8",
    color: "Fire Red",
    quantity: 1,
    unitPrice: 399900, // R3,999.00
  },
  {
    productId: "nike_dunk_low",
    name: "Nike Dunk Low",
    brand: "Nike",
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
    size: "US 9",
    color: "White/Black",
    quantity: 2,
    unitPrice: 179900, // R1,799.00
  },
  {
    productId: "adidas_stan_smith",
    name: "Stan Smith Sneakers",
    brand: "Adidas",
    image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg",
    size: "US 8.5",
    color: "White/Green",
    quantity: 1,
    unitPrice: 129900, // R1,299.00
  }
];