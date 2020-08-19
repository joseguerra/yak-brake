export class Order {
  $key: string;
  userDetail: any;
  date: any;
  status: string;
  products: Product[];
}

export class Product {
  $key: string;
  productId: number;
  productName: string;
  productCategory: string;
  productPrice: number;
  productDescription: string;
  productImageUrl: string;
  productAdded: number;
  productQuatity: number;
  cartQuantity: number;
  ratings: number;
  favourite: boolean;
  productSeller: string;
}
