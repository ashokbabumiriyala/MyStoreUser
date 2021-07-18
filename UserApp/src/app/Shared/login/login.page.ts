import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { HelperService } from 'src/app/common/helper.service';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { RegistrationServiceService } from '../../Shared/registration-service.service';
import { Router, NavigationStart } from '@angular/router';
import { IUserDetails } from '../../common/provider-details';
import { AuthenticationService } from '../../common/authentication.service';

declare var google: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private registrationServiceService: RegistrationServiceService,
    private toastController: ToastController,
    private helperService: HelperService,
    private authenticationService: AuthenticationService,
    private loadingController: LoadingController,

    private router: Router
  ) {}
  loginFormGroup: FormGroup;
  isFormSubmitted: boolean;
  menus: any[];
  lat: any;
  lng: any;
  ngOnInit() {
    this.createloginForm();
    this.helperService.setProfileObs(null);
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
      password: new FormControl('', Validators.required),
    });
  }

  async presentToast(data: string, tostarColor: string) {
    const toast = await this.toastController.create({
      message: data,
      duration: 2000,
      position: 'bottom',
      color: tostarColor,
    });
    toast.present();
  }
  async validateUser(): Promise<void> {
    this.isFormSubmitted = true;
    if (this.loginFormGroup.invalid) {
      return;
    }
    const loadingController = await this.helperService.createLoadingController(
      'loading'
    );
    await loadingController.present();
    const dataObject = {
      UserName: this.userName.value,
      Password: this.password.value,
    };
    await this.registrationServiceService
      .validateUser('UserLogin', dataObject)
      .subscribe(
        (data: any) => {
          this.authenticationService.isAuthenticated = true;
          sessionStorage.setItem('AuthToken', data.token);
          sessionStorage.setItem('UserId', data.userId);
          sessionStorage.setItem('UserName', data.userName);
          sessionStorage.setItem('UserAddress', data.userAddress);
          sessionStorage.setItem('MobileNumber', data.mobileNumber);
          sessionStorage.setItem('Email', data.email);

          let providerDetails: IUserDetails;
          providerDetails = {
            name: data.userName,
          };
          this.helperService.setProfileObs(providerDetails);
          this.router.navigate(['category-search']);
          this.presentToast('Explore My3Karrt!', 'success');
          this.getLocation();
          loadingController.dismiss();
        },
        (error: any) => {
          this.authenticationService.isAuthenticated = false;
          this.presentToast('Invalid User Name or Password.', 'danger');
          loadingController.dismiss();
        }
      );
  }
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: Position) => {
          if (position) {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            sessionStorage.setItem('lat', this.lat);
            sessionStorage.setItem('lng', this.lng);
            this.getUserStores();
          }
        },
        (error: PositionError) => console.log(error)
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
  async getUserStores() {
    const dataObj = {
      Latitude: sessionStorage.getItem('lat'),
      Longitude: sessionStorage.getItem('lng'),
    };
    await this.registrationServiceService
      .userStores('userStores', dataObj)
      .subscribe(
        (data: any) => {
          this.helperService.setProducts(data.userMerchant);
          this.helperService.setServices(data.userService);
        },
        (error: any) => {}
      );
  }
}
