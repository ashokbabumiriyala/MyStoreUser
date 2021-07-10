import {
  Component,
  AfterViewInit,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
  OnInit,
} from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-service-order-row-expand',
  templateUrl: './service-order-row-expand.component.html',
  styleUrls: ['./service-order-row-expand.component.scss'],
})
export class ServiceOrderRowExpandComponent implements OnInit {
  @ViewChild('expandWrapper', { read: ElementRef }) expandWrapper: ElementRef;
  @Input('expandHeight') expandHeight: string = '250px';
  @Input() items: any;
  @Input() orderDetails: any;
  @Input('expanded') expanded: boolean;
  orderedItems: any = [];
  constructor() {}

  ngOnInit() {
    this.orderedItems = this.items;
  }
  ngOnChanges(SimpleValues: any) {
    this.expanded = SimpleValues.expanded.currentValue;
    this.orderedItems = SimpleValues.items.currentValue;
  }
}
