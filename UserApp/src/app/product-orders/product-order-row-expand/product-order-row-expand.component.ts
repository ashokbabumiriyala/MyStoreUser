import { Component, AfterViewInit, Input, ViewChild,  ElementRef, Renderer2, OnInit } from "@angular/core";
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-product-order-row-expand',
  templateUrl: './product-order-row-expand.component.html',
  styleUrls: ['./product-order-row-expand.component.scss'],
})
export class ProductOrderRowExpandComponent implements  OnInit  {

  @ViewChild("expandWrapper", { read: ElementRef }) expandWrapper: ElementRef;
  @Input("expandHeight") expandHeight: string = "250px";
  @Input() items: any;
  @Input("expanded") expanded: boolean;
  orderedItems:any = [];

  constructor(public renderer: Renderer2,  private toastController:ToastController) {
    this.orderedItems = this.items;
  }

  ngOnInit() { }

  ngOnChanges(SimpleValues:any) {
   this.expanded = SimpleValues.expanded.currentValue;
   this.orderedItems = SimpleValues.items.currentValue;
  }  
}
