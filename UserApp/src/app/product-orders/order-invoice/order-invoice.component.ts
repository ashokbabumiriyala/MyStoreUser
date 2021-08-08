import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-order-invoice',
  templateUrl: './order-invoice.component.html',
  styleUrls: ['./order-invoice.component.scss'],
})
export class OrderInvoiceComponent implements OnInit {
  @Input() orderedItemsList: any;
  @Input() orderItem: any;
  constructor() { }

  ngOnInit() {
    // console.log(this.orderedItemsList, this.orderItem);
   }  
}
