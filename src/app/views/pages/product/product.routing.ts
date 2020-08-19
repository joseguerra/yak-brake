import { IndexComponent } from "../../base/index/index.component";
import { CartProductsComponent } from "./cart-products/cart-products.component";
import { FavouriteProductsComponent } from "./favourite-products/favourite-products.component";
import { ProductListComponent } from "./product-list/product-list.component";
import { CatalogComponent } from "./catalog/catalog.component";
import { ContactComponent } from "./contact/contact.component";
import { OurComponent } from "./our/our.component";
import { Routes } from "@angular/router";

import { ProductDetailComponent } from "./product-detail/product-detail.component";

export const ProductRoutes: Routes = [
  {
    path: "products",
    children: [
      {
        path: "",
        component: IndexComponent,
      },
      {
        path: "all-products",
        component: ProductListComponent,
      },
      {
        path: "all-products/:id",
        component: ProductListComponent,
      },
      {
        path: "catalog",
        component: CatalogComponent,
      },
      {
        path: "contact",
        component: ContactComponent,
      },
      {
        path: "our",
        component: OurComponent,
      },
      {
        path: "favourite-products",
        component: FavouriteProductsComponent,
      },
      {
        path: "cart-items",
        component: CartProductsComponent,
      },
      {
        path: "checkouts",
        loadChildren: () =>
          import("./checkout/checkout.module").then((m) => m.CheckoutModule),
      },
      {
        path: "product/:id",
        component: ProductDetailComponent,
      },
    ],
  },
];
