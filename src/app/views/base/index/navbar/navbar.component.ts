import { TranslateService } from "./../../../../shared/services/translate.service";
import { Component, OnInit, VERSION } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./../../../../shared/services/auth.service";
import { ProductService } from "./../../../../shared/services/product.service";

import { ThemeService } from "src/app/shared/services/theme.service";
declare var $: any;

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  angularVersion = VERSION;
  search: string = '';
  colorPallet1 = [
    {
      title: "Purple Theme",
      color: "color-purple",
      id: "purple-theme",
    },
    {
      title: "Blue Theme",
      color: "color-blue",
      id: "blue-theme",
    },
  ];

  colorPallet2 = [
    {
      title: "Red Theme",
      color: "color-white",
      id: "white-theme",
    },
    {
      title: "Violet Theme",
      color: "color-violet",
      id: "violet-theme",
    },
  ];
  languageList = [
    { language: "Dolar", langCode: "en", image: '../../../../../assets/banner_img/197580.svg' },
    { language: "Pesos", langCode: "fr", image: '../../../../../assets/banner_img/197575.svg' }
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
    public productService: ProductService,
    public translate: TranslateService,
    private themeService: ThemeService
  ) {
    // console.log(translate.data);
  }

  ngOnInit() {
    console.log('test');
  }
  logout() {
    this.authService.logout();
    this.router.navigate(["/home"]);
  }

  setLang(lang: string) {
    if(lang === 'Pesos'){
      this.productService.addToValue(4400);
    }else {
      this.productService.addToValue(1);
    }
    // console.log("Language", lang);
    //this.translate.use(lang).then(() => {});
  }

  onSearch(){
    this.router.navigate(["/products/all-products", this.search]);
  }

  updateTheme(theme: string) {
    //this.themeService.updateThemeUrl(theme);
  }
}

