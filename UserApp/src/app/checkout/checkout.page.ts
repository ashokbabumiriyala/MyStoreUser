import { Component, OnInit } from '@angular/core';
import { HelperService } from '../common/helper.service';
import { CheckoutService } from '../checkout/checkout.service';
import { ToastController } from '@ionic/angular';
import { CategorySearchService } from '../category-search/category-search.service';
import { Router, ActivatedRoute } from '@angular/router';
declare var RazorpayCheckout: any;
import { environment } from '../../environments/environment';
import { AvailableStoreTypes } from '../common/Enums';
import { ɵangular_packages_platform_browser_dynamic_testing_testing_a } from '@angular/platform-browser-dynamic/testing';
import { ProductInfoService } from '../product-info/product-info.service';
import { CommonApiServiceCallsService } from '../Shared/common-api-service-calls.service';
import { StorageService } from '../common/storage.service';

enum DeliveryType {
  HomeDelivery = 0,
  SelfPickup = 1,
}
enum PaymentType {
  OnlinePayment = 0,
  CashOnDelivery = 1,
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  defaultAddress: any;
  defaultAddressId: number;
  default: boolean = true;
  cartItems: any[] = [];
  subTotal: number = 0;
  deliveryCharges = 0;
  processingFee: number = 0;
  deliveryType: string;
  paymentType: string;
  isServiceType: boolean = false;
  storeOrServiceName: string;
  storeOrServiceAddress: string;
  isValidAmount: boolean = true;
  storeOrServiceLocationId: string;
  constructor(
    private helperService: HelperService,
    private checkoutService: CheckoutService,
    private toastController: ToastController,
    private categorySearchService: CategorySearchService,
    private router: Router,
    private route: ActivatedRoute,
    private productInfoService: ProductInfoService,
    private commonApiServiceCallsService: CommonApiServiceCallsService,
    private storageService: StorageService
  ) { }

  async ngOnInit(): Promise<void> {
    this.deliveryType = DeliveryType.HomeDelivery.toString();
    this.paymentType = PaymentType.OnlinePayment.toString();
    this.deliveryCharges = Number(await this.storageService.get('DelCharge'));

    this.helperService.getCartItemsType().subscribe((currentCartItemType) => {
      if (currentCartItemType == AvailableStoreTypes.ServiceType) {
        this.isServiceType = true;
        this.deliveryType = DeliveryType.HomeDelivery.toString(); // for services it is always home delivery
      } else {
        this.isServiceType = false;
      }
    });

    this.helperService.getStoreLocationDetails().subscribe((storeDetails) => {
      this.storeOrServiceLocationId = storeDetails;
    });

    this.helperService
      .getDeliveryAddress()
      .subscribe(async (currentAddress) => {
        if (currentAddress != null) {
          this.defaultAddress = currentAddress.address;
          this.defaultAddressId = currentAddress.id;
          var calAddressObj = {
            storeId: this.storeOrServiceLocationId,
            latitude: currentAddress.latitude,
            longitude: currentAddress.longitude,
          };
          const loadingController =
            await this.helperService.createLoadingController('loading');
          await loadingController.present();

          await this.productInfoService
            .getCalculateDistance('CalculateDistance', calAddressObj)
            .subscribe(
              (data: any) => {
                if (data != null) {
                  this.deliveryCharges = data.deliveryCharges;
                }
                console.log(data);
                loadingController.dismiss();
              },
              (error: any) => {
                loadingController.dismiss();
              }
            );
        } else {
          this.getUserCheckOutAddress();
        }
      });

    this.helperService.getCartItems().subscribe((cartItems) => {
      if (cartItems != null) {
        this.cartItems = cartItems;
        this.subTotal = 0;
        this.cartItems.forEach((item) => {
          this.subTotal =
            this.subTotal + item.priceAfterDiscount * item.itemCount;
        });
        if (this.subTotal > 0) {
          this.processingFee = Math.round(
            ((this.subTotal + this.deliveryCharges) / 100) * 2.4
          );
        }
      }
      if (this.subTotal <= 0) {
        this.isValidAmount = false;
        this.processingFee = 0;
      }
    });
    if (this.subTotal <= 0) {
      this.isValidAmount = false;
      this.processingFee = 0;
    }

    if (this.isServiceType == true) {
      this.checkoutService
        .getStoreDetails(
          'GetProviderServiceLocation',
          Number(this.storeOrServiceLocationId)
        )
        .subscribe(
          (data: any) => {
            if (data != null && data.locationDetails != null) {
              this.storeOrServiceName =
                data.locationDetails.businessName != undefined
                  ? data.locationDetails.businessName
                  : '';
              this.storeOrServiceAddress =
                (data.locationDetails.address != undefined
                  ? data.locationDetails.address
                  : '') +
                ',' +
                (data.locationDetails.city != undefined
                  ? data.locationDetails.city
                  : '') +
                ',' +
                (data.locationDetails.state != undefined
                  ? data.locationDetails.state
                  : '') +
                ',' +
                (data.locationDetails.pinCode != undefined
                  ? data.locationDetails.pinCode
                  : '') +
                (data.locationDetails.landMark != undefined
                  ? ', Landmark: ' + data.locationDetails.landMark
                  : '');
            }
          },
          (error: any) => { }
        );
    } else {
      this.checkoutService
        .getStoreDetails(
          'GetProviderStoreLocation',
          Number(this.storeOrServiceLocationId)
        )
        .subscribe(
          async (data: any) => {
            if (data != null && data.locationDetails != null) {
              this.storeOrServiceName =
                data.locationDetails.businessName != undefined
                  ? data.locationDetails.businessName
                  : '';
              this.storeOrServiceAddress =
                (data.locationDetails.address != undefined
                  ? data.locationDetails.address
                  : '') +
                ',' +
                (data.locationDetails.city != undefined
                  ? data.locationDetails.city
                  : '') +
                ',' +
                (data.locationDetails.state != undefined
                  ? data.locationDetails.state
                  : '') +
                ',' +
                (data.locationDetails.pinCode != undefined
                  ? data.locationDetails.pinCode
                  : '') +
                (data.locationDetails.landMark != undefined
                  ? ', Landmark: ' + data.locationDetails.landMark
                  : '');
            }
          },
          (error: any) => { }
        );
    }
  }
  onDeliveryTypeChange() {
    if (this.deliveryType == DeliveryType.HomeDelivery.toString()) {
      if (this.subTotal > 0) {
        this.processingFee = Math.round(
          ((this.subTotal + this.deliveryCharges) / 100) * 2.4
        );
      }
    } else if (this.deliveryType == DeliveryType.SelfPickup.toString()) {
      if (this.subTotal > 0) {
        this.processingFee = Math.round((this.subTotal / 100) * 2.4);
      }
    }
  }

  async getUserCheckOutAddress() {
    const dataObj = { UserId: Number(await this.storageService.get('UserId')) };
    await this.checkoutService
      .insertOrderList('GetUserCheckOutAddress', dataObj)
      .subscribe(
        async (data: any) => {
          this.defaultAddress = data.checkoutAddress[0].address;
          this.defaultAddressId = data.checkoutAddress[0].id;
          console.log(this.defaultAddress, this.defaultAddressId);
          var calAddressObj = {
            storeId: this.storeOrServiceLocationId,
            latitude: data.checkoutAddress[0].latitude,
            longitude: data.checkoutAddress[0].longitude,
          };
          const loadingController =
            await this.helperService.createLoadingController('loading');
          await loadingController.present();

          await this.commonApiServiceCallsService
            .select(
              environment.userOperationServiceUrl + 'CalculateDistance',
              calAddressObj
            )
            .subscribe(
              (data: any) => {
                if (data != null) {
                  this.deliveryCharges = data.deliveryCharges;
                  if (this.subTotal > 0) {
                    this.processingFee = Math.round(
                      ((this.subTotal + this.deliveryCharges) / 100) * 2.4
                    );
                  }
                }
                console.log(data);
                loadingController.dismiss();
              },
              (error: any) => {
                loadingController.dismiss();
              }
            );
        },
        (error: any) => { }
      );
  }

  removeItem(item) {
    var ind = this.cartItems.indexOf(item);
    this.cartItems.splice(ind, 1);
    this.helperService.setCartItems(this.cartItems);
    if (this.cartItems.length == 0) {
      this.deliveryCharges = 0;
    }
  }

  selectedAddr(addr) {
    if (addr.target.value != 'default') {
      this.default = false;
    } else {
      this.default = true;
    }
  }
  async payWithRazorMobileApp() {
    var options = {
      description: 'Online Shopping',
      image: '../../assets/images/logo.png',
      currency: 'INR', // your 3 letter currency code
      key: environment.razorPaymentkey, // your Key Id from Razorpay dashboard
      amount:
        (this.deliveryType == DeliveryType.HomeDelivery.toString()
          ? this.deliveryCharges
          : 0) +
        this.subTotal +
        this.processingFee +
        '00',
      name: 'My3Karrt',
      prefill: {
        email: await this.storageService.get('Email'),
        contact: await this.storageService.get('MobileNumber'),
        name: await this.storageService.get('UserName'),
      },
      theme: {
        color: '#F37254',
      },
      modal: {
        ondismiss: function () { },
      },
    };
    var successCallback = (payment_id) => {
      this.insertOrderList(payment_id);
    };
    var cancelCallback = (error) => { };
    await RazorpayCheckout.open(options, successCallback, cancelCallback);
  }
  async makeAnOrder() {
    this.insertOrderList(null);
  }
  async insertOrderList(payment_id = null) {
    var amount =
      this.subTotal +
      (this.deliveryType == DeliveryType.SelfPickup.toString()
        ? 0
        : this.deliveryCharges) +
      this.processingFee;
    const loadingController = await this.helperService.createLoadingController(
      'loading'
    );
    await loadingController.present();
    const dataObject = {
      UserId: Number(await this.storageService.get('UserId')),
      TransactionId: payment_id,
      TotalAmount: amount.toString(),
      DeliveryCharge: this.deliveryType == DeliveryType.SelfPickup.toString()
        ? 0
        : this.deliveryCharges,
      SubTotal: this.subTotal,
      SellerKey: await this.storageService.get('Key'),
      ProcessingFee: Number(this.processingFee),
      DeliveryAddressId: Number(this.defaultAddressId),
      PaymentType:
        this.paymentType == PaymentType.CashOnDelivery.toString() ? 1 : 0,
      DeliveryType:
        this.deliveryType == DeliveryType.SelfPickup.toString() ? 1 : 0,
    };
    let apiName;
    if (this.cartItems[0].storeID) {
      apiName = 'UserProductOrderInsert';
      dataObject['StoreId'] = this.cartItems[0].storeID;
      dataObject['OrderItems'] = [];
      this.cartItems.forEach((item) => {
        let data = {
          ProductID: item.productID,
          ProductName: item.productName,
          Quantity: String(item.itemCount),
          Units: item.units,
          PriceAfterDiscount: item.priceAfterDiscount,
          DiscountType: item.discountType,
          Discount: item.discount,
          PriceBeforeDiscount: item.priceBeforeDiscount,
        };
        dataObject['OrderItems'].push(data);
      });
    } else if (this.cartItems[0].locationID) {
      apiName = 'UserServiceOrderInsert';
      dataObject['ServiceLocationId'] = this.cartItems[0].locationID;
      dataObject['OrderItems'] = [];
      this.cartItems.forEach((item) => {
        let data = {
          ServiceId: item.serviceId,
          BusinessName: item.businessName,
          PriceAfterDiscount: item.priceAfterDiscount,
          DiscountType: item.discountType,
          Discount: item.discount,
          PriceBeforeDiscount: item.priceBeforeDiscount,
        };
        dataObject['OrderItems'].push(data);
      });
    }
    await this.checkoutService.insertOrderList(apiName, dataObject).subscribe(
      async (data: any) => {
        this.cartItems = [];
        this.helperService.setCartItems(this.cartItems);
        await this.storageService.set('cartUpdated', 'false');
        let orderId = data.operationStatusDTO.orderId;
        this.presentToast(
          'your order is placed successfully. Order Id is ' + orderId,
          'success'
        );
        loadingController.dismiss();
        this.router.navigate(['/category-search'], { replaceUrl: true });
      },
      (error: any) => {
        this.presentToast(error, 'danger');
        loadingController.dismiss();
      }
    );
  }
  async presentToast(data: string, tostarColor: string) {
    const toast = await this.toastController.create({
      message: data,
      duration: 2000,
      position: 'bottom',
      color: tostarColor,
    });
    toast.present();
  }
  async ionViewDidLeave() {
    if ((await this.storageService.get('cartUpdated')) == 'true') {
      (
        await this.categorySearchService.insertCartItems('UserCartItemsInsert')
      ).subscribe(
        async (data: any) => {
          await this.storageService.set('cartUpdated', 'false');
        },
        (error: any) => { }
      );
    }
  }

  RAZORPAY_OPTIONS = {
    key: environment.razorPaymentkey,
    amount: '',
    name: 'My3Karrt',
    order_id: '',
    description: '',
    image: '',
    prefill: {
      name: '',
      email: '',
      contact: '',
      method: '',
    },
    modal: {},
    theme: {
      color: '#0096C5',
    },
  };
}
