import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
declare var google:any;
import {MapsService}  from '../maps/maps.service';
import { HelperService } from '../../common/helper.service';

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
  userAddressData:any[];
  userSelectedAddress:string;
  constructor(public modalCtrl: ModalController,private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder, public zone: NgZone, 
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private helperService:HelperService,
    private mapsService:MapsService) {
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
    }else{
    this.getUserAddress();
    }
    this.userSelectedAddress='';
  }

async getUserAddress() {
 const dataObj={UserId: Number(sessionStorage.getItem("UserId"))};
    await this.mapsService.getUserDeliveryAddress('GetUserDeliveryAddress',dataObj)
      .subscribe((data: any) => {
       this.userAddressData=data.deliveryAddress;
      },
        (error: any) => {
         
        });
  }
  changeAddress(){
   
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
      this.checkGPSPermission();
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
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      let marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        title: 'You are here!',
        draggable: true
      });
      this.markers.push(marker);
      google.maps.event.addListener(marker, 'dragend', function() {
      });
    }).catch((error) => {

    });
  }

  //Check if application having GPS access permission
  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          //If having permission show 'Turn On GPS' dialogue
          this.askToTurnOnGPS();
        } else {
          //If not having permission ask for permission
          this.requestGPSPermission();
        }
      },
      err => {
        alert(err);
      }
    );
  }
  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            error => {
              //Show alert if user click on 'No Thanks'
              alert('requestPermission Error requesting location permissions ' + error)
            }
          );
      }
    });
  }
  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        // When GPS Turned ON call method to get Accurate location coordinates
        this.tryGeolocation();
      },
      error => alert('Error requesting location permissions ' + JSON.stringify(error))
    );
  }

async  tryGeolocation(){
    // this.clearMarkers();
    this.geolocation.getCurrentPosition().then((resp) => {
      let pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      let marker = new google.maps.Marker({
        position: pos,
        map: this.map,
        title: 'You are here!',
        draggable: true
      });
      this.markers.push(marker);
      this.map.setCenter(pos);
      google.maps.event.addListener(marker, 'dragend', function() {
      });
    }).catch((error) => {

    });

    if(this.userSelectedAddress!=''){
      const loadingController = await this.helperService.createLoadingController("loading");
      await loadingController.present(); 
      const dataObj={UserId: Number(sessionStorage.getItem("UserId")),Address:this.userSelectedAddress};
      await this.mapsService.getUserDeliveryAddress('UserDeliveryAddressInsert',dataObj)
        .subscribe((data: any) => {
          this.getUserAddress();
          loadingController.dismiss();
          this.userSelectedAddress='';
          this.autocomplete.input='';
        },
          (error: any) => {
            loadingController.dismiss();
          });
    }
  }

  getAddressFromCoords(lattitude, longitude) {
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
    this.userSelectedAddress='';
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
        });
        this.map.setCenter(results[0].geometry.location);
        item.terms.forEach((item) => {       
          this.userSelectedAddress= item.value +"," + this.userSelectedAddress;
        });
        this.autocomplete.input= this.userSelectedAddress;
      }
    })
  }
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
