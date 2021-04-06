import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
 defaultAddress:any;
 default:boolean = true;
 cartItems: any[] = [];
  constructor() { }

  ngOnInit() {
    this.defaultAddress = "JNTU, Hyderabad, Telangana, India-500038";
    this.cartItems = [
      { name: 'Santoor', price: 30, count: 1, thumb: 'merchantProduct-1.jpeg' },
      { name: 'Lays', price: 50, count: 5, thumb: 'merchantProduct-2.jpeg' },
      { name: 'Biscuits', price: 50, count: 10, thumb: 'merchantProduct-3.jpeg' },
      { name: 'Ground Nuts', price: 100, count: 1, thumb: 'merchantProduct-4.jpeg' },
      { name: 'Oil', price: 150, count: 1, thumb: 'merchantProduct-5.jpeg' }
    ];
  }
  removeItem(itm) {
    var ind = this.cartItems.indexOf(itm);
    this.cartItems.splice(ind, 1);
  }
  selectedAddr(addr) {
    console.log(addr);
    if(addr.target.value != 'default') {
      this.default = false;
    } else {
      this.default = true;
    }
  }
}
