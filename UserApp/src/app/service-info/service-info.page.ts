import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from '../common/helper.service';
import { ServiceInfoService } from '../service-info/service-info.service';
import { iDataTransferBetweenPages } from '../common/data-transfer-between-pages';
import { StorageService } from '../common/storage.service';
declare var google;
@Component({
  selector: 'app-service-info',
  templateUrl: './service-info.page.html',
  styleUrls: ['./service-info.page.scss'],
})
export class ServiceInfoPage implements OnInit {
  serviceInfoList = [];
  displayListView: boolean;
  markers = [];
  @ViewChild('serviceMap', { static: false }) mapElement: ElementRef;
  map: any;
  style = [];
  GoogleAutocomplete: any;
  autocomplete: { input: string };
  autocompleteItems: any[];
  latitude: number;
  longitude: number;
  iDataTransferBetweenPages: iDataTransferBetweenPages;
  public masterData: any = [];
  public searchService: string = '';
  constructor(
    private router: Router,
    private serviceInfoService: ServiceInfoService,
    private helperService: HelperService,
    private storageService: StorageService
  ) {
    if (google) {
      this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    }
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }

  ngOnInit() {
    this.pageLoad();
  }

  public pageLoad() {
    this.displayListView = true;
    this.googleMapStyle();
    this.helperService.getServices().subscribe((services) => {
      if (services != null) {
        this.masterData = [];
        this.serviceInfoList = services;
        Object.assign(this.masterData, this.serviceInfoList);
        this.serviceInfoList.forEach((marker) => {
          this.latitude = parseFloat(marker.latitude);
          this.longitude = parseFloat(marker.longitude);
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
      } else {
        this.getserviceInfoList();
      }
    });
  }

  filterItems() {
    this.masterData = this.serviceInfoList.filter((item) => {
      return (
        item.businessName
          .toLowerCase()
          .indexOf(this.searchService.toLowerCase()) > -1
      );
    });
  }
  async getserviceInfoList() {
    const loadingController = await this.helperService.createLoadingController(
      'loading'
    );
    await loadingController.present();
    const dataObj = {
      Latitude: await this.storageService.get('lat'),
      Longitude: await this.storageService.get('lng'),
    };
    await this.serviceInfoService
      .getServiceInfoList('UserServiceSelect', dataObj)
      .subscribe(
        (data: any) => {
          this.serviceInfoList = data;

          Object.assign(this.masterData, this.serviceInfoList);
          this.serviceInfoList.forEach((marker) => {
            this.latitude = parseFloat(marker.latitude);
            this.longitude = parseFloat(marker.longitude);
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
        },
        (error: any) => {
          loadingController.dismiss();
        }
      );
  }

  async getServices(service) {
    this.iDataTransferBetweenPages = {
      serviceId: Number(service.serviceLocationID),
      serviceName: service.businessName,
    };
    await this.storageService.remove('Key');
    await this.storageService.remove('DelCharge');
    await this.storageService.set('Key', service.razorPaymentKey);
    await this.storageService.set('DelCharge', '0');
    this.helperService.navigateWithData(
      ['service-list'],
      this.iDataTransferBetweenPages
    );
  }
  mapView() {
    this.displayListView = false;
    this.loadMap();
  }
  listView() {
    const mapEle: HTMLElement = document.getElementById('serviceMap');
    mapEle.classList.remove('map-view');
    this.displayListView = true;
  }
  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('serviceMap');
    mapEle.classList.add('map-view');
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

  renderMarkers() {
    this.markers.forEach((marker) => {
      this.addMarker(marker);
    });
  }
  addMarker(marker: any) {
    // http:// google.com/mapfiles/ms/micons
    let url = 'http://maps.google.com/mapfiles/ms/micons/';
    url += 'orange-dot' + '.png';
    var markerpoint = new google.maps.Marker({
      position: marker.position,
      map: this.map,
      // title: marker.title,
      label: {
        color: 'red',
        fontWeight: 'bold',
        text: marker.title,
      },
      icon: {
        url: url,

        labelOrigin: new google.maps.Point(10, 45),
      },
    });
    google.maps.event.addListener(markerpoint, 'click', () => {
      this.getServices(marker.data);
    });
    return marker;
  }

  private googleMapStyle() {
    this.style = [
      {
        featureType: 'administrative.country',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'on',
          },
        ],
      },
    ];
  }
}
