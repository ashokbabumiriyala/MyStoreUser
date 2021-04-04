import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

declare var google;
@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss'],
})
export class GoogleMapsComponent implements OnInit {
  // @ViewChild('map',  {static: false}) mapElement: ElementRef;
  // map: any;
  // address:string;
  // lat: string;
  // long: string;  
  // autocomplete: { input: string; };
  // autocompleteItems: any[];
  // location: any;
  // placeid: any;
  // GoogleAutocomplete: any;
  // constructor( private geolocation: Geolocation,
  //   private nativeGeocoder: NativeGeocoder,    
  //   public zone: NgZone,) {  this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
  //     this.autocomplete = { input: '' };
  //     this.autocompleteItems = []; }
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
  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,    
    public zone: NgZone,
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }
      ngOnInit() {
        this.loadMap();    
      }

      loadMap() {      
        // create a new map by passing HTMLElement
        const mapEle: HTMLElement = document.getElementById('map');
        // create LatLng object
        const myLatLng = {lat: 17.387140, lng: 78.491684};
        // create map
        this.map = new google.maps.Map(mapEle, {
          center: myLatLng,
          zoom: 12
        });
      
        google.maps.event.addListenerOnce(this.map, 'idle', () => {
          this.renderMarkers();
          mapEle.classList.add('show-map');
        });
      }
      addMarker(marker: Marker) {
        return new google.maps.Marker({
          position: marker.position,
          map: this.map,
          title: marker.title
        });
      }
    
      renderMarkers() {
        this.markers.forEach(marker => {
          this.addMarker(marker);
        });
      }
     
    

    //#region  old code
      // //LOADING THE MAP HAS 2 PARTS.
      // loadMap() {        
      //   //FIRST GET THE LOCATION FROM THE DEVICE.
      //   this.geolocation.getCurrentPosition().then((resp) => {
      //     console.log(resp);
      //     let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      //     let mapOptions = {
      //       center: latLng,
      //       zoom: 15,
      //       mapTypeId: google.maps.MapTypeId.ROADMAP
      //     } 
          
      //     //LOAD THE MAP WITH THE PREVIOUS VALUES AS PARAMETERS.
      //     this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude); 
      //     this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions); 
      //     this.map.addListener('tilesloaded', () => {
      //       console.log('accuracy',this.map, this.map.center.lat());
      //       this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
      //       this.lat = this.map.center.lat()
      //       this.long = this.map.center.lng()
      //     }); 
      //   }).catch((error) => {
      //     console.log('Error getting location', error);
      //   });
      // }
    
      
      // getAddressFromCoords(lattitude, longitude) {
      //   console.log("getAddressFromCoords "+lattitude+" "+longitude);
      //   let options: NativeGeocoderOptions = {
      //     useLocale: true,
      //     maxResults: 5    
      //   }; 
      //   this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      //     .then((result: NativeGeocoderResult[]) => {
      //       this.address = "";
      //       let responseAddress = [];
      //       for (let [key, value] of Object.entries(result[0])) {
      //         if(value.length>0)
      //         responseAddress.push(value); 
      //       }
      //       responseAddress.reverse();
      //       for (let value of responseAddress) {
      //         this.address += value+", ";
      //       }
      //       this.address = this.address.slice(0, -2);
      //     })
      //     .catch((error: any) =>{ 
      //       this.address = "Address Not Available!";
      //     }); 
      // }    
      // //FUNCTION SHOWING THE COORDINATES OF THE POINT AT THE CENTER OF THE MAP
      // // ShowCords(){
      // //   // alert('lat' +this.lat+', long'+this.long )
      // //   this.GoTo();
      // // }
      
      // //AUTOCOMPLETE, SIMPLY LOAD THE PLACE USING GOOGLE PREDICTIONS AND RETURNING THE ARRAY.
      // UpdateSearchResults(){
      //   if (this.autocomplete.input == '') {
      //     this.autocompleteItems = [];
      //     return;
      //   }
      //   this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      //   (predictions, status) => {
      //     this.autocompleteItems = [];
      //     this.zone.run(() => {
      //       predictions.forEach((prediction) => {
      //         this.autocompleteItems.push(prediction);
      //       });
      //     });
      //   });
      // }      
      // //wE CALL THIS FROM EACH ITEM.
      // SelectSearchResult(item) {
      //   ///WE CAN CONFIGURE MORE COMPLEX FUNCTIONS SUCH AS UPLOAD DATA TO FIRESTORE OR LINK IT TO SOMETHING
      //   // alert(JSON.stringify(item))      
      //   this.placeid = item.place_id
      //   this.GoTo();
      // }
      // //lET'S BE CLEAN! THIS WILL JUST CLEAN THE LIST WHEN WE CLOSE THE SEARCH BAR.
      // ClearAutocomplete(){
      //   this.autocompleteItems = []
      //   this.autocomplete.input = ''
      // }
     
      // //sIMPLE EXAMPLE TO OPEN AN URL WITH THE PLACEID AS PARAMETER.
      // GoTo(){
      //   return window.location.href = 'https://www.google.com/maps/search/?api=1&query=Google&query_place_id='+this.placeid;
      // }
      //#endregion
    }
    interface Marker {
      position: {
        lat: number,
        lng: number,
      };
      title: string;
    }
