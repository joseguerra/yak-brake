import { Injectable } from "@angular/core";
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from "@angular/fire/database";
import { Catalog } from "../models/catalog";
import { AuthService } from "./auth.service";
import { ToastrService } from "./toastr.service";

@Injectable()
export class CatalogService {
  catalogs: AngularFireList<any>;

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {}

  getProducts() {
    this.catalogs = this.db.list("catalogs");
    return this.catalogs;
  }

  createCatalog(data: Catalog, callback: () => void) {
    this.catalogs.push(data);
    callback();
  }

  updateProduct(data: Catalog) {
    this.catalogs.update(data.$key, data);
  }

  deleteCatalog(key: string) {
    this.catalogs.remove(key);
  }


  addToValue(data: number): void {
    localStorage.setItem("avct_value", JSON.stringify(data));
  }


  getValueCurrency(): number {
    return JSON.parse(localStorage.getItem("avct_value")) || 1;
  }
}