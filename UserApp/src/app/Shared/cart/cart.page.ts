import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

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

  constructor(private modalCtrl: ModalController) { }
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
    this.cartItems[ind].count ++;
  }

  decrement(itm) {
    var ind = this.cartItems.indexOf(itm);
    if(this.cartItems[ind].count > 0) {
    this.cartItems[ind].count --;
    } else {
      this.cartItems[ind].count = 0;
    }
  }
  loadCartItems() {
    this.cartItems = [
      { name: 'Santoor', price: 30, count: 1, thumb: 'merchantProduct-1.jpeg' },
      { name: 'Lays', price: 50, count: 5, thumb: 'merchantProduct-2.jpeg' },
      { name: 'Biscuits', price: 50, count: 10, thumb: 'merchantProduct-3.jpeg' },
      { name: 'Ground Nuts', price: 100, count: 1, thumb: 'merchantProduct-4.jpeg' },
      { name: 'Oil', price: 150, count: 1, thumb: 'merchantProduct-5.jpeg' }
    ];
    this.isEmptyCart = false;
  }
  removeItem(itm) {
    var ind = this.cartItems.indexOf(itm);
    this.cartItems.splice(ind, 1);
  }
}
