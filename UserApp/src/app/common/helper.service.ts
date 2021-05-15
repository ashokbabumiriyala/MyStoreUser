import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IProviderDetails} from 'src/app/common/provider-details';
import { LoadingController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class HelperService { 
 iProviderDetails:IProviderDetails;
// public providerSource = new BehaviorSubject<IProviderDetails>(this.iProviderDetails)
// providerDetails = this.providerSource.asObservable();

constructor(private loadingController:LoadingController, private router:Router) { }

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



}

export interface iDropdown {
  label: string;
  value: number;
}
