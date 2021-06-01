import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IProviderDetails} from 'src/app/common/provider-details';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { Market } from '@ionic-native/market/ngx';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
 iProviderDetails:IProviderDetails;
// public providerSource = new BehaviorSubject<IProviderDetails>(this.iProviderDetails)
// providerDetails = this.providerSource.asObservable();

constructor(private loadingController:LoadingController, private router:Router,
  private alertCtrl: AlertController, private market: Market, private toastController: ToastController) { }

private profileObs$: BehaviorSubject<IProviderDetails> = new BehaviorSubject(null);
private cartItems$: BehaviorSubject<any[]> = new BehaviorSubject(null);

getProfileObs(): Observable<any> {
    return this.profileObs$.asObservable();
}
setProfileObs(profile: IProviderDetails) {
    this.profileObs$.next(profile);
}
getCartItems(): Observable<any> {
  return this.cartItems$.asObservable();
}
setCartItems(cartItems: any[]) {
  sessionStorage.setItem('cartUpdated', 'true');
  this.cartItems$.next(cartItems);
}
async createLoadingController(displayMessage:string): Promise<any> {
  const loadingController = await this.loadingController.create({
      message: displayMessage
  });
  return loadingController;
}
prepareDropDownData(items: any): iDropdown[] {
  let iDropdownItems: iDropdown[];
  const defaultSelectText = '-- Please Select --';
  iDropdownItems = [{ label: defaultSelectText, value: null }];
  if (items) {
    for (const item of items) {
      iDropdownItems.push({ label: item.text, value: item.value });
    }
  }
  return iDropdownItems;
}
async presentToast(data: string, toastColor:string) {
  const toast = await this.toastController.create({
    message: data,
    duration: 2000,
    position: 'bottom',
    color: toastColor
  });
  toast.present();
}
async presentAlertConfirm(message) {
  let result;
  const alert = await this.alertCtrl.create({
    cssClass: 'my-custom-class',
    header: 'Alert',
    message: message,
    buttons: [
    {
        text: 'Confirm',
        handler: () => {
        
          alert.dismiss(true);
          return false;
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
         
          alert.dismiss(false);
          return false;
        }
      }
    ]
  });
  await alert.present();
  await alert.onDidDismiss().then((data) => {
    result = data;
  })
  return result;
}


navigateWithData(url: any, data: any): Promise<boolean> {
  const navigationExtras: NavigationExtras = {
    state: {
      pageData: data
    }
  };
  return this.router.navigate(url, navigationExtras);
}

getPageData(): any {
  if (this.router.getCurrentNavigation().extras.state) {
    return this.router.getCurrentNavigation().extras.state.pageData;
  }
}
async showAlert(message){
  const alert = await this.alertCtrl.create({
    cssClass: 'my-custom-class',
    header: 'Alert',
    message: message,
    backdropDismiss: false,
    buttons: [
    {
        text: 'Update',
        handler: () => {
          this.market.open('com.velocious.my3Karrt_admin');
        }
      }
    ]
  });
  await alert.present();
}



}

export interface iDropdown {
  label: string;
  value: number;
}
