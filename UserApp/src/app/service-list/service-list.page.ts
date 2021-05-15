import { Component, OnInit } from '@angular/core';
import { HelperService } from '../common/helper.service';
import { ServiceListService } from '../service-list/service-list.service'
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

import {iDataTransferBetweenPages}  from '../common/data-transfer-between-pages';
@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.page.html',
  styleUrls: ['./service-list.page.scss'],
})
export class ServiceListPage implements OnInit {
  serviceId:number;
  serviceList = [];
  cartItems:any[] = [];
  iDataTransferBetweenPages:iDataTransferBetweenPages;
  constructor (private helperService: HelperService, private serviceListService: ServiceListService,
    private route: ActivatedRoute, private alertCtrl: AlertController) { }
  ngOnInit(){
    this.route.queryParams.subscribe(params => {
      // this.serviceId = JSON.parse(params.serviceId);
      this.iDataTransferBetweenPages = this.helperService.getPageData();
      this.serviceId = this.iDataTransferBetweenPages.serviceId;
    });
    this.getServiceList();
    this.helperService.getCartItems().subscribe(cartItems => {
      if(cartItems!=null){
        this.cartItems = cartItems;
      }
    });
  }
  async getServiceList(){
    if (this.serviceId) {
      const loadingController = await this.helperService.createLoadingController("loading");
      await loadingController.present();
      const dataObject={locationId:this.serviceId};
      await this.serviceListService.getServiceList('UserServiceProviderServiceSelect', dataObject)
      .subscribe((data: any) => {
        console.log(data);
        this.serviceList = data.provideServiceList;
        this.serviceList.forEach(service => {
          service['addedToCart'] = false;
          service['itemCount'] = 1;
          this.cartItems.forEach(item => {
            if (item.locationID == service.locationID) {
              service['addedToCart'] = true;
            }
          })
        });
        loadingController.dismiss();
      },
      (error: any) => {
        loadingController.dismiss();
      });
    }


  }
  addToCart (index){
    if(this.cartItems.length == 0 ||
      (this.cartItems.length > 0 && this.cartItems[0].locationID == this.serviceList[index].locationID)) {
      this.serviceList[index].addedToCart = true;
      this.cartItems.push(this.serviceList[index]);
      this.helperService.setCartItems(this.cartItems);
    } else {
      this.showCartClearAlert(index);
    }

  }
  removeFromCart(index){
    this.serviceList[index].addedToCart = false;
    let idIndex = this.cartItems.findIndex(x => x.locationID === this.serviceList[index].locationID);
    this.cartItems.splice(idIndex, 1);
    this.helperService.setCartItems(this.cartItems);
  }
  showCartClearAlert(index) {
    const prompt = this.alertCtrl.create({
      header: 'Alert',
      message: "Do you want to clear cart items?",
      buttons: [
        {
          text: 'No',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: data => {
            console.log('Saved clicked');
            this.cartItems = [];
            this.serviceList[index].addedToCart = true;
            this.cartItems.push(this.serviceList[index]);
            this.helperService.setCartItems(this.cartItems);
          }
        }
      ]
    }).then(res => {

      res.present();

    });
  }

}
