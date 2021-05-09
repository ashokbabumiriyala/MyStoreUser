import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { Validators, FormGroup, FormControl } from '@angular/forms';
import { HelperService } from 'src/app/common/helper.service';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { RegistrationServiceService } from '../../Shared/registration-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
 forgotUserName:boolean;
//  isFormSubmitted:boolean;
  constructor(private route: ActivatedRoute, private registrationServiceService:RegistrationServiceService,
    private toastController:ToastController,
    private helperService:HelperService,
    private loadingController: LoadingController, private router: Router) { }
  // forgotPasswordFormGroup: FormGroup;
  userName:string;
  email:string;
  showError:boolean = false;
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
        this.forgotUserName = JSON.parse(params.forgotUserName);
      }
    );
    // this.createForgotPasswordForm();
  }
  // get userName() {
  //   return this.forgotPasswordFormGroup.get('userName');
  // }
  // get email() {
  //   return this.forgotPasswordFormGroup.get('email');
  // }
  // private createForgotPasswordForm() {
  //   this.forgotPasswordFormGroup = new FormGroup({
  //     userName: new FormControl('', Validators.required),
  //     email: new FormControl('', Validators.required)
  //   });
  // }
  async presentToast(data: string,tostarColor:string) {
    const toast = await this.toastController.create({
      message: data,
      duration: 2000,
      position: 'bottom',
      color: tostarColor
    });
    toast.present();
  }
  async retrievePassword(): Promise<void> {
    if (!this.forgotUserName && !this.userName) {
      this.showError = true;
      return;
    } else if (this.forgotUserName && !this.email) {
      this.showError = true;
      return;
    }
    const loadingController = await this.helperService.createLoadingController("loading");
    await loadingController.present();
    let dataObject = {};
    let apiName;
    if(!this.forgotUserName){
      dataObject["SearchKey"] = this.userName;
      apiName = "UserForgotPassword";
    } else {
      dataObject["SearchKey"] = this.email;
      apiName = "UserForgotUserName";
    }
    await  this.registrationServiceService.retrieveUserNameOrPassword(apiName, dataObject)
      .subscribe((data: any) => {
        this.router.navigate(['login']);
       this.presentToast("Sent Forgot Password Link to your Registered Mobile/Email.","success");
       loadingController.dismiss();
      },
        (error: any) => {
            this.presentToast("Invalid User Name or Password.","danger");
            loadingController.dismiss();
        });

  }
}
