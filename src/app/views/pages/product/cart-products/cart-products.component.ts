import { Component, OnInit } from "@angular/core";
import { Product } from "../../../../shared/models/product";
import { ProductService } from "../../../../shared/services/product.service";
@Component({
  selector: "app-cart-products",
  templateUrl: "./cart-products.component.html",
  styleUrls: ["./cart-products.component.scss"],
})
export class CartProductsComponent implements OnInit {
  cartProducts: Product[];
  showDataNotFound = true;

  // Not Found Message

  messageTitle = "No hay productos en el carrito";
  messageDescription = "Por favor, Agregue productos al carrito";

  constructor(public productService: ProductService) {}

  ngOnInit() {
    this.getCartProduct();
  }

  removeCartProduct(product: Product) {
    this.productService.removeLocalCartProduct(product);

    // Recalling
    this.getCartProduct();
  }

  getCartProduct() {
    this.cartProducts = this.productService.getLocalCartProducts();
  }
}
