import { Component, OnInit } from '@angular/core';
import { HelperService } from '../common/helper.service';
import { ProductListService } from '../product-list/product-list.service'
import { ActivatedRoute } from '@angular/router';
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
  constructor (private helperService: HelperService, private productListService: ProductListService,
    private route: ActivatedRoute) { }
  ngOnInit(){
    this.route.queryParams.subscribe(params => {
      this.merchantStoreId = JSON.parse(params.storeId);
    });
    this.getProductList();
    this.helperService.getCartItems().subscribe(cartItems => {
      if(cartItems!=null){
        this.cartItems = cartItems;
      }
    });
  }
  async getProductList(){
    const loadingController = await this.helperService.createLoadingController("loading");
    await loadingController.present();
    const dataObject={storeId:this.merchantStoreId};
    await this.productListService.getProductList('UserMerchantProdSelect', dataObject)
    .subscribe((data: any) => {
      console.log(data);
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
    // this.currentNumber--;
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
    if (this.productList[index].itemCount > 0 && !this.productList[index].addedToCart) {
      this.productList[index].addedToCart = true;
      this.cartItems.push(this.productList[index]);
    }
    this.helperService.setCartItems(this.cartItems);

  }
  

}
