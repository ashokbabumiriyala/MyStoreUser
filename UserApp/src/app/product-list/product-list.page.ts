import { Component, OnInit } from '@angular/core';
import { HelperService } from '../common/helper.service';
import { ProductListService } from '../product-list/product-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { iDataTransferBetweenPages } from '../common/data-transfer-between-pages';
import { AlertController } from '@ionic/angular';
import { CategorySearchService } from '../category-search/category-search.service';
import { ModalController, AnimationController } from '@ionic/angular';
import { ViewModalComponent } from './view-modal/view-modal.component';
import { AvailableStoreTypes } from '../common/Enums';
import { StorageService } from '../common/storage.service';
import { VirtualFootFallService } from '../common/virtualfootfall.service';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  private currentNumber = 0;
  productList = [];
  cartItems = [];
  merchantStoreId: number;
  searchProduct: string = '';
  public masterData: any = [];
  merchantName: string;
  iDataTransferBetweenPages: iDataTransferBetweenPages;
  productSearchString: string;
  constructor(
    private helperService: HelperService,
    private productListService: ProductListService,
    private route: ActivatedRoute,
    private router: Router,
    public animationCtrl: AnimationController,
    public modalController: ModalController,
    private alertCtrl: AlertController,
    private categorySearchService: CategorySearchService,
    private storageService: StorageService,
    private virutalFootFallService: VirtualFootFallService
  ) { }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.iDataTransferBetweenPages = this.helperService.getPageData();
      this.merchantName = this.iDataTransferBetweenPages.MerchantName;
      this.productSearchString = this.iDataTransferBetweenPages.productSearchString;
    });

    this.getProductList();
    this.helperService.getCartItems().subscribe((cartItems) => {
      if (cartItems != null) {
        {
          this.masterData.forEach((product) => {
            var foundProduct = cartItems.find(
              (cartItem) => cartItem.productID == product.productID
            );
            if (foundProduct != null) {
              product.itemCount = foundProduct.itemCount;
              if (foundProduct.itemCount > 0) {
                product.cartStatus = 'Added to cart';
                product.addedToCart = true;
              } else {
                product.cartStatus = '';
                product.addedToCart = false;
              }
            } else {
              product.cartStatus = '';
              product.addedToCart = false;
              product.itemCount = 0;
            }
          });
          this.cartItems = cartItems;
        }
      }
    });
  }

  filterItems() {
    this.masterData = this.productList.filter((item) => {
      return (
        item.productName
          .toLowerCase()
          .indexOf(this.searchProduct.toLowerCase()) > -1
      );
    });
  }

  navigateTo(ele) {
    var route = '/' + ele;
    this.router.navigate([route]);
  }

  async getProductList() {
    if (this.iDataTransferBetweenPages != null) {
      const loadingController =
        await this.helperService.createLoadingController('loading');
      await loadingController.present();
      const dataObject = { storeId: this.iDataTransferBetweenPages.storeId };
      await this.productListService
        .getProductList('UserMerchantProdSelect', dataObject)
        .subscribe(
          (data: any) => {
            if (data != null && data.provideMerchantProdList != null) {
              this.productList = data.provideMerchantProdList.sort((x, y) => { return x.productName.trim().toLowerCase() == this.productSearchString.trim().toLowerCase() ? -1 : y.productName.trim().toLowerCase() == this.productSearchString.trim().toLowerCase() ? 1 : 0; });
              Object.assign(this.masterData, this.productList);
              this.masterData.forEach((product) => {
                console.log(product);
                product['isAvailable'] = Number(product.availableQty) > 0;
                product['itemCount'] = 0;
                product['addedToCart'] = false;
                this.cartItems.forEach((item) => {
                  if (item.productID == product.productID) {
                    product['addedToCart'] = true;
                    product['itemCount'] = item.itemCount;
                  }
                });
              });
            }
            loadingController.dismiss();
          },
          (error: any) => {
            loadingController.dismiss();
          }
        );
    }
  }

  increment(index) {
    if (Number(this.masterData[index].availableQty) > 0) {
      // this.currentNumber++;
      this.masterData[index].itemCount++;
      if (this.masterData[index].addedToCart) {
        let idIndex = this.cartItems.findIndex(
          (x) => x.productID === this.masterData[index].productID
        );
        this.cartItems[idIndex].itemCount = this.masterData[index].itemCount;
        this.helperService.setCartItems(this.cartItems);
      }
    }
  }

  decrement(index) {
    if (Number(this.masterData[index].availableQty) > 0) {
      if (this.masterData[index].itemCount > 0) {
        this.masterData[index].itemCount--;
      }
      if (this.masterData[index].itemCount == 0) {
        let idIndex = this.cartItems.findIndex(
          (x) => x.productID === this.masterData[index].productID
        );
        this.masterData[index].addedToCart = false;
        this.cartItems.splice(idIndex, 1);
        this.helperService.setCartItems(this.cartItems);
        this.masterData[index].cartStatus = '';
      }
    }
  }

  async addToCart(index) {
    try {
      this.virutalFootFallService
        .updateProductDataClicks(
          Number(await this.storageService.get('UserId')),
          Number(this.masterData[index].productID)
        )
        .subscribe(() => { });
    } catch (err) { }

    if (
      this.cartItems.length == 0 ||
      (this.cartItems.length > 0 &&
        this.cartItems[0].storeID == this.masterData[index].storeID)
    ) {
      if (
        Number(this.masterData[index].availableQty) <
        this.masterData[index].itemCount
      ) {
        this.helperService.presentToast(
          `Only ${this.masterData[index].availableQty} items are available in the stock`,
          'warning'
        );
      } else {
        if (this.masterData[index].itemCount > 0) {
          var addedProduct = this.cartItems.find(
            (o) => o.productID === this.masterData[index].productID
          );
          if (addedProduct != null) {
            addedProduct.itemCount = this.masterData[index].itemCount;
          } else {
            this.cartItems.push(this.masterData[index]);
            this.masterData[index].cartStatus = 'Added to cart';
          }
        } else {
          this.masterData[index].itemCount = 1;
          this.cartItems.push(this.masterData[index]);
          this.masterData[index].cartStatus = 'Added to cart';
        }
        this.helperService.setCartItemsType(AvailableStoreTypes.ProductType);
        this.helperService.setStoreLocationDetails(this.cartItems[0].storeID);
        this.helperService.setCartItems(this.cartItems);
      }
    } else {
      if (this.masterData[index].itemCount == 0) {
        this.masterData[index].itemCount = 1;
      }
      this.showCartClearAlert(index);
    }
  }

  showCartClearAlert(index) {
    const prompt = this.alertCtrl
      .create({
        header: 'Items already in Cart',
        message:
          'Your cart contains items from a different provider. Would you like to reset your cart?',
        buttons: [
          {
            text: 'Yes',
            handler: (data) => {
              this.cartItems = [];
              this.masterData[index].addedToCart = true;
              this.cartItems.push(this.masterData[index]);
              this.helperService.setCartItems(this.cartItems);
              this.helperService.setCartItemsType(
                AvailableStoreTypes.ProductType
              );
              this.helperService.setStoreLocationDetails(this.cartItems[0].storeID);
            },
          },
          {
            text: 'No',
            handler: (data) => { },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
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

  async presentViewModal(product) {
    try {
      this.virutalFootFallService
        .updateProductDataClicks(
          Number(await this.storageService.get('UserId')),
          Number(product.productID)
        )
        .subscribe(() => { });
    } catch (err) { }
    const enterAnimation = (baseEl: any) => {
      const backdropAnimation = this.animationCtrl
        .create()
        // .beforeStyles({ 'opacity': 1,'height': '83%','width': 'auto','min-width': '96vw','margin-top': '16%'})
        .addElement(baseEl.querySelector('ion-backdrop')!)
        .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

      const wrapperAnimation = this.animationCtrl
        .create()
        .beforeStyles({
          opacity: 1,
          height: '83%',
          width: 'auto',
          'min-width': '96vw',
          'margin-top': '6%',
        })
        .addElement(baseEl.querySelector('.modal-wrapper')!)
        .fromTo('transform', 'scale(0)', 'scale(1)');

      return this.animationCtrl
        .create()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(400)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    };

    const leaveAnimation = (baseEl: any) => {
      return enterAnimation(baseEl).direction('reverse');
    };

    const modal = await this.modalController.create({
      component: ViewModalComponent,
      componentProps: { productData: product },
      enterAnimation,
      leaveAnimation,
    });
    return await modal.present();
  }
}
