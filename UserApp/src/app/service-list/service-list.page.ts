import { Component, OnInit } from '@angular/core';
import { HelperService } from '../common/helper.service';
import { ServiceListService } from '../service-list/service-list.service'
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.page.html',
  styleUrls: ['./service-list.page.scss'],
})
export class ServiceListPage implements OnInit {
  serviceId:number;
  serviceList = [];
  cartItems:any[] = [];
  constructor (private helperService: HelperService, private serviceListService: ServiceListService,
    private route: ActivatedRoute) { }
  ngOnInit(){
    this.route.queryParams.subscribe(params => {
      this.serviceId = JSON.parse(params.serviceId);
    });
    this.getServiceList();
    this.helperService.getCartItems().subscribe(cartItems => {
      if(cartItems!=null){
        this.cartItems = cartItems;
      }
    });
  }
  async getServiceList(){
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
  addToCart (index){
    this.serviceList[index].addedToCart = true;
    this.cartItems.push(this.serviceList[index]);
    this.helperService.setCartItems(this.cartItems);
  }
  removeFromCart(index){
    this.serviceList[index].addedToCart = false;
    let idIndex = this.cartItems.findIndex(x => x.locationID === this.serviceList[index].locationID);
    this.cartItems.splice(idIndex, 1);
    this.helperService.setCartItems(this.cartItems);
  }

}
