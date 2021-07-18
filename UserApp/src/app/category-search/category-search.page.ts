import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { HelperService } from '../common/helper.service';
import { CategorySearchService } from '../category-search/category-search.service';
import { iDataTransferBetweenPages } from '../common/data-transfer-between-pages';
@Component({
  selector: 'app-category-search',
  templateUrl: './category-search.page.html',
  styleUrls: ['./category-search.page.scss'],
})
export class CategorySearchPage implements OnInit {

  constructor(private router:Router, private modalCtrl: ModalController,
    private helperService: HelperService, private categorySearchService: CategorySearchService) { }
    cartItems =[];
    homeResult:any[];
    isItemAvailable:boolean;
    public masterData:any = [];
    iDataTransferBetweenPages: iDataTransferBetweenPages;
  ngOnInit() {
    sessionStorage.getItem('cartUpdated');
    if (sessionStorage.getItem('cartUpdated') !== 'true') {    
    }
    this.helperService.getCartItems().subscribe(cartItems => {
        this.cartItems = cartItems;
    });
     this.SearchFromHome();
  }


  async SearchFromHome(){
    const loadingController = await this.helperService.createLoadingController("loading");
    await loadingController.present();    
    await this.categorySearchService.searchFromHome('SearchFromHome')
    .subscribe((data: any) => {
      loadingController.dismiss();
      this.homeResult=data.homeSearchResult;
      Object.assign(this.masterData,this.homeResult);    
    },
    (error: any) => {
      loadingController.dismiss();
    });
}

gethomeSearchResult(ev:any){
  const val = ev.target.value;

  if (val && val.trim() !== '' && val.length>=4) {
      this.isItemAvailable = true;
      this.masterData = this.homeResult.filter((item) => {
        if (item.address != null) {
          return item.address.toLowerCase().indexOf(val.toLowerCase()) > -1;
        }
      })
  } else {
      this.isItemAvailable = false;
  }
}

itemClick(data:any){
  if(data.type==='Product'){    
    this.iDataTransferBetweenPages = { storeId: Number(data.id),MerchantName:data.name};
     sessionStorage.removeItem("Key");
     sessionStorage.removeItem("DelCharge");
     sessionStorage.setItem("Key",data.razorPaymentKey);
    //  sessionStorage.setItem("DelCharge",data.deliveryCharges);
    this.helperService.navigateWithData(['/product-list'], this.iDataTransferBetweenPages);
    this.isItemAvailable=false;
  }
  else{
    this.iDataTransferBetweenPages = { serviceId: Number(data.id),serviceName:data.name};
    sessionStorage.removeItem("Key");
    sessionStorage.removeItem("DelCharge");
    sessionStorage.setItem("Key",data.razorPaymentKey);
    // sessionStorage.setItem("DelCharge",name.deliveryCharges);  
    this.helperService.navigateWithData(['service-list'], this.iDataTransferBetweenPages);
    this.isItemAvailable=false;
  }
}

  async getCartItemsList(){
    const loadingController = await this.helperService.createLoadingController("loading");
    await loadingController.present();
    const dataObject={UserId: Number(sessionStorage.getItem('UserId'))};
    await this.categorySearchService.getCartItems('UserCartItemsSelect', dataObject)
    .subscribe((data: any) => {
      loadingController.dismiss();
      let cartItemsData = data.cartItems;
      if (cartItemsData.serviceLocationId !== 0) {
        this.cartItems = cartItemsData.serviceCartItems;
        this.cartItems.forEach((item) => {
          item['itemCount'] = 1;
          item['addedToCart'] = true;
          item['locationID'] = cartItemsData.serviceLocationId;
        });
      }
      if (cartItemsData.storeId !== 0) {
        this.cartItems = cartItemsData.productCartItems;
        this.cartItems.forEach((item) => {
          item['itemCount'] = Number(item.quantity);
          item['addedToCart'] = true;
          item['storeID'] = cartItemsData.storeId;
        });
      }
      this.helperService.setCartItems(this.cartItems);
      sessionStorage.setItem('cartUpdated', 'false')

    },
    (error: any) => {
      loadingController.dismiss();
    });
}
  dismiss() {
    if(document.getElementById('searchModal')) {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  } else {
    return;
  }
  }
 navigateTo(ele) {
  this.dismiss();
   if(ele == 'product') {
    this.router.navigate(['/product-info']);
   } else {
    this.router.navigate(['/service-info']);
   }
 }
}
