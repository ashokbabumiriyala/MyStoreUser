import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { HelperService } from '../common/helper.service';
import { CategorySearchService } from '../category-search/category-search.service';
import { iDataTransferBetweenPages } from '../common/data-transfer-between-pages';
import { StorageService } from '../common/storage.service';
import { IUserDetails } from '../common/provider-details';
import { VirtualFootFallService } from '../common/virtualfootfall.service';
@Component({
  selector: 'app-category-search',
  templateUrl: './category-search.page.html',
  styleUrls: ['./category-search.page.scss'],
})
export class CategorySearchPage implements OnInit {
  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private helperService: HelperService,
    private categorySearchService: CategorySearchService,
    private storageService: StorageService,
    private virutalFootFallService: VirtualFootFallService
  ) {
    this.storeCategories.unshift(`Select All`);
  }

  cartItems = [];
  homeResult: any[];
  isItemAvailable: boolean;
  public masterData: any = [];
  iDataTransferBetweenPages: iDataTransferBetweenPages;
  customActionSheetOptions: any = {
    header: 'Search By..',
    // subHeader: 'Select your favorite color'
  };
  selectedStoreCategory: string;
  storeCategories: Array<string> = [];

  async ngOnInit() {

    await this.storageService.init();
    var currentUserName = await this.storageService.get('UserName');
    var currentAuthToken = await this.storageService.get('AuthToken');
    if (
      this.helperService.isNullOrUndefined(currentUserName) ||
      this.helperService.isNullOrUndefined(currentAuthToken)
    ) {
      this.router.navigate(['/login']);
    } else {
      let providerDetails: IUserDetails;
      providerDetails = {
        name: await this.storageService.get('UserName'),
      };
      this.helperService.setProfileObs(providerDetails);
    }
    if ((await this.storageService.get('cartUpdated')) !== 'true') {
    }
    this.helperService.getCartItems().subscribe((cartItems) => {
      this.cartItems = cartItems;
    });
    const loadingController = await this.helperService.createLoadingController(
      'loading'
    );
    await loadingController.present();
    this.categorySearchService.getCategories().subscribe((data: any) => {
      this.storeCategories = [];
      this.storeCategories.unshift(
        `Select All`);
      this.selectedStoreCategory = 'Select All';
      this.storeCategories.push(...data);
      loadingController.dismiss();
    },
      (error: any) => {
        loadingController.dismiss();
      });

    this.SearchFromHome();
  }

  async SearchFromHome() {
    const loadingController = await this.helperService.createLoadingController(
      'loading'
    );
    await loadingController.present();
    await this.categorySearchService.searchFromHome('SearchFromHome').subscribe(
      (data: any) => {
        loadingController.dismiss();
        this.homeResult = data.homeSearchResult;
        Object.assign(this.masterData, this.homeResult);
      },
      (error: any) => {
        loadingController.dismiss();
      }
    );
  }

  async gethomeSearchResult(ev: any) {
    const val = ev.target.value;
    this.masterData = [];
    if (val && val.trim() !== '' && val.length >= 4) {
      this.isItemAvailable = true;
      this.masterData = this.homeResult.filter((item) => {
        if (item.address != null) {
          return item.address.toLowerCase().indexOf(val.toLowerCase()) > -1;
        }
      });
      const loadingController = await this.helperService.createLoadingController(
        'loading'
      );
      await loadingController.present();
      var tempCategory = this.selectedStoreCategory.toLowerCase() == "select all" ? undefined : this.selectedStoreCategory;
      var data = {
        category: tempCategory,
        productName: val.trim()
      };
      this.categorySearchService.getStoreDetailsByProduct("GetStoresDetailsByProduct", data).subscribe((data: any) => {
        console.log(data);
        this.masterData.push(...data);
        console.log(this.masterData);
        loadingController.dismiss();
      },
        (error: any) => { loadingController.dismiss(); });
    } else {
      this.isItemAvailable = false;
    }
  }

  async itemClick(data: any) {
    if (data.type === 'Product') {
      try {
        this.virutalFootFallService
          .updateStoreDataClicks(
            Number(await this.storageService.get('UserId')),
            data.id
          )
          .subscribe(() => { });
      } catch (err) { }
      this.iDataTransferBetweenPages = {
        storeId: Number(data.id),
        MerchantName: data.name,
      };
      await this.storageService.remove('Key');
      await this.storageService.remove('DelCharge');
      await this.storageService.set('Key', data.razorPaymentKey);

      this.helperService.navigateWithData(
        ['/product-list'],
        this.iDataTransferBetweenPages
      );
      this.isItemAvailable = false;
    } else {
      this.iDataTransferBetweenPages = {
        serviceId: Number(data.id),
        serviceName: data.name,
      };
      await this.storageService.remove('Key');
      await this.storageService.remove('DelCharge');
      await this.storageService.set('Key', data.razorPaymentKey);
      // sessionStorage.setItem("DelCharge",name.deliveryCharges);
      this.helperService.navigateWithData(
        ['service-list'],
        this.iDataTransferBetweenPages
      );
      this.isItemAvailable = false;
    }
  }

  async getCartItemsList() {
    const loadingController = await this.helperService.createLoadingController(
      'loading'
    );
    await loadingController.present();
    const dataObject = {
      UserId: Number(await this.storageService.get('UserId')),
    };
    await this.categorySearchService
      .getCartItems('UserCartItemsSelect', dataObject)
      .subscribe(
        async (data: any) => {
          loadingController.dismiss();
          let cartItemsData = data.cartItems;
          if (cartItemsData.serviceLocationId !== 0) {
            this.cartItems = cartItemsData.serviceCartItems;
            this.cartItems.forEach((item) => {
              item['itemCount'] = 1;
              item['addedToCart'] = true;
              item['locationID'] = cartItemsData.serviceLocationId;
            });
          }
          if (cartItemsData.storeId !== 0) {
            this.cartItems = cartItemsData.productCartItems;
            this.cartItems.forEach((item) => {
              item['itemCount'] = Number(item.quantity);
              item['addedToCart'] = true;
              item['storeID'] = cartItemsData.storeId;
            });
          }
          this.helperService.setCartItems(this.cartItems);
          await this.storageService.set('cartItems', 'false');
        },
        (error: any) => {
          loadingController.dismiss();
        }
      );
  }
  dismiss() {
    if (document.getElementById('searchModal')) {
      this.modalCtrl.dismiss({
        dismissed: true,
      });
    } else {
      return;
    }
  }
  navigateTo(ele) {
    this.dismiss();
    if (ele == 'product') {
      this.router.navigate(['/product-info']);
    } else {
      this.router.navigate(['/service-info']);
    }
  }

  onStoreCategoryChange() {

  }
}
