import { Component, ElementRef, OnInit, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { HelperService } from '../common/helper.service';
import { ProductInfoService } from '../product-info/product-info.service'
import { iDataTransferBetweenPages } from '../common/data-transfer-between-pages';
declare var google;
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
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  style = [];
  iDataTransferBetweenPages: iDataTransferBetweenPages;
  markers=[]
  merchantList = [];
  latitude:number;
  longitude:number;
  public masterData:any = [];
  public searchStore: string = "";
  constructor(   
    public zone: NgZone,
    private router: Router,
    private helperService: HelperService, private productInfoService: ProductInfoService
  ) {
    if (google) {
      this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    }
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }
  displayListView: boolean;
  ngOnInit() {
    this.displayListView = true;
    this.getMerchantList();
    this.googleMapStyle();
  }
  async getMerchantList() {
    const loadingController = await this.helperService.createLoadingController("loading");
    await loadingController.present();
    const dataObj={Latitude: sessionStorage.getItem("lat"),Longitude: sessionStorage.getItem("lng")};
    await this.productInfoService.getMerchantList('UserMerchantSelect',dataObj)
      .subscribe((data: any) => {
        this.merchantList = data;
        Object.assign(this.masterData,this.merchantList);       
        this.merchantList.forEach(marker => {
          this.latitude=parseFloat(marker.latitude)
          this.longitude=parseFloat(marker.longitude);
          const markerObject = { position: {lat: parseFloat(marker.latitude),  lng:parseFloat(marker.longitude)},  title: marker.name, data: marker };
          this.markers.push(markerObject);
        });
        loadingController.dismiss();        
      },
        (error: any) => {
          loadingController.dismiss();
        });
  }
  filterItems() {
    this.masterData = this.merchantList.filter(item => {
      return item.name.toLowerCase().indexOf(this.searchStore.toLowerCase()) > -1;
    });
  }


  getProducts(merchant) {
    this.iDataTransferBetweenPages = { storeId: Number(merchant.merchantID),MerchantName:merchant.name};
     sessionStorage.removeItem("Key");
     sessionStorage.removeItem("DelCharge");
     sessionStorage.setItem("Key",merchant.razorPaymentKey);
     sessionStorage.setItem("DelCharge",merchant.deliveryCharges);
    this.helperService.navigateWithData(['/product-list'], this.iDataTransferBetweenPages);


  }
  mapView():void{
    this.displayListView=false;
    this.loadMap();
  }
  listView(): void {
    const mapEle: HTMLElement = document.getElementById('map');
    mapEle.classList.remove('map-view');
    this.displayListView = true;
  }
  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    mapEle.classList.add('map-view');
    // create LatLng object
    const myLatLng = { lat:  this.latitude, lng:  this.longitude };
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12,
      styles: this.style
    });
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.renderMarkers();
      mapEle.classList.add('show-map');
    });
  }

  addMarker(marker: any) {
    // http:// google.com/mapfiles/ms/micons
    let url = "http://maps.google.com/mapfiles/ms/micons/";
    url += "orange-dot" + ".png";
    var markerpoint = new google.maps.Marker({
      position: marker.position,
      map: this.map,
      //title: marker.title,
      label: {
        color: 'red',
        fontWeight: 'bold',
        text: marker.title
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
      }
    });
    google.maps.event.addListener(markerpoint, 'click', ()  => {     
      this.getProducts(marker.data);
    });
    return marker;
  }

  renderMarkers() {
    this.markers.forEach(marker => {
      this.addMarker(marker);
    });
  }

  private googleMapStyle(){
    this.style =  
  [{
    "featureType": "poi",
    "elementType": "labels",
    "stylers": [
          { "visibility": "off" }
    ]
},
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#523735"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#c9b2a6"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#dcd2be"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ae9e90"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#93817c"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#a5b076"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#447530"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#fdfcf8"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f8c967"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#e9bc62"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e98d58"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#db8555"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#806b63"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8f7d77"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#b9d3c2"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#92998d"
        }
      ]
    }
  ]
  }
}

// interface Marker {
//   position: {
//     lat: number,
//     lng: number,
//   };
//   title: string;
// }
