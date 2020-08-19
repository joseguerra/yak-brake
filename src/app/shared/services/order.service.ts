import { Injectable } from "@angular/core";
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from "@angular/fire/database";
import { Order } from "../models/order";
import { AuthService } from "./auth.service";
import { ToastrService } from "./toastr.service";

@Injectable()
export class OrderService {
  //firebase = require('firebase/app');
  //functions = this.firebase.functions();
  orders: AngularFireList<any>;

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {
    this.orders = this.db.list("orders");
  }

  /*sendEmailConfirmation(data) {
    const result = this.functions.httpsCallable('sendEmailConfirmation');
    return result(data);
  }*/

  getOrderById(id) {
      this.orders = this.db.list("orders", (ref) =>
        ref.orderByChild("id").equalTo(id)
      );
      return this.orders;
  }

  getOrders() {
    this.orders = this.db.list("orders")
    return this.orders;
  }

  createOrder(data: Order, callback: () => void) {
    this.orders.push(data);
    callback();
  }

  updateOrder(key , status: string) {
    console.log(key)
    console.log(status)
    this.orders.update(key.$key, {
      status: status
    });
    this.toastrService.wait(
      "Perfecto",
      "Orden Actualizada"
    );
  }

  deleteOrder(key: string) {
    this.orders.remove(key);
  }


  addToValue(data: number): void {
    localStorage.setItem("avct_value", JSON.stringify(data));
  }


  getValueCurrency(): number {
    return JSON.parse(localStorage.getItem("avct_value")) || 1;
  }
}