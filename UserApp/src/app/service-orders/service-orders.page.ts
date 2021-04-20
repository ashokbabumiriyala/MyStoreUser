import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-orders',
  templateUrl: './service-orders.page.html',
  styleUrls: ['./service-orders.page.scss'],
})
export class ServiceOrdersPage implements OnInit {
  storeName:any = "Plumber";
  orderedDate:any = new Date();
  orderId:any = 12345;
  deliveryStatus:any = 'Completed';
  orderedItems:any = [];
  constructor( private router: Router) { }

  ngOnInit() {
    this.orderedItems = [
      { name: 'Tv Repair', price: 1000, thumb: 'serviceType-1.png'},
      { name: 'Cooler Repair', price: 500, thumb: 'serviceType-2.png'},
      { name: 'AC Repair', price: 1800, thumb: 'serviceType-3.png'},
      { name: 'Plumber', price: 800, thumb: 'serviceType-4.png'},
      { name: 'Electrical', price: 500,  thumb: 'serviceType-5.png'}
    ];
  }
  trackStatus() {
    this.router.navigate(['/product-orders']);
  }
}