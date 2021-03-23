import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage  {

  private currentNumber = 0;
  constructor () { }
  
  private increment () {
    this.currentNumber++;
  }
  
  private decrement () {
    this.currentNumber--;
}

}
