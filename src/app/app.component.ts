import { Component, OnInit } from "@angular/core";
import { ProductService } from "./shared/services/product.service";
import { fadeAnimation } from "./shared/animations/fadeIntRoute";
declare var $: any;
declare var toastr: any;
@Component({
  selector: "app-root",
  template: `
    <div class="container">
      <app-navbar>
      </app-navbar>
      <main [@fadeAnimation]="o.isActivated ? o.activatedRoute : ''">
        <router-outlet #o="outlet">
        <a *ngIf="productService.getValueCurrency() === 1" class="qlwapp-toggle" data-action="open" data-phone="+573157005569"
        data-message="Buen día, podrías darme información sobre tus productos 
        ?" href="https://wa.me/+584247117137?text=Buen%20día,%20podrías%20darme%20información%20sobre%20tus%20productos%20?" target="_blank">
        <i class="fa fa-whatsapp"></i>
        <span class="padding-left">
        Bienvenido(a) a Yak Brake! Contactanos.
        </span> 
       </a>
       <a *ngIf="productService.getValueCurrency() !== 1" class="qlwapp-toggle" data-action="open" data-phone="+573157005569"
        data-message="Buen día, podrías darme información sobre tus productos 
        ?" href="https://wa.me/+573157005569?text=Buen%20día,%20podrías%20darme%20información%20sobre%20tus%20productos%20?" target="_blank">
        <i class="fa fa-whatsapp"></i>
        <span class="padding-left">
        Bienvenido(a) a Yak Brake! Contactanos.
        </span> 
       </a>
        </router-outlet>
      </main>

      <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Bienvenido a Yak Brake</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
            Puedes cambiar tu moneda y metodos de pago en la esquina superior derecha
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-dismiss="modal">OK</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- <app-footer></app-footer> -->
      <app-loader-spinner></app-loader-spinner>
    </div>
  `,
  styleUrls: ["./app.component.scss"],
  animations: [fadeAnimation],
})
export class AppComponent implements OnInit {
  constructor(public productService: ProductService) {}

  ngOnInit() {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "10000",
      "timeOut": "300000",
      "extendedTimeOut": "1000",
  };


    console.log(this.productService.getValueCurrency());
    if (!this.productService.getValueCurrency()) {
      console.log('entre');
      $("#exampleModalCenter").modal("show");
      this.productService.addToValue(1);
    } 

    //if (navigator.geolocation) {
    //  navigator.geolocation.getCurrentPosition(this.setGeoLocation.bind(this));
    //}
  }


}
