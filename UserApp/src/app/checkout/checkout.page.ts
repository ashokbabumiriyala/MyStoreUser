import { Component, OnInit } from '@angular/core';
declare var RazorpayCheckout: any;
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
      { name: 'Santoor', price: 30, count: 1, thumb: 'merchantProduct-1.jpeg',units: 'item'},
      { name: 'Lays', price: 50, count: 5, thumb: 'merchantProduct-2.jpeg',units: 'item' },
      { name: 'Biscuits', price: 50, count: 10, thumb: 'merchantProduct-3.jpeg',units: 'item' },
      { name: 'Ground Nuts', price: 100, count: 1, thumb: 'merchantProduct-4.jpeg',units: 'Kg' },
      { name: 'Oil', price: 150, count: 1, thumb: 'merchantProduct-5.jpeg',units: 'Ltrs' }
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

  payWithRazorMobileApp() {
    var options = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR', // your 3 letter currency code
      key: 'rzp_test_UTCzslKTfAlqNW', // your Key Id from Razorpay dashboard
      amount: 500, // Payment amount in smallest denomiation e.g. cents for USD
      name: 'My3Karrt',
      prefill: {
        email: 'ashok.miriyala',
        contact: '8106939983',
        name: 'Enappd'
      },
      theme: {
        color: '#F37254'
      },
      modal: {
        ondismiss: function () {
          alert('dismissed')
        }
      }
    };

    var successCallback = function (payment_id) {
      alert('payment_id: ' + payment_id);
    };

    var cancelCallback = function (error) {
      alert(error.description + ' (Error ' + error.code + ')');
    };

    RazorpayCheckout.open(options, successCallback, cancelCallback);
  }
  
}
