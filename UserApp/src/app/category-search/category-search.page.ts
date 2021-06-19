import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { HelperService } from '../common/helper.service';
import { CategorySearchService } from '../category-search/category-search.service';

@Component({
  selector: 'app-category-search',
  templateUrl: './category-search.page.html',
  styleUrls: ['./category-search.page.scss'],
})
export class CategorySearchPage implements OnInit {

  constructor(private router:Router, private modalCtrl: ModalController,
    private helperService: HelperService, private categorySearchService: CategorySearchService) { }
    cartItems =[];
  ngOnInit() {
    sessionStorage.getItem('cartUpdated');
    if (sessionStorage.getItem('cartUpdated') !== 'true') {
      //this.getCartItemsList();
    }
    this.helperService.getCartItems().subscribe(cartItems => {
        this.cartItems = cartItems;
    });
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
