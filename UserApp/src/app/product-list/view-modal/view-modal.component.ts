import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-view-modal',
  templateUrl: './view-modal.component.html',
  styleUrls: ['./view-modal.component.scss'],
})
export class ViewModalComponent implements OnInit {
  @Input() productData: any;

  constructor(public modalCtrl: ModalController,) { }
  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;  
  sliderOne: any;
  slideOptsOne = {initialSlide: 0,slidesPerView: 1,autoplay: true };
 
  ngOnInit() {
    console.log("productData--"+ JSON.stringify(this.productData))
  this.sliderOne = {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: [{id: 'welcome.png'},{id: 'merchants.jpeg'},{id: 'services.jpeg'}]
    };   
  }
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
  //Move to Next slide
  slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  //Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });;
  }

  //Method called when slide is changed by drag or navigation
  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }

  //Call methods to check if slide is first or last to enable disbale navigation  
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log("changed:--"+ changes.productData.currentValue);
    this.productData = changes.productData.currentValue;
  }
}
