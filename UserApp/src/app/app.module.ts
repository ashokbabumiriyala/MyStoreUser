import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { CategorySearchPageModule } from 'src/app/category-search/category-search.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Market } from '@ionic-native/market/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    CategorySearchPageModule,
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],

  providers: [
    Geolocation,
    NativeGeocoder,
    FCM,
    LocalNotifications,
    AppVersion,
    Market,
    Camera,
    AndroidPermissions,
    LocationAccuracy,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
