import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  Input,
} from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from '@ionic-native/native-geocoder/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
declare var google: any;
import { MapsService } from '../maps/maps.service';
import { HelperService } from '../../common/helper.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { StorageService } from 'src/app/common/storage.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
  @Input() model_title: string;
  selectedRadio: any = 'primary';
  mapImage: boolean = false;
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  map: any;
  address: string;
  lat: string;
  long: string;
  addrlat: string;
  addrlng: string;
  autocomplete: { input: string };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  geocoder: any;
  searchLocation: boolean;
  userAddressData: any[];
  userSelectedAddress: string;
  currentLocation: any;
  style = [];
  selectedAddress: string;

  constructor(
    public modalCtrl: ModalController,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public zone: NgZone,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private helperService: HelperService,
    private storageService: StorageService,
    private mapsService: MapsService,
    private toastController: ToastController
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.geocoder = new google.maps.Geocoder();
  }
  ngOnInit() {
    this.loadMap();
    if (this.model_title != 'Delivery Address') {
      this.searchLocation = true;
      this.mapImage = true;
      const ele = document.getElementById('mapWrapper') as HTMLElement;
      ele.classList.remove('map-size');
      this.checkGPSPermission();
    } else {
      this.getUserAddress();
    }
    this.userSelectedAddress = '';
    this.googleMapStyle();
  }

  async getUserAddress() {
    const dataObj = { UserId: Number(await this.storageService.get('UserId')) };
    await this.mapsService
      .getUserDeliveryAddress('GetUserDeliveryAddress', dataObj)
      .subscribe(
        (data: any) => {
          this.userAddressData = data.deliveryAddress;
          const defaultAddress = this.userAddressData.find(
            (x) => x.checked === true
          );
          this.selectedAddress = defaultAddress.id.toString();
          this.helperService.setDeliveryAddress(defaultAddress);
        },
        (error: any) => { }
      );
  }
  async addressChange(data: any) {
    const dataObj = {
      UserId: Number(await this.storageService.get('UserId')),
      Id: data.id,
    };
    await this.mapsService
      .userDeliveryAddressUpdate('UserDefaultDeliveryAddressUpdate', dataObj)
      .subscribe(
        (resultdata: any) => {
          this.helperService.presentToast(
            'Delivery address updated',
            'success'
          );
          this.getUserAddress();
        },
        (error: any) => { }
      );
  }
  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }
  updateRadio(eve) {
    const ele = document.getElementById('mapWrapper') as HTMLElement;
    console.log(eve.target.value);
    if (eve.target.value == 'secondary') {
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
    var options = {
      enableHighAccuracy: true,
      maximumAge: 30000, // milliseconds e.g., 30000 === 30 seconds
      timeout: 27000,
    };
    this.geolocation
      .getCurrentPosition(options)
      .then(async (resp: Geoposition) => {
        console.log(resp);
        let latLng = new google.maps.LatLng(
          resp.coords.latitude,
          resp.coords.longitude
        );
        // let latLng = new google.maps.LatLng(
        //   await this.storageService.get('lat'),
        //   await this.storageService.get('lng')
        // );
        const latlngTemp = {
          lat: resp.coords.latitude,
          lng: resp.coords.longitude
        };
        this.geocoder
          .geocode({ location: latlngTemp })
          .then((response: any) => {
            if (response != undefined && response.results.length > 0) {
              this.autocomplete.input = response.results[0].formatted_address;
              this.userSelectedAddress = response.results[0].formatted_address;
            }
          });

        let mapOptions = {
          center: latLng,
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: this.style,
        };
        //LOAD THE MAP WITH THE PREVIOUS VALUES AS PARAMETERS.
        this.map = new google.maps.Map(
          this.mapElement.nativeElement,
          mapOptions
        );
        let marker = new google.maps.Marker({
          position: latLng,
          map: this.map,
          title: 'You are here!',
          draggable: true,
        });
        google.maps.event.addListener(marker, 'dragend', async (event) => {
          let latLng = new google.maps.LatLng(
            event.latLng.lat(),
            event.latLng.lng()
          );
          this.addrlat = event.latLng.lat().toString();
          this.addrlng = event.latLng.lng().toString();
          console.log(`new selected address:${latLng}`);
          const latlngTemp = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          this.geocoder
            .geocode({ location: latlngTemp })
            .then((response: any) => {
              if (response != undefined && response.results.length > 0) {
                this.autocomplete.input = response.results[0].formatted_address;
                this.userSelectedAddress = response.results[0].formatted_address;
              }
            });

          this.storageService.set('lat', event.latLng.lat());
          this.storageService.set('lng', event.latLng.lng());
          marker.position = latLng;
        });
        this.map.setCenter(latLng);
      })
      .catch((error) => { console.log(error) });
  }

  //Check if application having GPS access permission
  checkGPSPermission() {
    this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
      )
      .then(
        (result) => {
          if (result.hasPermission) {
            this.askToTurnOnGPS();
          } else {
            this.requestGPSPermission();
          }
        },
        (err) => {
          console.log(err);
          // alert(err);
        }
      );
  }
  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log('4');
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions
          .requestPermission(
            this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
          )
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            (error) => {
              //Show alert if user click on 'No Thanks'
              alert(
                'requestPermission Error requesting location permissions ' +
                error
              );
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy.canRequest().then((result) => {
      if (result) {
        console.log("requesting to get acurate location");
        this.locationAccuracy
          .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
          .then(
            () => {
              if (this.locationAccuracy) {
                // When GPS Turned ON call method to get Accurate location coordinates
                this.tryGeolocation();
              }
            },
            (error) =>
              alert(
                'Error requesting location permissions ' + JSON.stringify(error)
              )
          );
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  async tryGeolocation() {
    this.geolocation
      .getCurrentPosition()
      .then(async (resp: Geoposition) => {
        console.log(resp);
        let pos = {
          lat: await this.storageService.get('lat'),
          lng: await this.storageService.get('lng'),
        };
        this.loadMap();
        const ele = document.getElementById('mapWrapper') as HTMLElement;
        ele.classList.remove('map-size');
        /*
                // let pos = {
                //   lat: resp.coords.latitude,
                //   lng: resp.coords.longitude,
                // };
                let marker = new google.maps.Marker({
                  position: pos,
                  map: this.map,
                  title: 'You are here!',
                  draggable: true,
                });
                this.map.setCenter(pos);
                if (this.model_title !== 'Delivery Address') {
                  google.maps.event.addListener(marker, 'dragend', function (event) {
                    let latLng = new google.maps.LatLng(
                      event.latLng.lat(),
                      event.latLng.lng()
                    );
                    this.storageService.set('lat', event.latLng.lat().toString());
                    this.storageService.set('lng', event.latLng.lng().toString());
                    marker.position = latLng;
                  });
                } else {
                  google.maps.event.addListener(marker, 'dragend', function (event) {
                    let latLng = new google.maps.LatLng(
                      event.latLng.lat(),
                      event.latLng.lng()
                    );
                    this.addrlat = event.latLng.lat();
                    this.addrlng = event.latLng.lng();
                    this.storageService.set('addlat', event.latLng.lat().toString());
                    this.storageService.set('addlng', event.latLng.lng().toString());
                    marker.position = latLng;
                  });
                }
                */
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async saveAddress() {
    if (this.model_title === 'Delivery Address') {
      const loadingController = await this.helperService.createLoadingController('loading');
      await loadingController.present();
      this.getAddressFromCoords(this.addrlat.toString(), this.addrlng.toString());
      const dataObj = {
        UserId: Number(await this.storageService.get('UserId')),
        Address: this.userSelectedAddress,
        Latitude: this.addrlat.toString(),
        Longitude: this.addrlng.toString(),
      };

      console.log(dataObj);
      this.mapsService
        .getUserDeliveryAddress('UserDeliveryAddressInsert', dataObj)
        .subscribe(
          (data: any) => {
            this.getUserAddress();
            loadingController.dismiss();
            this.userSelectedAddress = '';
            this.autocomplete.input = '';
          },
          (error: any) => {
            loadingController.dismiss();
          }
        );
      this.helperService.presentToast(
        'New delivery address selected!',
        'success'
      );
      this.dismiss();
    }
    else {
      this.helperService.presentToast('New neighborhood selected!', 'success');
      this.getUserStores();
      this.dismiss();
    }
  }

  async getUserStores() {
    const dataObj = {
      Latitude: (await this.storageService.get('lat')).toString(),
      Longitude: (await this.storageService.get('lng')).toString(),
    };
    await this.mapsService.userStores('userStores', dataObj).subscribe(
      (data: any) => {
        this.helperService.setProducts(data.userMerchant);
        this.helperService.setServices(data.userService);
      },
      (error: any) => { }
    );
  }

  getAddressFromCoords(lattitude, longitude) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5,
    };
    this.nativeGeocoder
      .reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = '';
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0) responseAddress.push(value);
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value + ', ';
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) => {
        this.address = 'Address Not Available!';
      });
  }

  //FUNCTION SHOWING THE COORDINATES OF THE POINT AT THE CENTER OF THE MAP
  ShowCords() {
    // alert('lat' +this.lat+', long'+this.long )
  }

  //AUTOCOMPLETE, SIMPLY LOAD THE PLACE USING GOOGLE PREDICTIONS AND RETURNING THE ARRAY.
  UpdateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions(
      { input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      }
    );
  }

  //wE CALL THIS FROM EACH ITEM.
  SelectSearchResult(item) {
    this.userSelectedAddress = '';
    this.autocompleteItems = [];
    this.geocoder.geocode({ placeId: item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        let position = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        let marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map,
          draggable: true,
        });
        if (this.model_title === 'Delivery Address') {
          google.maps.event.addListener(marker, 'dragend', (event) => {
            let latLng = new google.maps.LatLng(
              event.latLng.lat(),
              event.latLng.lng()
            );
            this.addrlat = event.latLng.lat().toString();
            this.addrlng = event.latLng.lng().toString();
            this.getAddressFromCoords(this.addrlat, this.addrlng);
            this.storageService.set('addrlat', event.latLng.lat().toString());
            this.storageService.set('addrlng', event.latLng.lng().toString());
            marker.position = latLng;
          });
        } else {
          google.maps.event.addListener(marker, 'dragend', (event) => {
            let latLng = new google.maps.LatLng(
              event.latLng.lat(),
              event.latLng.lng()
            );
            this.storageService.set('lat', event.latLng.lat().toString());
            this.storageService.set('lng', event.latLng.lng().toString());
            marker.position = latLng;
          });
        }
        this.map.setCenter(results[0].geometry.location);
        item.terms.reverse().forEach((item) => {
          this.userSelectedAddress =
            item.value + ',' + this.userSelectedAddress;
        });
        this.autocomplete.input = this.userSelectedAddress;
        this.geocoder.geocode(
          { address: this.userSelectedAddress },
          async (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
              if (this.model_title == 'Delivery Address') {
                this.addrlat = results[0].geometry.location.lat();
                this.addrlng = results[0].geometry.location.lng();
                this.getAddressFromCoords(this.addrlat, this.addrlng);
                await this.storageService.set(
                  'addrlat',
                  this.addrlat.toString()
                );
                await this.storageService.set(
                  'addrlng',
                  this.addrlng.toString()
                );
              } else {
                this.lat = results[0].geometry.location.lat();
                this.long = results[0].geometry.location.lng();
                await this.storageService.set('lat', this.lat.toString());
                await this.storageService.set('lng', this.long.toString());
              }
            }
          }
        );
      }
    });
  }
  ClearAutocomplete() {
    this.autocompleteItems = [];
    this.autocomplete.input = '';
  }
  //sIMPLE EXAMPLE TO OPEN AN URL WITH THE PLACEID AS PARAMETER.
  GoTo() {
    return (window.location.href =
      'https://www.google.com/maps/search/?api=1&query=Google&query_place_id=' +
      this.placeid);
  }
  //convert Address string to lat and long
  geoCode(address: any) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (this.model_title == 'Delivery Address') {
        this.addrlat = results[0].geometry.location.lat();
        this.addrlng = results[0].geometry.location.lng();
      } else {
        this.lat = results[0].geometry.location.lat();
        this.long = results[0].geometry.location.lng();
      }
      alert('lat: ' + this.lat + ', long: ' + this.long);
    });
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
