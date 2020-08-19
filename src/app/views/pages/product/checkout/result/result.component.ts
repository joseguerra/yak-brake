import { Product } from "../../../../../shared/models/product";
import { Order } from "../../../../../shared/models/order";
import { OrderService } from "../../../../../shared/services/order.service";
import { ProductService } from "../../../../../shared/services/product.service";
import { UserDetail } from "../../../../../shared/models/user";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
declare var $: any;
declare var toastr: any;
declare var paypal;
declare var ePayco;
@Component({
  selector: "app-result",
  templateUrl: "./result.component.html",
  styleUrls: ["./result.component.scss"],
})
export class ResultComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement : ElementRef;

  products: Product[];
  registerForm: FormGroup;
  date: number;
  totalPrice = 0;
  tax = 6.4;
  userDetail: UserDetail;
  order: Order = new Order();
  load = false;

  constructor(public orderService: OrderService,
    private formBuilder: FormBuilder,
    private router: Router,
    public productService: ProductService) {
    /* Hiding Billing Tab Element */

    this.userDetail = new UserDetail();
    this.products = productService.getLocalCartProducts();

    this.products.forEach((product) => {
      for (let i = 0; i < product.cartQuantity; i++) {
        this.totalPrice += product.productPrice;
      }
    });

    console.log( this.registerForm);
    this.date = Date.now();
  }

  ngOnInit(){
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      address2: ['', []],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', []]
    });

    console.log(this.registerForm);

    paypal
    .Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: 'Yak Brake',
              amount     :{
                currency_code: 'USD',
                value        : this.totalPrice
              }
            }
          ]
        })
      },
      onApprove: async (data, actions) => {
        this.load = true;
        const order = await actions.order.capture();
        console.log(order);
        this.createOrder(this.registerForm);
      },
      onError: err =>{
        console.log(err);
        toastr.wait(
          "Error en pago",
          "Pago Declinado"
        );
      }
    })
    .render( this.paypalElement.nativeElement );

  }

  payEpayco(productForm){
    console.log(productForm.value);
    localStorage.setItem("formData", JSON.stringify(productForm.value));
    localStorage.setItem("check", "true");
    var handler = ePayco.checkout.configure({
      key: '7e97594d1d51a8d91e207c0c8db74891',
      test: false
    })

    var data={
      //Parametros compra (obligatorio)
      name: 'Yak Brake',
      description: 'Yak Brake',
      invoice: "1234",
      currency: "cop",
      amount: this.totalPrice * this.productService.getValueCurrency(),
      tax_base: "0",
      tax: "0",
      country: "co",
      lang: "es",

      //Onpage="false" - Standard="true"
      external: "false",


      //Atributos opcionales
      extra1: "extra1",
      extra2: "extra2",
      extra3: "extra3",
      confirmation: "http://localhost:4200/",
      response: "http://localhost:4200/",
      rejected: "http://localhost:4200/checkouts",

      //Atributos cliente
      name_billing: "Andres Perez",
      address_billing: "Carrera 19 numero 14 91",
      type_doc_billing: "cc",
      mobilephone_billing: "3050000000",
      number_doc_billing: "100000000",

      }
      handler.open(data)
  }


  createOrder(productForm) {
    this.load = true;
    console.log(productForm);

    this.productService.updateQuantityProduct();

    for(let i =0; i<this.products.length; i++){
      delete this.products[i].$key;
    }

    const payload: Order = {
      ...productForm.value,
      products: this.products,
      total: this.totalPrice  * this.productService.getValueCurrency(),
      status: 'IK_TODO',
      date: this.date
    };

    this.orderService.createOrder(payload, () => {
      this.order = new Order();



      this.productService.deleteCart();
      this.load = false;
      this.router.navigate(["/"]);

      

      $("#exampleModalLong").modal("hide");
      toastr.success(
        "Muchas gracias por su compra!",
        "Pronto nos comunicaremos contigo"
      );
    });
  }
}
