import { Component, OnInit } from '@angular/core';
import { HelperService } from '../common/helper.service';
import { ProductListService } from '../product-list/product-list.service';
import { ActivatedRoute } from '@angular/router';
import {iDataTransferBetweenPages}  from '../common/data-transfer-between-pages';
import { AlertController } from '@ionic/angular';
import { CategorySearchService } from '../category-search/category-search.service';
import { ModalController, AnimationController } from '@ionic/angular';
import { ViewModalComponent } from './view-modal/view-modal.component';

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
  searchProduct: string = "";
  public masterData:any = [];
  merchantName:string;
  iDataTransferBetweenPages:iDataTransferBetweenPages;
  constructor (private helperService: HelperService, private productListService: ProductListService,
    private route: ActivatedRoute, public animationCtrl: AnimationController, public modalController: ModalController, private alertCtrl: AlertController, private categorySearchService: CategorySearchService) { }
  ngOnInit(){  
    this.route.queryParams.subscribe(params => {
      this.iDataTransferBetweenPages = this.helperService.getPageData();
      this.merchantName= this.iDataTransferBetweenPages.MerchantName;
    });

    this.getProductList();
    this.helperService.getCartItems().subscribe(cartItems => {
      if(cartItems!=null){
        this.cartItems = cartItems;
      }
    });
  }

  filterItems() {
    this.masterData = this.productList.filter(item => {
      return item.productName.toLowerCase().indexOf(this.searchProduct.toLowerCase()) > -1;
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
      Object.assign(this.masterData,this.productList);       
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
      this.productList[index].cartStatus='';
    }
  }
  addToCart(index){
    if(this.cartItems.length == 0 ||
      (this.cartItems.length > 0 && this.cartItems[0].storeID == this.productList[index].storeID)) {
        if (this.productList[index].itemCount > 0 && !this.productList[index].addedToCart) {
          this.productList[index].addedToCart = true;
          debugger;
          this.cartItems.push(this.productList[index]);
          this.productList[index].cartStatus="Added to cart";
        }
        this.helperService.setCartItems(this.cartItems);
    } else {
      this.showCartClearAlert(index);
    }
  }
  showCartClearAlert(index) {
    const prompt = this.alertCtrl.create({
      header: 'Items already in Cart',
      message: "Your cart contains items from a different provider. Would you like to reset your cart?",
      buttons: [        
        {
          text: 'Yes',
          handler: data => {          
            this.cartItems = [];
            this.productList[index].addedToCart = true;
            this.cartItems.push(this.productList[index]);
            this.helperService.setCartItems(this.cartItems);
          }
        },
        {
          text: 'No',
          handler: data => {
           
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
 
  async presentViewModal() {
    const enterAnimation = (baseEl: any) => {
      const backdropAnimation = this.animationCtrl.create()
        // .beforeStyles({ 'opacity': 1,'height': '83%','width': 'auto','min-width': '96vw','margin-top': '16%'})
        .addElement(baseEl.querySelector('ion-backdrop')!)
        .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

      const wrapperAnimation = this.animationCtrl.create()
        .beforeStyles({ 'opacity': 1,'height': '83%','width': 'auto','min-width': '96vw','margin-top': '6%'})
        .addElement(baseEl.querySelector('.modal-wrapper')!)
        .fromTo('transform', 'scale(0)', 'scale(1)');

      return this.animationCtrl.create()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(400)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    }

    const leaveAnimation = (baseEl: any) => {
      return enterAnimation(baseEl).direction('reverse');
    }

    const modal = await this.modalController.create({
      component: ViewModalComponent,
      componentProps: {"model_title": 'check'},
      enterAnimation,
      leaveAnimation
    });
    return await modal.present();
  }

}
