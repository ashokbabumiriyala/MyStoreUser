import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IUserDetails } from 'src/app/common/provider-details';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { Market } from '@ionic-native/market/ngx';
import { AvailableStoreTypes } from './Enums';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  iUserDetails: IUserDetails;
  // public providerSource = new BehaviorSubject<IProviderDetails>(this.iProviderDetails)
  // providerDetails = this.providerSource.asObservable();

  constructor(
    private loadingController: LoadingController,
    private router: Router,
    private alertCtrl: AlertController,
    private market: Market,
    private toastController: ToastController,
    private storageService: StorageService
  ) {}

  private profileObs$: BehaviorSubject<IUserDetails> = new BehaviorSubject(
    null
  );
  private cartItems$: BehaviorSubject<any[]> = new BehaviorSubject(null);
  private cartItemsType$: BehaviorSubject<AvailableStoreTypes> =
    new BehaviorSubject(AvailableStoreTypes.Unkown);
  private storeLocationDetails$: BehaviorSubject<string> = new BehaviorSubject(
    null
  );
  private deliveryAddress$: BehaviorSubject<any[]> = new BehaviorSubject(null);

  private products$: BehaviorSubject<any[]> = new BehaviorSubject(null);
  private services$: BehaviorSubject<any[]> = new BehaviorSubject(null);

  getProfileObs(): Observable<any> {
    return this.profileObs$.asObservable();
  }
  setProfileObs(profile: IUserDetails) {
    this.profileObs$.next(profile);
  }
  getCartItemsType(): Observable<AvailableStoreTypes> {
    return this.cartItemsType$.asObservable();
  }
  setCartItemsType(availableStoreType: AvailableStoreTypes) {
    this.cartItemsType$.next(availableStoreType);
  }
  getStoreLocationDetails(): Observable<string> {
    return this.storeLocationDetails$.asObservable();
  }
  setStoreLocationDetails(storeDetails: string) {
    this.storeLocationDetails$.next(storeDetails);
  }
  getCartItems(): Observable<any> {
    return this.cartItems$.asObservable();
  }

  async setCartItems(cartItems: any[]) {
    await this.storageService.set('cartUpdated', 'true');
    this.cartItems$.next(cartItems);
  }
  getDeliveryAddress(): Observable<any> {
    return this.deliveryAddress$.asObservable();
  }
  setDeliveryAddress(deliveryAddress: any) {
    this.deliveryAddress$.next(deliveryAddress);
  }
  async createLoadingController(displayMessage: string): Promise<any> {
    const loadingController = await this.loadingController.create({
      message: displayMessage,
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
  async presentToast(data: string, toastColor: string) {
    const toast = await this.toastController.create({
      message: data,
      duration: 2000,
      position: 'bottom',
      color: toastColor,
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
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            alert.dismiss(false);
            return false;
          },
        },
      ],
    });
    await alert.present();
    await alert.onDidDismiss().then((data) => {
      result = data;
    });
    return result;
  }

  navigateWithData(url: any, data: any): Promise<boolean> {
    const navigationExtras: NavigationExtras = {
      state: {
        pageData: data,
      },
    };
    return this.router.navigate(url, navigationExtras);
  }

  getPageData(): any {
    var extrasState = this.router.getCurrentNavigation().extras.state;
    if (extrasState) {
      return extrasState?.pageData;
    }
  }
  async showAlert(message) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      message: message,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Update',
          handler: () => {
            this.market.open('com.velocious.my3karrt');
          },
        },
      ],
    });
    await alert.present();
  }
  getProducts(): Observable<any> {
    return this.products$.asObservable();
  }
  setProducts(products: any[]) {
    this.products$.next(products);
  }
  getServices(): Observable<any> {
    return this.services$.asObservable();
  }
  setServices(services: any[]) {
    this.services$.next(services);
  }

  isNullOrUndefined(value: any) {
    return value === null || value === undefined;
  }
}
export interface iDropdown {
  label: string;
  value: number;
}
