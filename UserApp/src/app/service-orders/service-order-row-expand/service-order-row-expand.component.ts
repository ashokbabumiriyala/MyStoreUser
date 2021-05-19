import { Component, AfterViewInit, Input, ViewChild,  ElementRef, Renderer2, OnInit } from "@angular/core";
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-service-order-row-expand',
  templateUrl: './service-order-row-expand.component.html',
  styleUrls: ['./service-order-row-expand.component.scss'],
})
export class ServiceOrderRowExpandComponent implements OnInit {
  @ViewChild("expandWrapper", { read: ElementRef }) expandWrapper: ElementRef;
  @Input("expandHeight") expandHeight: string = "250px";
  @Input() items: any = [];
  @Input("expanded") expanded: boolean;
  orderedItems:any = [];
  constructor() { }

  ngOnInit() {
    this.orderedItems = [
      { name: 'Tv Repair', price: 1000, thumb: 'serviceType-1.png', units: 'item', count:1},
      { name: 'Cooler Repair', price: 500, thumb: 'serviceType-2.png', units: 'item', count:5},
      { name: 'AC Repair', price: 1800, thumb: 'serviceType-3.png', units: 'item', count:1},
      { name: 'Plumber', price: 800, thumb: 'serviceType-4.png', units: 'item', count:2},
      { name: 'Electrical', price: 500,  thumb: 'serviceType-5.png', units: 'item', count:3}
    ];
  }
  ngOnChanges(SimpleValues:any) {
    this.expanded = SimpleValues.expanded.currentValue;
   }  
}
