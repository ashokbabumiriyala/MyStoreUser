import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from '../common/helper.service';
import { ServiceInfoService } from '../service-info/service-info.service';
import {iDataTransferBetweenPages}  from '../common/data-transfer-between-pages';
declare var google;
@Component({
  selector: 'app-service-info',
  templateUrl: './service-info.page.html',
  styleUrls: ['./service-info.page.scss'],
})
export class ServiceInfoPage implements OnInit {
  serviceInfoList = [];
  displayListView: boolean;
  markers=[]
  @ViewChild('serviceMap', { static: false }) mapElement: ElementRef;
  map: any;
  style = [];
  GoogleAutocomplete: any;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  latitude:number;
  longitude:number;
  iDataTransferBetweenPages: iDataTransferBetweenPages;
  public masterData:any = [];
  public searchService: string = "";
  constructor(private router:Router, private serviceInfoService: ServiceInfoService,
    private helperService: HelperService) {  if (google) {
      this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    }
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];}

  ngOnInit() {
    this.displayListView = true;
    this.getserviceInfoList();
    this.googleMapStyle();
  }

  filterItems() {
    this.masterData = this.serviceInfoList.filter(item => {
      return item.businessName.toLowerCase().indexOf(this.searchService.toLowerCase()) > -1;
    });
  }
  async getserviceInfoList(){
    const loadingController = await this.helperService.createLoadingController("loading");
    await loadingController.present();
    await this.serviceInfoService.getServiceInfoList('UserServiceSelect')
    .subscribe((data: any) => {     
      this.serviceInfoList = data;
     
      Object.assign(this.masterData,this.serviceInfoList);  
      this.serviceInfoList.forEach(marker => {
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
  getServices(service) {
    this.iDataTransferBetweenPages = { serviceId: Number(service.serviceLocationID) };
    sessionStorage.removeItem("Key");
    sessionStorage.removeItem("DelCharge");
    sessionStorage.setItem("Key",service.razorPaymentKey);
    sessionStorage.setItem("DelCharge",service.deliveryCharges);  
    this.helperService.navigateWithData(['service-list'], this.iDataTransferBetweenPages);
  }
  mapView(){  
    this.displayListView=false;
    this.loadMap();
  }
  listView(){
    const mapEle: HTMLElement = document.getElementById('serviceMap');
    mapEle.classList.remove('map-view');
    this.displayListView = true;
  }
  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('serviceMap');
    mapEle.classList.add('map-view');    
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

  renderMarkers() {
    this.markers.forEach(marker => {
      this.addMarker(marker);
    });
  }
  addMarker(marker: any) {
    // http:// google.com/mapfiles/ms/micons
    let url = "http://maps.google.com/mapfiles/ms/micons/";
    url += "orange-dot" + ".png";
    var markerpoint = new google.maps.Marker({
      position: marker.position,
      map: this.map,
      // title: marker.title,
      label: {
        color: 'red',
        fontWeight: 'bold',
        text: marker.title
      },      
      icon: {
        url: url,

        labelOrigin: new google.maps.Point(10, 45),
      }
    });
    google.maps.event.addListener(markerpoint, 'click', ()  => {   
      this.getServices(marker.data);
    });
    return marker;
  }

  private googleMapStyle(){
    this.style =
    [
      {
          "featureType": "administrative.country",
          "elementType": "labels.icon",
          "stylers": [
              {
                  "visibility": "on"
              }
          ]
      }
  ]
  }
}
