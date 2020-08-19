import { CheckoutComponent } from "./checkout.component";
import { ResultComponent } from "./result/result.component";
import { ShippingDetailsComponent } from "./shipping-details/shipping-details.component";
import { BillingDetailsComponent } from "./billing-details/billing-details.component";
import { ProductsComponent } from "./products/products.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../../../../shared/guards/auth_gaurd";

export const checkoutRoutes: Routes = [
  {
    path: "checkouts",
    component: CheckoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        component: ResultComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(checkoutRoutes)],
  exports: [RouterModule],
})
export class CheckoutRoutingModule {}
