import { Component, ElementRef, OnInit, ViewChild,NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { promise } from 'protractor';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { HelperService } from '../common/helper.service';
import { ProductInfoService } from '../product-info/product-info.service'
declare var google;
@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.page.html',
  styleUrls: ['./product-info.page.scss'],
})
export class ProductInfoPage implements OnInit {

  @ViewChild('map',  {static: false}) mapElement: ElementRef;
  map: any;
  address:string;
  lat: string;
  long: string;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  style = [];
  markers: Marker[] = [
    {
      position: {
        lat: 12.93,
        lng: 77.59,
      },
      title: 'IKEY'

    },
    {
      position: {
        lat: 12.961025,
        lng: 77.512688,
      },
      title: 'Forever-21'
    },
    {
      position: {
        lat: 12.925453,
        lng: 77.546761,
      },
      title: 'Walamart'
    },
    {
      position: {
        lat: 12.902802,
        lng: 77.580009,
      },
      title: 'Big Bazar'
    },
  ];
  merchantList = [];
  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public zone: NgZone,
    private router:Router,
    private helperService: HelperService, private productInfoService: ProductInfoService
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }
  displayListView:boolean;
  ngOnInit() {
    this.style=
    [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f5f5"
          }
        ]
      },
      {
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "visibility": "on"
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#f5f5f5"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#bdbdbd"
          }
        ]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ff4500"
          }
        ]
      },
      {
        "featureType": "landscape.natural.landcover",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ff4500"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dadada"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ff4500"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#c9c9c9"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      }
    ]
    this.displayListView=true;
    this.getMerchantList();
  }
  async getMerchantList(){
    const loadingController = await this.helperService.createLoadingController("loading");
    await loadingController.present();
   await this.productInfoService.getMerchantList('UserMerchantSelect')
    .subscribe((data: any) => {
      console.log(data);
      this.merchantList = data;
      loadingController.dismiss();
    },
    (error: any) => {
      loadingController.dismiss();
    });

  }
  getProducts(merchant) {
    this.router.navigate(['/product-list'], { queryParams: { storeId: merchant.merchantID } })
  }
  mapView():void{
    this.loadMap();
    this.displayListView=false;
  }
  listView():void{
    this.displayListView=true;
  }


  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    // create LatLng object
    const myLatLng = {lat: 12.972442, lng: 77.580643};
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
  addMarker(marker: Marker) {

    // const svgMarker = {
    //   path:

    //     "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    //   fillColor: "orangered",
    //   fillOpacity: 0.6,
    //   strokeWeight: 0,
    //   rotation: 0,
    //   scale: 2,
    //   anchor: new google.maps.Point(15, 30),
    // };

    // http:// google.com/mapfiles/ms/micons
    let url = "http://maps.google.com/mapfiles/ms/micons/";
      url += "orange-dot" + ".png";
    return new google.maps.Marker({
      position: marker.position,
      map: this.map,
      // title: marker.title,
      label: {
        color: 'red',
        fontWeight: 'bold',
        text: marker.title
      },
      // fillColor:"blue"
      // icon=google.Symbol(fill_color='blue')
      icon: {
        url: url,

        labelOrigin: new google.maps.Point(10, 45),

        // size: new google.maps.Size(22, 40),
        // origin: new google.maps.Point(0, 0),
        // anchor: new google.maps.Point(11, 40),
        //scaledSize: new google.maps.Size(38, 38)
      }
    });
  }

  renderMarkers() {
    this.markers.forEach(marker => {
      this.addMarker(marker);
    });
  }
}

interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;

}
