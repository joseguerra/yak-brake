import { Component, OnInit, Input } from "@angular/core";
import { NgForm } from "@angular/forms";
import { CatalogService } from "src/app/shared/services/catalog.service";
import { Catalog } from "src/app/shared/models/catalog";

declare var $: any;
declare var require: any;
declare var toastr: any;
const shortId = require("shortid");
const moment = require("moment");

@Component({
  selector: "app-add-catalog",
  templateUrl: "./add-catalog.component.html",
  styleUrls: ["./add-catalog.component.scss"],
})
export class AddCatalogComponent implements OnInit {
  catalog: Catalog = new Catalog();
  constructor(private catalogService: CatalogService) {}

  ngOnInit() {
  }

  createProduct(productForm: NgForm) {
    const payload: Catalog = {
      ...productForm.value
    };


    this.catalogService.createCatalog(payload, () => {
      this.catalog = new Catalog();
      $("#exampleModalLong").modal("hide");
      toastr.success(
        "Catalog " + payload.productName + "is added successfully",
        "Catalog Creation"
      );
    });
  }
}
