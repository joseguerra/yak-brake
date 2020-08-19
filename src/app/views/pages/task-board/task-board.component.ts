import { tasks } from "./../../../shared/moke_data/tasks";
import { Component, OnInit } from "@angular/core";
import { OrderService } from "../../../shared/services/order.service";
import { Order } from "../../../shared/models/order";
import { ToastrService } from "src/app/shared/services/toastr.service";
import { ProductService } from "../../../shared/services/product.service";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import * as _ from "lodash";
@Component({
  selector: "app-task-board",
  templateUrl: "./task-board.component.html",
  styleUrls: ["./task-board.component.scss"],
})
export class TaskBoardComponent implements OnInit {
  orders: Order[];
  kanbanContainers = [
  ];
  load = false;
  order: any = [];
  cartQuantity = 0;
  totalValue = 0;
  constructor(public orderService: OrderService,
    public productService: ProductService,
    private toastrService: ToastrService) {}

  ngOnInit() {
    this.getAllOrders();
  }

  getAllOrders() {
    //this.loading = true;
    this.load = true;
    const x = this.orderService.getOrders();
    x.snapshotChanges().subscribe(
      (product) => {
        //this.loading = false;
        this.orders = [];
        product.forEach((element) => {
          const y = { ...element.payload.toJSON(), $key: element.key };
          this.orders.push(y as Order);
        });
        this.orders = this.orders.reverse();
        console.log(this.orders);

        this.kanbanContainers = [
          {
            title: "Enviar",
            id: "todoList",
            connectedTo: ["inProgressList"],
            item: _.sortBy(
              this.orders.filter((task) => task.status === "IK_TODO"),
              ["columnIndex"]
            ),
          },
          {
            title: "En Progreso",
            id: "inProgressList",
            connectedTo: ["todoList", "completedList"],
            item: _.sortBy(
              this.orders.filter((task) => task.status === "IK_PROGRESS"),
              ["columnIndex"]
            ),
          },
          {
            title: "Completado",
            id: "completedList",
            connectedTo: ["inProgressList"],
            item: _.sortBy(
              this.orders.filter((task) => task.status === "IK_COMPLETED"),
              ["columnIndex"]
            ),
          },
        ];
        this.load = false;
      },
      (err) => {
        this.load = false;
        this.toastrService.error("Error while fetching Products", err);
      }
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      if(event.container.id === "inProgressList"){
        this.orderService.updateOrder(event.container.data[event.currentIndex], "IK_PROGRESS")
      } else if(event.container.id === "completedList"){
        this.orderService.updateOrder(event.container.data[event.currentIndex], "IK_COMPLETED")
      } else{
        this.orderService.updateOrder(event.container.data[event.currentIndex], "IK_TODO")
      }


    }
  }
  onSelect(event) {
    this.totalValue =0;
    this.cartQuantity =0;
    this.order = event
    this.order.products = Object.values(event.products);

    this.order.products.forEach((product) => {
      for (let i = 0; i < product.cartQuantity; i++) {
        this.totalValue += product.productPrice;
        this.cartQuantity++;
      }
    });

    console.log(this.order);
  }
}
