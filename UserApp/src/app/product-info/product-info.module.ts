import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductInfoPageRoutingModule } from './product-info-routing.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { ProductInfoPage } from './product-info.page';
import { GoogleMapsComponent }  from 'src/app/google-maps/google-maps.component'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductInfoPageRoutingModule
  ],
  declarations: [ProductInfoPage,GoogleMapsComponent]
  ,providers:[  
    Geolocation,    
    NativeGeocoder]
})
export class ProductInfoPageModule {}
