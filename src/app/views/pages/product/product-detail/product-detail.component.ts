import { Product } from "../../../../shared/models/product";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "../../../../shared/services/product.service";
import { ToastrService } from "src/app/shared/services/toastr.service";
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryImageSize } from 'ngx-gallery-9';
@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.scss"],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];
  private sub: any;
  product: Product;
  loading: boolean =true;
  valueList = [
  ];
  constructor(
    private route: ActivatedRoute,
    public productService: ProductService,
    private toastrService: ToastrService
  ) {
    this.product = new Product();
  }

  ngOnInit() {

    this.galleryOptions = [
      { "imagePercent": 80, "thumbnailsPercent": 20, "thumbnailsColumns": 2, "thumbnailsMargin": 0, "thumbnailMargin": 0 },



      {
        width: '100%',
        height: '254px',
        imageSize: NgxGalleryImageSize.Contain,
        imageAnimation: NgxGalleryAnimation.Slide,
    },
    // max-width 544
    {
        breakpoint: 544,
        width: '100%',
        height: '250px',
        imageSize: NgxGalleryImageSize.Cover,
        imageAnimation: NgxGalleryAnimation.Slide,
    }
      ];
  


    this.sub = this.route.params.subscribe((params) => {
      const id = params.id; // (+) converts string 'id' to a number
      this.getProductDetail(id);
    });
  }

  setLang(val: number) {
    this.product.cartQuantity = val;
    console.log(this.product);
  }

  getProductDetail(id: string) {
    this.loading = true;
    const x = this.productService.getProductById(id);
    x.snapshotChanges().subscribe(
      (product) => {
        const y = { ...(product.payload.toJSON() as Product), $key: id };
        this.product = y;
        console.log(this.product);
        for(let i =0; i< Object.values(this.product.images).length; i++){
          this.galleryImages.push({
            small: this.product.images[i],
            medium: this.product.images[i],
            big: this.product.images[i]
            }
          )
        }
        console.log(this.galleryImages);
        for(let i =0; i<this.product.productQuantity && i<10; i++){
          this.valueList.push(i+1);
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.toastrService.error("Error while fetching Product Detail", error);
      }
    );
  }

  addToCart(product: Product) {
    this.productService.addToCart(product);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}