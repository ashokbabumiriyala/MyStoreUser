import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { HelperService } from 'src/app/common/helper.service';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { RegistrationServiceService } from '../../Shared/registration-service.service';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private registrationServiceService:RegistrationServiceService,
    private toastController:ToastController,
    private helperService:HelperService,
    private loadingController: LoadingController, private router: Router) { }
  loginFormGroup: FormGroup;
  isFormSubmitted:boolean;
  menus: any[];
  ngOnInit() {
    this.createloginForm();
  }
  get userName() {
    return this.loginFormGroup.get('userName');
  }
  get password() {
    return this.loginFormGroup.get('password');
  }
  private createloginForm() {
    this.loginFormGroup = new FormGroup({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }
  async presentToast(data: string,tostarColor:string) {
    const toast = await this.toastController.create({
      message: data,
      duration: 2000,
      position: 'bottom',
      color: tostarColor
    });
    toast.present();
  }
  async validateUser(): Promise<void> {
    this.isFormSubmitted = true;
    if (this.loginFormGroup.invalid) {
      return;
    }
    const loadingController = await this.helperService.createLoadingController("loading");
    await loadingController.present();
    const dataObject = { UserName:this.userName.value, Password:this.password.value, pushToken: sessionStorage.getItem('PushToken') };
    await  this.registrationServiceService.validateUser('UserLogin', dataObject)
      .subscribe((data: any) => {
        sessionStorage.setItem("AuthToken",data.token);
        sessionStorage.setItem("UserId",data.userId);
        sessionStorage.setItem("UserName",data.userName);
        console.log(data);
        this.router.navigate(['category-search']);
       this.presentToast("login success.","success");
       loadingController.dismiss();
      },
        (error: any) => {
            this.presentToast("Invalid User Name or Password.","danger");
            loadingController.dismiss();
        });

  }

}
