import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from "@angular/core";
import { Product } from "../../../../shared/models/product";
import { ProductService } from "../../../../shared/services/product.service";

@Component({
  selector: "app-cart-calculator",
  templateUrl: "./cart-calculator.component.html",
  styleUrls: ["./cart-calculator.component.scss"],
})
export class CartCalculatorComponent implements OnInit, OnChanges {
  @Input() products: Product[];

  totalValue = 0;
  cartQuantity = 0;
  valueList = [
    1,2,3,4,5,6,7,8,9,10
  ];
  messageTitle = "No hay productos en el carrito";
  messageDescription = "Por favor, Agregue productos al carrito";

  constructor(public productService: ProductService) {}

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.products);
    this.totalValue = 0;
    this.products.forEach((product) => {
      for (let i = 0; i < product.cartQuantity; i++) {
        this.totalValue += product.productPrice;
        this.cartQuantity++;
      }

    });
    
  }

  setLang(val: number,i) {
    this.products[i].cartQuantity = val;
    console.log(this.products[i]);
    this.productService.updateLocalCartProduct(this.products[i]);
    this.getCartProduct();
  }

  ngOnInit() {}

  getCartProduct(){
    this.products = JSON.parse(localStorage.getItem("avct_item"));
    this.totalValue = 0;
    this.cartQuantity = 0;
    this.products.forEach((product) => {
      for (let i = 0; i < product.cartQuantity; i++) {
        this.totalValue += product.productPrice;
        this.cartQuantity++;
      }

    });
    
    
    console.log(this.products);
  }

  removeCartProduct(product: Product) {
    this.productService.removeLocalCartProduct(product);
    this.getCartProduct();
    // Recalling  
    //this.getCartProduct();
  }
}
