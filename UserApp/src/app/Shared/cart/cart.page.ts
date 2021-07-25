import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { HelperService } from '../../common/helper.service';

import { CategorySearchService } from '../../category-search/category-search.service';
import { StorageService } from 'src/app/common/storage.service';
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
  disableCheckout: boolean = true;

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private helperService: HelperService,
    private categorySearchService: CategorySearchService,
    private storageService: StorageService
  ) {}
  ngOnInit() {
    this.loadCartItems();
  }
  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }
  increment(itm) {
    this.disableCheckout = false;
    var ind = this.cartItems.indexOf(itm);
    if (this.cartItems[ind].availableQty >= this.cartItems[ind].itemCount + 1) {
      this.cartItems[ind].itemCount++;
      this.helperService.setCartItems(this.cartItems);
    } else {
      this.helperService.presentToast(
        `Only ${this.cartItems[ind].availableQty} items are available in the stock`,
        'warning'
      );
    }
  }

  decrement(itm) {
    var ind = this.cartItems.indexOf(itm);
    if (this.cartItems[ind].itemCount > 1) {
      this.cartItems[ind].itemCount--;
      this.helperService.setCartItems(this.cartItems);
    } else {
      this.removeItem(itm);
    }
  }

  loadCartItems() {
    this.helperService.getCartItems().subscribe((cartItems) => {
      if (cartItems != null) {
        this.cartItems = cartItems;
        if (this.cartItems.length > 0) {
          this.disableCheckout = false;
        }

        this.isEmptyCart = false;
      } else {
        this.isEmptyCart = true;
      }
    });
  }
  removeItem(itm) {
    var ind = this.cartItems.indexOf(itm);
    this.cartItems.splice(ind, 1);
    if (this.cartItems.length == 0) {
      this.disableCheckout = true;
    }
    this.helperService.setCartItems(this.cartItems);
  }
  navigateTo(ele) {
    var route = '/' + ele;
    this.router.navigate([route]);
    this.dismiss();
  }
  async ionViewDidLeave() {
    if ((await this.storageService.get('cartUpdated')) == 'true') {
      (
        await this.categorySearchService.insertCartItems('UserCartItemsInsert')
      ).subscribe(
        async (data: any) => {
          await this.storageService.set('cartUpdated', 'false');
        },
        (error: any) => {}
      );
    }
  }
}
