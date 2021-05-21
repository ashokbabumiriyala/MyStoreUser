import { Component, OnInit } from '@angular/core';
import { HelperService } from '../common/helper.service';
import { ProductListService } from '../product-list/product-list.service';
import { ActivatedRoute } from '@angular/router';
import {iDataTransferBetweenPages}  from '../common/data-transfer-between-pages';
import { AlertController } from '@ionic/angular';
import { CategorySearchService } from '../category-search/category-search.service';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage  implements OnInit{

  private currentNumber = 0;
  productList = [];
  cartItems = [];
  merchantStoreId:number;
  iDataTransferBetweenPages:iDataTransferBetweenPages;
  constructor (private helperService: HelperService, private productListService: ProductListService,
    private route: ActivatedRoute, private alertCtrl: AlertController, private categorySearchService: CategorySearchService) { }
  ngOnInit(){
    // this.route.queryParams.subscribe(params => {
    //   this.merchantStoreId = JSON.parse(params.storeId);
    // });
    this.route.queryParams.subscribe(params => {
      this.iDataTransferBetweenPages = this.helperService.getPageData();
    });

    this.getProductList();
    this.helperService.getCartItems().subscribe(cartItems => {
      if(cartItems!=null){
        this.cartItems = cartItems;
      }
    });
  }
  async getProductList(){
    if (this.iDataTransferBetweenPages != null) {
       const loadingController = await this.helperService.createLoadingController("loading");
    await loadingController.present();
    const dataObject={storeId:this.iDataTransferBetweenPages.storeId};
    await this.productListService.getProductList('UserMerchantProdSelect', dataObject)
    .subscribe((data: any) => {
      this.productList = data.provideMerchantProdList;
      this.productList.forEach((product)=>{
        product['itemCount'] = 0;
        product['addedToCart'] = false;
        this.cartItems.forEach(item => {
          if (item.productID == product.productID) {
            product['addedToCart'] = true;
            product['itemCount'] = item.itemCount;
          }
        })
      })
      loadingController.dismiss();
    },
    (error: any) => {
      loadingController.dismiss();
    });
  }
}

  increment (index) {
  // this.currentNumber++;
  this.productList[index].itemCount++;
  if (this.productList[index].addedToCart) {
    let idIndex = this.cartItems.findIndex(x => x.productID === this.productList[index].productID);
      this.cartItems[idIndex].itemCount = this.productList[index].itemCount
      this.helperService.setCartItems(this.cartItems);
  }

  }

  decrement (index) {
    if (this.productList[index].itemCount > 0) {
      this.productList[index].itemCount--;
    }
    if(this.productList[index].itemCount == 0) {
      let idIndex = this.cartItems.findIndex(x => x.productID === this.productList[index].productID);
      this.productList[index].addedToCart = false;
      this.cartItems.splice(idIndex, 1);
      this.helperService.setCartItems(this.cartItems);
    }
  }
  addToCart(index){
    if(this.cartItems.length == 0 ||
      (this.cartItems.length > 0 && this.cartItems[0].storeID == this.productList[index].storeID)) {
        if (this.productList[index].itemCount > 0 && !this.productList[index].addedToCart) {
          this.productList[index].addedToCart = true;
          this.cartItems.push(this.productList[index]);
        }
        this.helperService.setCartItems(this.cartItems);
    } else {
      this.showCartClearAlert(index);
    }
  }
  showCartClearAlert(index) {
    const prompt = this.alertCtrl.create({
      header: 'Alert',
      message: "Do you want to clear cart items?",
      buttons: [
        {
          text: 'No',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: data => {
            console.log('Saved clicked');
            this.cartItems = [];
            this.productList[index].addedToCart = true;
            this.cartItems.push(this.productList[index]);
            this.helperService.setCartItems(this.cartItems);
          }
        }
      ]
    }).then(res => {

      res.present();

    });
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
