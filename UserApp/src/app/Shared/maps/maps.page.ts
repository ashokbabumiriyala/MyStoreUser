import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
declare var google:any;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss']
})
export class MapsPage implements OnInit {
  @Input() model_title: string;
  selectedRadio:any = "primary";
  mapImage:boolean = false;
  @ViewChild('map',  {static: true}) mapElement: ElementRef;
  map: any;
  address:string;
  lat: string;
  long: string;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  geocoder:any;
  markers:any;
  searchLocation:boolean;
  constructor(public modalCtrl: ModalController,private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder, public zone: NgZone) {
      this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
      this.autocomplete = { input: '' };
      this.autocompleteItems = [];
      this.geocoder = new google.maps.Geocoder;
      this.markers = [];

     }
  ngOnInit() {
    this.loadMap();
    if (this.model_title != 'Delivery Address') {
      this.searchLocation = true;
      this.mapImage = true;
      const ele = document.getElementById('mapWrapper') as HTMLElement;
      ele.classList.remove('map-size');
    }

  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
  updateRadio(eve){
    const ele = document.getElementById('mapWrapper') as HTMLElement;
    if(eve.target.value == 'secondary') {
      this.mapImage = true;
      ele.classList.remove('map-size');
    } else {
      this.mapImage = false;
      ele.classList.add('map-size');
    }
  }
  loadMap() {
    const ele = document.getElementById('mapWrapper') as HTMLElement;
    ele.classList.add('map-size');
    //FIRST GET THE LOCATION FROM THE DEVICE.
    var options = {
      enableHighAccuracy: true,
      maximumAge: 30000, // milliseconds e.g., 30000 === 30 seconds
      timeout: 27000
    };
    this.geolocation.getCurrentPosition(options).then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      //LOAD THE MAP WITH THE PREVIOUS VALUES AS PARAMETERS.
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.map.addListener('tilesloaded', () => {
        console.log('accuracy',this.map, this.map.center.lat());
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
        this.lat = this.map.center.lat()
        this.long = this.map.center.lng()
      });
      this.map.addListener('')
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  tryGeolocation(){
    // this.clearMarkers();
    this.geolocation.getCurrentPosition().then((resp) => {
      let pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      let marker = new google.maps.Marker({
        position: pos,
        map: this.map,
        title: 'I am here!'
      });
      this.markers.push(marker);
      marker.addListener("click", () => {
        alert(1);
      });
      this.map.setCenter(pos);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords "+lattitude+" "+longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if(value.length>0)
          responseAddress.push(value);
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value+", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) =>{
        this.address = "Address Not Available!";
      });
  }

  //FUNCTION SHOWING THE COORDINATES OF THE POINT AT THE CENTER OF THE MAP
  ShowCords(){
    alert('lat' +this.lat+', long'+this.long )
  }

  //AUTOCOMPLETE, SIMPLY LOAD THE PLACE USING GOOGLE PREDICTIONS AND RETURNING THE ARRAY.
  UpdateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }

  //wE CALL THIS FROM EACH ITEM.
  SelectSearchResult(item){
    //this.clearMarkers();
    this.autocompleteItems = [];

    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      if(status === 'OK' && results[0]){
        let position = {
            lat: results[0].geometry.location.lat,
            lng: results[0].geometry.location.lng
        };
        let marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map,
          draggable: true
        });
        this.markers.push(marker);
        google.maps.event.addListener(marker, 'dragend', function() {
          console.log('dragend', marker.getPosition())
          // $scope.geocodePosition(marker.getPosition());
        });
        this.map.setCenter(results[0].geometry.location);
      }
    })
  }


  //lET'S BE CLEAN! THIS WILL JUST CLEAN THE LIST WHEN WE CLOSE THE SEARCH BAR.
  ClearAutocomplete(){
    this.autocompleteItems = []
    this.autocomplete.input = ''
  }

  //sIMPLE EXAMPLE TO OPEN AN URL WITH THE PLACEID AS PARAMETER.
  GoTo(){
    return window.location.href = 'https://www.google.com/maps/search/?api=1&query=Google&query_place_id='+this.placeid;
  }

   //convert Address string to lat and long
  geoCode(address:any) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
    this.lat = results[0].geometry.location.lat();
    this.long = results[0].geometry.location.lng();
    alert("lat: " + this.lat + ", long: " + this.long);
   });
 }
}
