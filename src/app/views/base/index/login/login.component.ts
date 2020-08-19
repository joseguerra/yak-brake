import { ToastrService } from "../../../../shared/services/toastr.service";
import { TranslateService } from "src/app/shared/services/translate.service";
import { NgForm, EmailValidator } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from "../../../../shared/services/user.service";
import { AuthService } from "../../../../shared/services/auth.service";
import { User } from "../../../../shared/models/user";
declare var $: any;
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  providers: [EmailValidator],
})
export class LoginComponent implements OnInit {
  user = {
    emailId: "",
    loginPassword: "",
  };

  errorInUserCreate = false;
  errorMessage: any;
  createUser;
  load = false;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    public translate: TranslateService,
    private toastService: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createUser = new User();
  }

  ngOnInit() {}

  addUser(userForm: NgForm) {
    userForm.value["isAdmin"] = false;
    this.authService
      .createUserWithEmailAndPassword(
        userForm.value["emailId"],
        userForm.value["password"]
      )
      .then((res) => {
        const user = {
          email: res.user.email,
          famil_name: res.user.displayName,
          uid: res.user.uid,
          verified_email: res.user.emailVerified,
          phoneNumber: res.user.phoneNumber,
          picture: res.user.photoURL,
        };

        this.userService.createUser(user);

        this.toastService.success("Perfecto", "Usuario Registrado");

        setTimeout((router: Router) => {
          $("#createUserForm").modal("hide");
          this.router.navigate(["/"]);
        }, 1500);
      })
      .catch((err) => {
        this.errorInUserCreate = true;
        this.errorMessage = err;
      });
  }

  signInWithEmail(userForm: NgForm) {
    this.load = true;
    this.authService
      .signInRegular(userForm.value["emailId"], userForm.value["loginPassword"])
      .then((res) => {
        console.log(res);
        this.toastService.success(
          "Autenticacion Satisfactoria",
          "Porfavor espere"
        );

        const returnUrl = this.route.snapshot.queryParamMap.get("returnUrl");

        setTimeout((router: Router) => {
          this.router.navigate([returnUrl || "/"]);
        }, 1500);
        this.load = false;
        this.router.navigate(["/"]);
      })
      .catch((err) => {
        this.load = false;
        this.toastService.error(
          "Autenticacion Fallida",
          "Invalida credencial, Porfavor revise su credencial"
        );
      });
  }

  signInWithGoogle() {
    this.load = true;
    this.authService
      .signInWithGoogle()
      .then((res) => {
        if (res.additionalUserInfo.isNewUser) {
          this.userService.createUser(res.additionalUserInfo.profile);
        }
        const returnUrl = this.route.snapshot.queryParamMap.get("returnUrl");
        location.reload();
        this.router.navigate(["/"]);
        this.load = false;
      })
      .catch((err) => {
        this.load = false;
        this.toastService.error("Error ocurrido", "Por favor trate de nuevo");
      });
  }
}
