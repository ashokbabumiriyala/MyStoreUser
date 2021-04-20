import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-orders',
  templateUrl: './product-orders.page.html',
  styleUrls: ['./product-orders.page.scss'],
})
export class ProductOrdersPage implements OnInit {
  storeName:any = "Big Basket";
  orderedDate:any = new Date();
  orderId:any = 12345;
  deliveryStatus:any = 'On the way';
  orderedItems:any = [];
  constructor( private router: Router) { }

  ngOnInit() {
    this.orderedItems = [
      { name: 'Santoor', price: 30, count: 1, thumb: 'merchantProduct-1.jpeg',units: 'item'},
      { name: 'Lays', price: 50, count: 5, thumb: 'merchantProduct-2.jpeg',units: 'item' },
      { name: 'Biscuits', price: 50, count: 10, thumb: 'merchantProduct-3.jpeg',units: 'item' },
      { name: 'Ground Nuts', price: 100, count: 1, thumb: 'merchantProduct-4.jpeg',units: 'Kg' },
      { name: 'Oil', price: 150, count: 1, thumb: 'merchantProduct-5.jpeg',units: 'Ltrs' }
    ];
  }
  trackStatus() {
    this.router.navigate(['/service-orders']);
  }
}
