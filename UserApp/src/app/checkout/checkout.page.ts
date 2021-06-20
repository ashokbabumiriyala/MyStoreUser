import { Component, OnInit } from '@angular/core';
import { HelperService } from '../common/helper.service';
import { CheckoutService } from '../checkout/checkout.service';
import { ToastController } from '@ionic/angular';
import { CategorySearchService } from '../category-search/category-search.service';
import { Router ,ActivatedRoute} from '@angular/router';

declare var RazorpayCheckout: any;
import {environment}  from '../../environments/environment';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
 defaultAddress:any;
 default:boolean = true;
 cartItems: any[] = [];
 subTotal :number=10;
 deliveryCharges = 50;

  constructor(private helperService:HelperService, private checkoutService: CheckoutService,
    private toastController: ToastController, 
    private categorySearchService: CategorySearchService,
     private router: Router,
     private route: ActivatedRoute,
  ) {}
  ngOnInit() {  
    this.defaultAddress = sessionStorage.getItem("UserAddress");
    this.helperService.getCartItems().subscribe(cartItems => {
      if(cartItems!=null){
        this.cartItems = cartItems;      
        //this.subTotal = 0;
        this.cartItems.forEach((item) =>{
         // this.subTotal = this.subTotal + (item.priceAfterDiscount * item.itemCount);
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
    if(addr.target.value != 'default') {
      this.default = false;
    } else {
      this.default = true;
    }
  }

  async payWithRazorMobileApp() {
    var options = {
      description: 'Online Shopping',
      image: '../assets/images/logo.png',
      currency: 'INR', // your 3 letter currency code
      key: environment.razorPaymentkey, // your Key Id from Razorpay dashboard
      amount: this.subTotal + '00',
      name: 'My3Karrt',
      prefill: {
        email:sessionStorage.getItem("Email"),
        contact:sessionStorage.getItem("MobileNumber"),
        name: sessionStorage.getItem("UserName"),
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



  }
  async insertOrderList(payment_id){   
    const loadingController = await this.helperService.createLoadingController("loading");
    await loadingController.present();
    const dataObject={UserId: Number(sessionStorage.getItem("UserId")), TransactionId: payment_id, 
     TotalAmount: String(10),
     DeliveryCharge: 5, 
     SubTotal : this.subTotal,transferId:sessionStorage.getItem("Key")};
     let apiName;
     debugger;
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

  RAZORPAY_OPTIONS = {
    "key": environment.razorPaymentkey,
    "amount": "",
    "name": "My3Karrt",
    "order_id": "",
    "description": "",
    "image": "",
    "prefill": {
      "name": "",
      "email": '',
      "contact":'',
      "method": ""
    },
    "modal": {},
    "theme": {
      "color": "#0096C5"
    }
  };

}
