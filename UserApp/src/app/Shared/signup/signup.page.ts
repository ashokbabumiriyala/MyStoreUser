import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidation } from 'src/app/common/must-match.validator';
import { HelperService } from 'src/app/common/helper.service';
import { SignUpService } from 'src/app/Shared/signup/sign-up.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  ModalController,
  AnimationController,
  ToastController,
} from '@ionic/angular';
import { TermsandconditionsComponent } from '../../information-pages/termsandconditions/termsandconditions.component';
declare var google: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  editProfile: boolean = false;
  readProfile: any;
  latitude: any;
  longitude: any;
  geocoder: any;
  showTermsAndConditions: boolean;
  constructor(
    private route: ActivatedRoute,
    private helperService: HelperService,
    private signUpService: SignUpService,
    private router: Router,
    private modalController: ModalController,
    private toastController: ToastController,
    public animationCtrl: AnimationController,
    private geolocation: Geolocation
  ) {
    this.geocoder = new google.maps.Geocoder();
  }
  isignUp: IsignUp;
  signUpFormGroup: FormGroup;
  isFormSubmitted: boolean;
  userProfile: any = {};
  ngOnInit() {
    this.signUpFormGroupCreate();
    this.showTermsAndConditions = true;
    this.route.queryParams.subscribe((params) => {
      if (Object.keys(params).length > 0) {
        if (JSON.parse(params.signup)) {
          this.readProfile = false;
          this.editProfile = false;
        } else {
          this.readProfile = true;
          this.editProfile = false;
        }
      }
      if (this.readProfile) {
        this.getProfileData();
      }
    });
  }
  async getProfileData() {
    const loadingController = await this.helperService.createLoadingController(
      'loading'
    );
    await loadingController.present();
    let data = { UserId: Number(sessionStorage.getItem('UserId')) };
    await this.signUpService
      .getProfileData('UserProfileSelect', data)
      .subscribe(
        (data: any) => {
          loadingController.dismiss();
          let profileData = data.userProfile;
          this.userProfile = {
            UserName: profileData.userName,
            MobileNumber: profileData.mobileNumber,
            Email: profileData.email,
            Address: profileData.address,
            City: profileData.city,
            State: profileData.state,
            Pincode: profileData.pinCode,
            Password: '',
            confirmPassword: '',
          };
        },
        (error: any) => {
          loadingController.dismiss();
        }
      );
  }
  get Password() {
    return this.signUpFormGroup.get('Password');
  }
  get confirmPassword() {
    return this.signUpFormGroup.get('confirmPassword');
  }
  get Email() {
    return this.signUpFormGroup.get('Email');
  }
  get MobileNumber() {
    return this.signUpFormGroup.get('MobileNumber');
  }
  get UserName() {
    return this.signUpFormGroup.get('UserName');
  }
  get Address() {
    return this.signUpFormGroup.get('Address');
  }
  get City() {
    return this.signUpFormGroup.get('City');
  }
  get State() {
    return this.signUpFormGroup.get('State');
  }
  get Pincode() {
    return this.signUpFormGroup.get('Pincode');
  }
  get agreed() {
    return this.signUpFormGroup.get('agreed');
  }
  private signUpFormGroupCreate() {
    this.signUpFormGroup = new FormGroup(
      {
        UserName: new FormControl('', Validators.required),
        MobileNumber: new FormControl('', Validators.required),
        Email: new FormControl('', Validators.required),
        Password: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required),
        Address: new FormControl('', Validators.required),
        City: new FormControl('', Validators.required),
        State: new FormControl('', Validators.required),
        Pincode: new FormControl('', Validators.required),
        agreed: new FormControl('false', Validators.required),
      },
      {
        validators: [ConfirmPasswordValidation.ConfirmPassword],
      }
    );
  }
  async register(): Promise<void> {
    debugger;
    if (
      this.signUpFormGroup.controls.agreed.value === 'false' ||
      this.signUpFormGroup.controls.agreed.value === false
    ) {
      this.signUpFormGroup.controls['agreed'].setErrors({ error: true });
    }
    this.isFormSubmitted = true;
    if (this.editProfile) {
      this.signUpFormGroup.controls['Password'].setErrors(null);
      this.signUpFormGroup.controls['confirmPassword'].setErrors(null);
      this.signUpFormGroup.controls['agreed'].setErrors(null);
    }
    if (this.signUpFormGroup.invalid) {
      return;
    }
    const loadingController = await this.helperService.createLoadingController(
      'loading'
    );
    await loadingController.present();
    let fullAddress =
      this.Address.value +
      ',' +
      this.City.value +
      ',' +
      this.State.value +
      ',' +
      this.Pincode.value;
    this.geocoder.geocode({ address: fullAddress }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        this.latitude = results[0].geometry.location.lat();
        this.longitude = results[0].geometry.location.lng();
      } else {
        this.latitude = null;
        this.longitude = null;
      }
      this.isignUp = {
        UserName: this.UserName.value,
        MobileNumber: this.MobileNumber.value.toString(),
        Email: this.Email.value,
        Password: this.Password.value,
        Address: this.Address.value,
        City: this.City.value,
        State: this.State.value,
        Pincode: this.Pincode.value,
        Latitude: this.latitude?.toString(),
        Longitude: this.longitude?.toString(),
      };
      let apiName = 'UserSignupSave';
      if (this.editProfile) {
        apiName = 'UpdateUserProfile';
        this.isignUp['UserId'] = Number(sessionStorage.getItem('UserId'));
        delete this.isignUp['Password'];
      }

      this.signUpService.providerSignUp(apiName, this.isignUp).subscribe(
        (data: any) => {
          loadingController.dismiss();
          if (!this.editProfile && !this.readProfile) {
            if (data?.operationStatusDTO?.transactionStatus == 10) {
              this.presentToast('This user already exists', 'danger');
            } else {
              this.signUpFormGroup.reset();
              this.router.navigate(['login']);
              this.presentToast('Registration successfully.', 'success');
            }
          } else {
            this.presentToast('Profile Update successfully.', 'success');
            this.userProfile = this.signUpFormGroup.getRawValue();
            this.editProfile = false;
            this.readProfile = true;
            this.signUpFormGroup.reset();
          }
        },
        (error: any) => {
          this.presentToast('error', 'danger');
          loadingController.dismiss();
        }
      );
    });
  }
  async presentAlertTermsConditions() {
    const enterAnimation = (baseEl: any) => {
      const backdropAnimation = this.animationCtrl
        .create()
        .addElement(baseEl.querySelector('ion-backdrop')!)
        .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');
      const wrapperAnimation = this.animationCtrl
        .create()
        .beforeStyles({
          opacity: 1,
          height: '83%',
          width: 'auto',
          'min-width': '96vw',
          'margin-top': '6%',
        })
        .addElement(baseEl.querySelector('.modal-wrapper')!)
        .fromTo('transform', 'scale(0)', 'scale(1)');
      return this.animationCtrl
        .create()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(400)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    };
    const leaveAnimation = (baseEl: any) => {
      return enterAnimation(baseEl).direction('reverse');
    };
    const modal = await this.modalController.create({
      component: TermsandconditionsComponent,
      componentProps: { modal: true },
      enterAnimation,
      leaveAnimation,
    });
    return await modal.present();
  }

  getPosition() {
    var options = {
      enableHighAccuracy: true,
      maximumAge: 30000, // milliseconds e.g., 30000 === 30 seconds
      timeout: 27000,
    };
    this.geolocation
      .getCurrentPosition(options)
      .then((resp) => {})
      .catch((error) => {});
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
  async getCurrentLocation() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
      })
      .catch((error) => {});
  }
  async UpdateProfile() {
    this.editProfile = true;
    this.readProfile = false;
    this.setForamADetailsToPage(this.userProfile);
  }

  private setForamADetailsToPage(data: any): void {
    this.UserName.disable();
    this.MobileNumber.disable();
    this.showTermsAndConditions = false;
    this.signUpFormGroup.patchValue({
      UserName: data.UserName,
      MobileNumber: data.MobileNumber,
      Email: data.Email,
      Address: data.Address,
      City: data.City,
      State: data.State,
      Pincode: data.Pincode,
      agreed: true,
    });
  }

  async backToScreen() {
    this.editProfile = false;
    this.readProfile = true;
  }
}
interface IsignUp {
  UserName: string;
  MobileNumber: string;
  Email: string;
  Password: string;
  Address: string;
  City: string;
  State: string;
  Pincode: string;
  Latitude: string;
  Longitude: string;
}
