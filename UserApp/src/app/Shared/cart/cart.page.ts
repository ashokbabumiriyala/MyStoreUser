import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { HelperService } from '../../common/helper.service';

import { CategorySearchService } from '../../category-search/category-search.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  currentNumber = 0;
  cartItems: any[] = [];
  totalAmount: number = 0;
  isCartItemLoaded: boolean = false;
  isEmptyCart: boolean = true;

  constructor(private modalCtrl: ModalController, private router: Router, private helperService: HelperService,
     private categorySearchService: CategorySearchService) { }
  ngOnInit() {
    this.loadCartItems();
  }
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
  increment(itm) {
    var ind = this.cartItems.indexOf(itm);
    this.cartItems[ind].itemCount ++;
    this.helperService.setCartItems(this.cartItems);
  }

  decrement(itm) {
    var ind = this.cartItems.indexOf(itm);
    if(this.cartItems[ind].itemCount > 0) {
    this.cartItems[ind].itemCount --;
    this.helperService.setCartItems(this.cartItems);
    } else {
      this.removeItem(itm);
    }
  }

  loadCartItems() {
    this.helperService.getCartItems().subscribe(cartItems => {
      if(cartItems!=null){
        this.cartItems = cartItems;
       
        this.isEmptyCart = false;
      } else {
        this.isEmptyCart = true;
      }
    });

  }
  removeItem(itm) {
    var ind = this.cartItems.indexOf(itm);
    this.cartItems.splice(ind, 1);
    this.helperService.setCartItems(this.cartItems);
  }
  navigateTo(ele) {
    var route = '/'+ele;
    this.router.navigate([route]);
    this.dismiss();
  }
  async ionViewDidLeave () {
    if (sessionStorage.getItem('cartUpdated') == 'true'){
      await this.categorySearchService.insertCartItems('UserCartItemsInsert')
      .subscribe((data: any) => {
        sessionStorage.setItem('cartUpdated', 'false');
      },
      (error: any) => {
      });
    }
  }
}
