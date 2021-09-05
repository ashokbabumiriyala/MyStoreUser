import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  NgZone,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from '@ionic-native/native-geocoder/ngx';
import { HelperService } from '../common/helper.service';
import { ProductInfoService } from '../product-info/product-info.service';
import { iDataTransferBetweenPages } from '../common/data-transfer-between-pages';
import { StorageService } from '../common/storage.service';
import { AnimationController, ModalController } from '@ionic/angular';
import { MapsPage } from '../Shared/maps/maps.page';
import { VirtualFootFallService } from '../common/virtualfootfall.service';
import { StorePageType } from '../common/Enums';
import * as moment from 'moment';
declare var google;

enum PageType {
  MapPage = 0,
  ListPage = 1,
}

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.page.html',
  styleUrls: ['./product-info.page.scss'],
})
export class ProductInfoPage implements OnInit {
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;
  lat: string;
  long: string;
  autocomplete: { input: string };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  style = [];
  iDataTransferBetweenPages: iDataTransferBetweenPages;
  markers = [];
  merchantList: Array<any>;
  latitude: number;
  longitude: number;
  public masterData: any = [];
  public searchStore: string = '';
  constructor(
    public zone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private helperService: HelperService,
    private productInfoService: ProductInfoService,
    private storageService: StorageService,
    public animationCtrl: AnimationController,
    public modalController: ModalController,
    private virutalFootFallService: VirtualFootFallService
  ) {
    this.merchantList = new Array<any>();
    if (google) {
      this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    }
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }
  displayListView: boolean;
  currentPage: PageType = PageType.ListPage;
  pageType: StorePageType = StorePageType.storeByName;
  categoryName: string;
  productSearchString: string;

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.iDataTransferBetweenPages = this.helperService.getPageData();
      if (this.iDataTransferBetweenPages != undefined) {
        this.pageType = this.iDataTransferBetweenPages.pageType;
        console.log('pageType:' + this.pageType);
        if (this.iDataTransferBetweenPages.pageType == StorePageType.storesByCategory) {
          this.categoryName = this.iDataTransferBetweenPages.categoryName;
        }
        else if (this.iDataTransferBetweenPages.pageType == StorePageType.storesByProduct) {
          this.productSearchString = this.iDataTransferBetweenPages.productSearchString;
        }
      }
    });
    this.pageLoad();
  }

  async pageLoad() {
    this.displayListView = true;
    this.helperService.setProducts([]);
    this.googleMapStyle();
    if (this.pageType == StorePageType.storesByCategory) {
      await this.getMerchantList(this.categoryName, undefined);
    } else if (this.pageType == StorePageType.storesByProduct) {
      await this.getMerchantList(undefined, this.productSearchString);
    } else if (this.pageType == StorePageType.storeByName) {
      await this.getMerchantList(undefined, undefined);
    }

    // this.helperService.getProducts().subscribe((merchants) => {
    //   if (merchants != null && merchants.length > 0) {
    //     this.merchantList = merchants;
    //     Object.assign(this.masterData, this.merchantList);
    //     this.merchantList.forEach((marker) => {
    //       this.latitude = parseFloat(marker.latitude);
    //       this.longitude = parseFloat(marker.longitude);
    //       const markerObject = {
    //         position: {
    //           lat: parseFloat(marker.latitude),
    //           lng: parseFloat(marker.longitude),
    //         },
    //         title: marker.name,
    //         data: marker,
    //       };
    //       this.markers.push(markerObject);
    //     });
    //   } else {
    //     // this.getMerchantList();
    //   }
    // });
  }

  async getMerchantListByCategory(category: string) {

  }

  async getMerchantList(storeCategory?: string, productSearchString?: string) {
    const loadingController = await this.helperService.createLoadingController(
      'loading'
    );
    await loadingController.present();
    const dataObj = {
      Latitude: (await this.storageService.get('lat')).toString(),
      Longitude: (await this.storageService.get('lng')).toString(),
      StoreCategory: storeCategory?.trim(),
      searchKey: productSearchString?.trim(),
    };
    await this.productInfoService
      .getMerchantList('UserMerchantSelect', dataObj)
      .subscribe(
        (data: any) => {
          if (data != null && data.length > 0) {
            this.merchantList.splice(0, this.merchantList.length);
            data.forEach(d => {
              var storeFromTime = moment(d.fromTime).toDate();
              var storeToTime = moment(d.toTime).toDate();
              let currentTime = new Date();
              storeFromTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), storeFromTime.getHours(), storeFromTime.getMinutes());
              storeToTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), storeToTime.getHours(), storeToTime.getMinutes());
              moment(storeFromTime).format("hh:mm")
              d.isStoreClosed = !((currentTime >= storeFromTime) && (currentTime <= storeToTime));
            });

            data.sort(function (x, y) {
              return (x.isStoreClosed === y.isStoreClosed) ? 0 : x.isStoreClosed ? 1 : -1;
            });

            this.merchantList = data;
            Object.assign(this.masterData, this.merchantList);
            this.merchantList.forEach((marker) => {
              if (this.latitude == undefined && this.longitude == undefined) {
                this.latitude = parseFloat(marker.latitude);
                this.longitude = parseFloat(marker.longitude);
              }
              const markerObject = {
                position: {
                  lat: parseFloat(marker.latitude),
                  lng: parseFloat(marker.longitude),
                },
                title: marker.name,
                data: marker,
              };
              this.markers.push(markerObject);
            });
            loadingController.dismiss();
          }
          else {
            this.merchantList = [];
            this.masterData = [];
            loadingController.dismiss();
          }
        },
        (error: any) => {
          this.merchantList = [];
          this.masterData = [];
          loadingController.dismiss();
        }
      );
  }

  filterItems() {
    this.masterData = this.merchantList.filter((item) => {
      return (
        item.name.toLowerCase().indexOf(this.searchStore.toLowerCase()) > -1
      );
    });
  }

  async getProducts(merchant) {
    try {
      this.virutalFootFallService
        .updateStoreDataClicks(
          Number(await this.storageService.get('UserId')),
          Number(merchant.merchantID)
        )
        .subscribe(() => { });
    } catch (err) { }

    this.iDataTransferBetweenPages = {
      storeId: Number(merchant.merchantID),
      MerchantName: merchant.name,
      productSearchString: this.productSearchString
    };
    await this.storageService.remove('Key');
    await this.storageService.remove('DelCharge');
    await this.storageService.set('Key', merchant.razorPaymentKey);
    await this.storageService.set('DelCharge', merchant.deliveryCharges);
    this.helperService.navigateWithData(
      ['/product-list'],
      this.iDataTransferBetweenPages
    );
  }

  mapView(): void {
    this.currentPage = PageType.MapPage;
    this.displayListView = false;
    this.loadMap();
  }

  listView(): void {
    this.currentPage = PageType.ListPage;
    const mapEle: HTMLElement = document.getElementById('map');
    mapEle.classList.remove('map-view');
    this.displayListView = true;
  }

  async presentModal(title) {
    const enterAnimation = (baseEl: any) => {
      const backdropAnimation = this.animationCtrl
        .create()
        .addElement(baseEl.querySelector('ion-backdrop')!)
        .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');
      const wrapperAnimation = this.animationCtrl
        .create()
        .beforeStyles({
          opacity: 1,
          height: '83%',
          width: 'auto',
          'min-width': '96vw',
          'margin-top': '6%',
        })
        .addElement(baseEl.querySelector('.modal-wrapper')!)
        .fromTo('transform', 'scale(0)', 'scale(1)');

      return this.animationCtrl
        .create()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(400)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    };

    const leaveAnimation = (baseEl: any) => {
      return enterAnimation(baseEl).direction('reverse');
    };

    const modal = await this.modalController.create({
      component: MapsPage,
      componentProps: { model_title: title },
      enterAnimation,
      leaveAnimation,
    });
    modal.onDidDismiss().then(async (data) => {
      console.log(data);
      if (data.data.dismissed == false) {
        this.latitude = (await this.storageService.get('lat')).toString();
        this.longitude = (await this.storageService.get('lng')).toString();
        if (this.pageType == StorePageType.storesByCategory) {
          await this.getMerchantList(this.categoryName, undefined);
        } else if (this.pageType == StorePageType.storesByProduct) {
          await this.getMerchantList(undefined, this.productSearchString);
        } else if (this.pageType == StorePageType.storeByName) {
          await this.getMerchantList(undefined, undefined);
        }

        if (this.currentPage == PageType.ListPage) {
          this.listView();
        } else {
          this.loadMap();
        }
      }
    });

    return await modal.present();
  }

  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    mapEle.classList.add('map-view');
    // create LatLng object
    const myLatLng = { lat: this.latitude, lng: this.longitude };
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12,
      styles: this.style,
    });
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.renderMarkers();
      mapEle.classList.add('show-map');
    });
  }

  addMarker(marker: any) {
    // http:// google.com/mapfiles/ms/micons
    let url = 'http://maps.google.com/mapfiles/ms/micons/';
    url += 'orange-dot' + '.png';
    var markerpoint = new google.maps.Marker({
      position: marker.position,
      map: this.map,
      //title: marker.title,
      label: {
        color: 'red',
        fontWeight: 'bold',
        text: marker.title,
      },
      // fillColor:"blue"
      // icon=google.Symbol(fill_color='blue')
      icon: {
        url: './assets/images/store-removebg-preview.png',

        labelOrigin: new google.maps.Point(10, 45),

        // size: new google.maps.Size(22, 40),
        // origin: new google.maps.Point(0, 0),
        // anchor: new google.maps.Point(11, 40),
        //scaledSize: new google.maps.Size(38, 38)
      },
    });
    google.maps.event.addListener(markerpoint, 'click', () => {
      this.getProducts(marker.data);
    });
    return marker;
  }

  renderMarkers() {
    if (this.markers.length > 0) {
      this.markers.forEach((marker) => {
        this.addMarker(marker);
      });
    }
  }

  private googleMapStyle() {
    this.style = [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
      {
        elementType: 'geometry',
        stylers: [
          {
            color: '#ebe3cd',
          },
        ],
      },
      {
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#523735',
          },
        ],
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#f5f1e6',
          },
        ],
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#c9b2a6',
          },
        ],
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#dcd2be',
          },
        ],
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#ae9e90',
          },
        ],
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [
          {
            color: '#dfd2ae',
          },
        ],
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
          {
            color: '#dfd2ae',
          },
        ],
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#93817c',
          },
        ],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#a5b076',
          },
        ],
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#447530',
          },
        ],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#f5f1e6',
          },
        ],
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#fdfcf8',
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#f8c967',
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#e9bc62',
          },
        ],
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry',
        stylers: [
          {
            color: '#e98d58',
          },
        ],
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#db8555',
          },
        ],
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#806b63',
          },
        ],
      },
      {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [
          {
            color: '#dfd2ae',
          },
        ],
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#8f7d77',
          },
        ],
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#ebe3cd',
          },
        ],
      },
      {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [
          {
            color: '#dfd2ae',
          },
        ],
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#b9d3c2',
          },
        ],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#92998d',
          },
        ],
      },
    ];
  }
}

// interface Marker {
//   position: {
//     lat: number,
//     lng: number,
//   };
//   title: string;
// }
