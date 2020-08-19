import { Injectable } from "@angular/core";
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from "@angular/fire/database";
import { AngularFireStorage } from '@angular/fire/storage';
import { Product } from "../models/product";
import { AuthService } from "./auth.service";
import { UserService } from "./user.service";
import { ToastrService } from "./toastr.service";

@Injectable()
export class ProductService {
  products: AngularFireList<Product>;
  product: AngularFireObject<Product>;

  // favouriteProducts
  favouriteProducts: AngularFireList<FavouriteProduct>;
  cartProducts: AngularFireList<FavouriteProduct>;

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService,
    private userService: UserService,
    private storage: AngularFireStorage,
    private toastrService: ToastrService
  ) {
    this.products = this.db.list("products");
  }

  firestoreUploadImage(datos: File, nombreArchivo: string) {
    return this.storage.upload(nombreArchivo, datos);
   }

  public referenciaCloudStorage(nombreArchivo: string) {
    return this.storage.ref(nombreArchivo);
  }

  getProducts() {
    this.products = this.db.list("products");
    return this.products;
  }

  createProduct(data: Product, callback: () => void) {
    console.log(data);
    this.products.push(data);
    callback();
  }

  editProduct(key,data: Product) {
    console.log(key)
    this.products.update(key, data);
    this.toastrService.wait(
      "Perfecto",
      "Producto Actualizada"
    );
    return this.products;
  }

  createCatalog(data: Product, callback: () => void) {
    this.products.push(data);
    callback();
  }

  getProductById(key: string) {
    this.product = this.db.object("products/" + key);
    return this.product;
  }

  updateProduct(data: Product) {
    this.products.update(data.$key, data);
  }

  deleteProduct(key: string) {
    this.products.remove(key);
    this.toastrService.wait(
      "Perfecto",
      "Producto Eliminado"
    );
  }

  updateQuantityProduct() {
    const a: Product[] = JSON.parse(localStorage.getItem("avct_item")) || [];
    for (let i = 0; i < a.length; i++) {
      this.products.update(a[i].$key, { 
        productQuantity: a[i].productQuantity - a[i].cartQuantity 
      });   
    }
    return Promise.resolve();
  }

  /*
   ----------  Favourite Product Function  ----------
  */

  // Get Favourite Product based on userId
  async getUsersFavouriteProduct() {
    const user = await this.authService.user$.toPromise();
    this.favouriteProducts = this.db.list("favouriteProducts", (ref) =>
      ref.orderByChild("userId").equalTo(user.$key)
    );
    return this.favouriteProducts;
  }

  // Adding New product to favourite if logged else to localStorage
  addFavouriteProduct(data: Product): void {
    let favority = true;
    const a: Product[] = JSON.parse(localStorage.getItem("avf_item")) || [];
    console.log(a);
    for (let i = 0; i < a.length; i++) {
      if(a[i].$key === data.$key){
        favority = false;
      }
    }
    if(favority){
      a.push(data);
      this.toastrService.wait("Producto Agregado", "Producto Agregado como Favorito");
      setTimeout(() => {
        localStorage.setItem("avf_item", JSON.stringify(a));
      }, 1500);
    } else {
      this.toastrService.wait("Producto Agregado", "Producto ya esta en lista");
    }
    
  }

  // Fetching unsigned users favourite proucts
  getLocalFavouriteProducts(): Product[] {
    const products: Product[] =
      JSON.parse(localStorage.getItem("avf_item")) || [];

    return products;
  }

  // Removing Favourite Product from Database
  removeFavourite(key: string) {
    this.favouriteProducts.remove(key);
  }

  // Removing Favourite Product from localStorage
  removeLocalFavourite(product: Product) {
    const products: Product[] = JSON.parse(localStorage.getItem("avf_item"));

    for (let i = 0; i < products.length; i++) {
      if (products[i].productId === product.productId) {
        products.splice(i, 1);
        break;
      }
    }
    // ReAdding the products after remove
    localStorage.setItem("avf_item", JSON.stringify(products));
  }

  /*
   ----------  Cart Product Function  ----------
  */

  // Adding new Product to cart db if logged in else localStorage
  addToCart(data: Product): void {
    let exist = false;
    const a: Product[] = JSON.parse(localStorage.getItem("avct_item")) || [];
    
   
    for (let i = 0; i < a.length; i++) {
      if (a[i].productId === data.productId) {
        a[i].cartQuantity+=data.cartQuantity;
        exist = true;
      }
    }
    if(!exist){
      a.push(data);
    }
    console.log(a);
    this.toastrService.wait(
      "Adding Product to Cart",
      "Product Adding to the cart"
    );
    setTimeout(() => {
      localStorage.setItem("avct_item", JSON.stringify(a));
    }, 500);

  }

  deleteCart(): void {
      localStorage.setItem("avct_item", JSON.stringify([]));
  }

  addToValue(data: number): void {
    localStorage.setItem("avct_value", JSON.stringify(data));
  }

  // Removing cart from local
  removeLocalCartProduct(product: Product) {
    const products: Product[] = JSON.parse(localStorage.getItem("avct_item"));

    for (let i = 0; i < products.length; i++) {
      if (products[i].productId === product.productId) {
        products.splice(i, 1);
        break;
      }
    }
    this.toastrService.wait(
      "Perfecto",
      "Carrito actualizado."
    );
    // ReAdding the products after remove
    localStorage.setItem("avct_item", JSON.stringify(products));
  }

    // Update cart from local
    updateLocalCartProduct(product: Product) {
      const products: Product[] = JSON.parse(localStorage.getItem("avct_item"));
  
      for (let i = 0; i < products.length; i++) {
        if (products[i].productId === product.productId) {
          products[i] = product;
          break;
        }
      }
      this.toastrService.wait(
        "Perfecto",
        "Carrito actualizado."
      );
      // ReAdding the products after remove
      localStorage.setItem("avct_item", JSON.stringify(products));
    }

  // Fetching Locat CartsProducts
  getLocalCartProducts(): Product[] {
    const products: Product[] =
      JSON.parse(localStorage.getItem("avct_item")) || [];
    return products;
  }

  getLocalCartProductsQuantity() {
    let quantity = 0;
    const products: Product[] =
      JSON.parse(localStorage.getItem("avct_item")) || [];
      for (let i = 0; i < products.length; i++) {
        quantity+= products[i].cartQuantity;
      }
    return quantity;
  }

  getValueCurrency(): number {
    return JSON.parse(localStorage.getItem("avct_value"));
  }
}

export class FavouriteProduct {
  product: Product;
  productId: string;
  userId: string;
}
