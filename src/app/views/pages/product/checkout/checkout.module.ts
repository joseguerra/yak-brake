import { CheckoutRoutingModule } from "./checkout.routing";
import { SharedModule } from "../../../../shared/shared.module";
import { CheckoutNavbarComponent } from "./checkout-navbar/checkout-navbar.component";
import { ResultComponent } from "./result/result.component";
import { ProductsComponent } from "./products/products.component";
import { ShippingDetailsComponent } from "./shipping-details/shipping-details.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CheckoutComponent } from "./checkout.component";
import { BillingDetailsComponent } from "./billing-details/billing-details.component";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  imports: [CommonModule, SharedModule, CheckoutRoutingModule, ReactiveFormsModule,
    FormsModule],
  declarations: [
    CheckoutComponent,
    BillingDetailsComponent,
    ShippingDetailsComponent,
    ProductsComponent,
    ResultComponent,
    CheckoutNavbarComponent,
  ],
  exports: [CheckoutComponent],
})
export class CheckoutModule {}
