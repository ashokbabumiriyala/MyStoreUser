import { Component, OnInit } from '@angular/core';
import { HelperService } from '../common/helper.service';
import { CheckoutService } from '../checkout/checkout.service';
import { ToastController } from '@ionic/angular';
import { CategorySearchService } from '../category-search/category-search.service';
import { Router } from '@angular/router';
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
 subTotal = 0;
 deliveryCharges = 50;
  constructor(private helperService:HelperService, private checkoutService: CheckoutService,
    private toastController: ToastController, private categorySearchService: CategorySearchService,
     private router: Router) { }
  ngOnInit() {
    this.defaultAddress = "JNTU, Hyderabad, Telangana, India-500038";
    this.helperService.getCartItems().subscribe(cartItems => {
      if(cartItems!=null){
        this.cartItems = cartItems;
        console.log(this.cartItems);
        this.subTotal = 0;
        this.cartItems.forEach((item) =>{
          this.subTotal = this.subTotal + (item.priceAfterDiscount * item.itemCount);
        });
      }
    });
  }
  removeItem(item) {
    var ind = this.cartItems.indexOf(item);
    this.cartItems.splice(ind, 1);
    this.helperService.setCartItems(this.cartItems);
  }
  selectedAddr(addr) {
    console.log(addr);
    if(addr.target.value != 'default') {
      this.default = false;
    } else {
      this.default = true;
    }
  }

  async payWithRazorMobileApp() {
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
    var successCallback = (payment_id) =>{
      this.insertOrderList(payment_id);
    }

    var cancelCallback = (error) => {
      alert(error.description + ' (Error ' + error.code + ')');
    };

   await RazorpayCheckout.open(options, successCallback, cancelCallback);
  //  this.insertOrderList('hgdsjhsgh');
  }
  async insertOrderList(payment_id){
    const loadingController = await this.helperService.createLoadingController("loading");
    await loadingController.present();
    const dataObject={UserId: Number(sessionStorage.getItem("UserId")), TransactionId: payment_id, TotalAmount: String(this.subTotal + this.deliveryCharges),
     DeliveryCharge: this.deliveryCharges, SubTotal : this.subTotal};
     let apiName;
     if (this.cartItems[0].storeID) {
      apiName = 'UserProductOrderInsert';
      dataObject['StoreId'] = this.cartItems[0].storeID;
      dataObject['OrderItems'] = [];
      this.cartItems.forEach(item => {
        let data = {ProductID: item.productID,
          ProductName: item.productName,
          Quantity : String(item.itemCount),
          Units: item.units,
          PriceAfterDiscount : item.priceAfterDiscount,
          DiscountType: item.discountType,
          Discount : item.discount,
          PriceBeforeDiscount : item.priceBeforeDiscount
        };
        dataObject['OrderItems'].push(data)
      })
     } else if (this.cartItems[0].locationID){
      apiName = 'UserServiceOrderInsert';
      dataObject['ServiceLocationId'] = this.cartItems[0].locationID;
      dataObject['OrderItems'] = [];
      this.cartItems.forEach(item => {
        let data = {ServiceId : item.serviceId,
          BusinessName : item.businessName ,
          PriceAfterDiscount : item.priceAfterDiscount,
          DiscountType: item.discountType,
          Discount : item.discount,
          PriceBeforeDiscount : item.priceBeforeDiscount
        };
        dataObject['OrderItems'].push(data)
     });
    }
    await this.checkoutService.insertOrderList(apiName, dataObject)
    .subscribe((data: any) => {
      console.log(data);
      this.cartItems = [];
      this.helperService.setCartItems(this.cartItems);
      sessionStorage.setItem('cartUpdated', 'false');
      let orderId = data.operationStatusDTO.orderId;
      this.presentToast('your order is placed successfully. Order Id is ' + orderId,"success");
      loadingController.dismiss();
       this.router.navigate(['/category-search'], {replaceUrl: true});
    },
    (error: any) => {
      this.presentToast(error,"danger");
      loadingController.dismiss();
    });
  }
  async presentToast(data: string,tostarColor:string) {
    const toast = await this.toastController.create({
      message: data,
      duration: 2000,
      position: 'bottom',
      color: tostarColor
    });
    toast.present();
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
