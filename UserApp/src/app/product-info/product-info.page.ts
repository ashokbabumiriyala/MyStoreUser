import { Component, ElementRef, OnInit, ViewChild,NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { promise } from 'protractor';


import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
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
      title: 'Jaya Nagar'

    },
    {
      position: {
        lat: 12.951845,
        lng: 77.699577,
      },
      title: 'Marathahalli'
    },
    {
      position: {
        lat: 12.925453,
        lng: 77.546761,
      },
      title: 'Banashankari'
    },
    {
      position: {
        lat: 12.902802,
        lng: 77.580009,
      },
      title: 'JP Nagar'
    },
  ];

  // constructor(private router:Router) { }
  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,    
    public zone: NgZone,
    private router:Router
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }
  displayListView:boolean;
  ngOnInit() {
    this.style=[
      {
        "featureType": "landscape.natural.landcover",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ff3d51"
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
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ff4500"
          }
        ]
      }
    ]
    this.displayListView=true;
  }
  getProducts() {
    this.router.navigate(['/product-list'])
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
      title: marker.title,
     
      // fillColor:"blue" 
      // icon=google.Symbol(fill_color='blue')
      icon: {
        url: url,
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