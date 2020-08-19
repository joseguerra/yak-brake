import { Component, OnInit } from "@angular/core";
import { Product } from "../../../../shared/models/product";
import { Catalog } from "../../../../shared/models/catalog";
import { AuthService } from "../../../../shared/services/auth.service";
import { CatalogService } from "../../../../shared/services/catalog.service";
import { ToastrService } from "src/app/shared/services/toastr.service";
@Component({
  selector: "app-catalog",
  templateUrl: "./catalog.component.html",
  styleUrls: ["./catalog.component.scss"],
})
export class CatalogComponent implements OnInit {
  productList: Catalog[];
  loading = false;
  brands = ["All", "Frenos", "Cauchos", "Tripas", "Parches", "Cadenas", "Discos"];

  selectedBrand: "All";

  page = 1;
  constructor(
    public authService: AuthService,
    public catalogService: CatalogService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    this.loading = true;
    const x = this.catalogService.getProducts();
    x.snapshotChanges().subscribe(
      (product) => {
        this.loading = false;
        this.productList = [];
        product.forEach((element) => {
          const y = { ...element.payload.toJSON(), $key: element.key };
          this.productList.push(y as Catalog);
        });
      },
      (err) => {
        this.toastrService.error("Error while fetching Products", err);
      }
    );
  }

  removeProduct(key: string) {
    this.catalogService.deleteCatalog(key);
  }



}
