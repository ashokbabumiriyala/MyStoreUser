import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage  {

  private currentNumber = 0;
  productList = [{productId: 1,
    productName: 'Santoor',
    units: 'Item',
    cost: 'Rs. 20',
    image: '../assets/images/dump/merchantProduct-1.jpeg',
    itemCount: 0
  },
  { productId: 2,
    productName: 'Lays',
    units: 'Item',
    cost: 'Rs. 10',
    image: '../assets/images/dump/merchantProduct-2.jpeg',
    itemCount: 0
  }];
  cartItems = [];
  constructor () { }

  increment (index) {
  // this.currentNumber++;
  this.productList[index].itemCount++;
  }

  decrement (index) {
    // this.currentNumber--;
    if (this.productList[index].itemCount > 0) {
      this.productList[index].itemCount--;
    }
    if(this.productList[index].itemCount == 0) {
      let idIndex = this.cartItems.findIndex(x => x.productId === this.productList[index].productId);
      this.cartItems.splice(idIndex, 1);
    }
  }
  addToCart(index){
    if (this.productList[index].itemCount > 0) {
      this.cartItems.push(this.productList[index]);
    }

  }
  

}
