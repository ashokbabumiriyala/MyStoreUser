import { Component, OnInit } from '@angular/core';
import { HelperService } from '../common/helper.service';
import { ServiceListService } from '../service-list/service-list.service';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { iDataTransferBetweenPages } from '../common/data-transfer-between-pages';
import { CategorySearchService } from '../category-search/category-search.service';
import { AvailableStoreTypes } from '../common/Enums';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.page.html',
  styleUrls: ['./service-list.page.scss'],
})
export class ServiceListPage implements OnInit {
  serviceId: number;
  serviceList = [];
  cartItems: any[] = [];
  public masterData: any = [];
  public searchService: string = '';
  serviceName: string = '';
  iDataTransferBetweenPages: iDataTransferBetweenPages;
  constructor(
    private helperService: HelperService,
    private serviceListService: ServiceListService,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private categorySearchService: CategorySearchService
  ) {}
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.iDataTransferBetweenPages = this.helperService.getPageData();
      this.serviceId = this.iDataTransferBetweenPages.serviceId;
      this.serviceName = this.iDataTransferBetweenPages.serviceName;
    });
    this.getServiceList();
    this.helperService.getCartItems().subscribe((cartItems) => {
      if (cartItems != null) {
        this.cartItems = cartItems;
      }
    });
  }

  filterItems() {
    this.masterData = this.serviceList.filter((item) => {
      return (
        item.businessName
          .toLowerCase()
          .indexOf(this.searchService.toLowerCase()) > -1
      );
    });
  }

  async getServiceList() {
    if (this.serviceId) {
      const loadingController =
        await this.helperService.createLoadingController('loading');
      await loadingController.present();
      const dataObject = { locationId: this.serviceId };
      await this.serviceListService
        .getServiceList('UserServiceProviderServiceSelect', dataObject)
        .subscribe(
          (data: any) => {
            this.serviceList = data.provideServiceList;
            Object.assign(this.masterData, this.serviceList);
            this.serviceList.forEach((service) => {
              service['addedToCart'] = false;
              service['itemCount'] = 1;
              this.cartItems.forEach((item) => {
                if (item.locationID == service.locationID) {
                  service['addedToCart'] = true;
                }
              });
            });
            loadingController.dismiss();
          },
          (error: any) => {
            loadingController.dismiss();
          }
        );
    }
  }
  addToCart(index) {
    if (
      this.cartItems.length == 0 ||
      (this.cartItems.length > 0 &&
        this.cartItems[0].locationID == this.serviceList[index].locationID)
    ) {
      this.serviceList[index].addedToCart = true;
      this.cartItems.push(this.serviceList[index]);
      this.helperService.setCartItems(this.cartItems);
      this.helperService.setCartItemsType(AvailableStoreTypes.ServiceType);
      this.helperService.setStoreLocationDetails(this.cartItems[0].locationID);
    } else {
      this.showCartClearAlert(index);
    }
  }
  removeFromCart(index) {
    this.serviceList[index].addedToCart = false;
    let idIndex = this.cartItems.findIndex(
      (x) => x.locationID === this.serviceList[index].locationID
    );
    this.cartItems.splice(idIndex, 1);
    this.helperService.setCartItems(this.cartItems);
  }
  showCartClearAlert(index) {
    const prompt = this.alertCtrl
      .create({
        header: 'Items already in Cart',
        message:
          'Your cart contains items from a different provider. Would you like to reset your cart?',
        buttons: [
          {
            text: 'Yes',
            handler: (data) => {
              this.cartItems = [];
              this.serviceList[index].addedToCart = true;
              this.cartItems.push(this.serviceList[index]);
              this.helperService.setCartItems(this.cartItems);
              this.helperService.setCartItemsType(
                AvailableStoreTypes.ServiceType
              );
            },
          },
          {
            text: 'No',
            handler: (data) => {},
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }
  async ionViewDidLeave() {
    if (sessionStorage.getItem('cartUpdated') == 'true') {
      await this.categorySearchService
        .insertCartItems('UserCartItemsInsert')
        .subscribe(
          (data: any) => {
            sessionStorage.setItem('cartUpdated', 'false');
          },
          (error: any) => {}
        );
    }
  }
}
