import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidation } from 'src/app/common/must-match.validator';
import { HelperService }  from 'src/app/common/helper.service';
import {SignUpService} from 'src/app/Shared/signup/sign-up.service';
import { ToastController } from '@ionic/angular';
import {Geolocation} from '@ionic-native/geolocation/ngx'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  editProfile:boolean = false;
  constructor(private route: ActivatedRoute, private helperService:HelperService,
     private signUpService:SignUpService, private router:Router,
     private toastController:ToastController, private geolocation: Geolocation) { }
  isignUp:IsignUp;
  signUpFormGroup:FormGroup;
  isFormSubmitted:boolean;
  ngOnInit() {
    this.signUpFormGroupCreate();
    this.route.queryParams.subscribe(params => {
      if(Object.keys(params).length > 0) {
      this.editProfile = JSON.parse(params.prop);
      }
    }
  );
  }
  get Password() {
    return this.signUpFormGroup.get('Password');
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
  private signUpFormGroupCreate() {
    this.signUpFormGroup=new  FormGroup({
      UserName: new FormControl('', Validators.required),
      MobileNumber: new FormControl('', Validators.required)  ,
      Email: new FormControl('', Validators.required),
      Password: new FormControl('', Validators.required),
      confirmPassword:new FormControl('', Validators.required),
      Address:new FormControl('', Validators.required),
      City:new FormControl('', Validators.required),
      State:new FormControl('', Validators.required),
      Pincode:new FormControl('', Validators.required)
    },
    {
      validators: [ConfirmPasswordValidation.ConfirmPassword
      ]
    });
  }
  async register(): Promise<void>{
    this.isFormSubmitted = true;
      if (this.signUpFormGroup.invalid) {
        return;
      }
      const loadingController = await this.helperService.createLoadingController("loading");
      await loadingController.present();
      this.isignUp = {
        UserName :this.UserName.value,
        MobileNumber :this.MobileNumber.value.toString(),
        Email :this.Email.value,
        Password:this.Password.value,
        Address:this.Address.value,
        City: this.City.value,
        State: this.State.value,
        Pincode:this.Pincode.value,
        pushToken: sessionStorage.getItem('PushToken')
      };

     await this.signUpService.providerSignUp('UserSignupSave', this.isignUp)
      .subscribe((data: any) => {
        this.signUpFormGroup.reset();
        this.router.navigate(['login']);
        this.presentToast("Registration successfully.","success");
        loadingController.dismiss();
      },
        (error: any) => {
          loadingController.dismiss();
        });
     
  }
  getPosition () {
     var options = {
        enableHighAccuracy: true,
        maximumAge        : 30000, // milliseconds e.g., 30000 === 30 seconds
    timeout           : 27000 
      };
      this.geolocation.getCurrentPosition(options).then((resp) => {
        console.log(resp);
        // resp.coords.latitude
        // resp.coords.longitude

       }).catch((error) => {
         console.log('Error getting location', error);
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
  async getCurrentLocation () {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp)
      // resp.coords.latitude
      // resp.coords.longitude
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

}
interface  IsignUp{
  UserName :string;
  MobileNumber :string;
  Email :string;
  Password:string;
  pushToken:string;
  Address:string;
  City:string;
  State:string;
  Pincode:string;
 }
