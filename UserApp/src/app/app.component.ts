import { Component, OnInit, Optional } from '@angular/core';
import { ModalController, AnimationController } from '@ionic/angular';
import { CartPage } from './Shared/cart/cart.page';
import { MapsPage } from './Shared/maps/maps.page';
import { CategorySearchPage } from './category-search/category-search.page';
import { Platform } from '@ionic/angular';
import { HelperService } from 'src/app/common/helper.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { CommonApiServiceCallsService } from './Shared/common-api-service-calls.service';
import { environment } from './../environments/environment';
import { Router, NavigationStart } from '@angular/router';
import { PushTokenService } from './common/pushTokenService';
import { StorageService } from './common/storage.service';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
  Channel,
} from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  showHead: boolean = true;
  userName: string;
  showMenu: boolean;
  index: any = 0;
  public appPages = [
    { title: 'Profile', icon: 'person-outline', id: 1 },
    { title: 'Product Orders', icon: 'aperture-outline', id: 2 },
    //need to revert -- TODO
    // { title: 'Service Orders', icon: 'color-filter-outline', id: 3 },
    { title: 'Raise A Complaint', icon: 'chatbox-ellipses-outline', id: 4 },
    { title: 'About My3Karrt', icon: 'extension-puzzle-outline', id: 5 },
    { title: 'Terms and Conditions', icon: 'cog-outline', id: 6 },
    // { title: 'Shipping Policies',  icon: 'bus-outline',id:7 },
    { title: 'FAQ', icon: 'logo-foursquare', id: 7 },
    { title: 'Privacy Policies', icon: 'prism-outline', id: 8 },
    { title: 'Refunds & Cancellations', icon: 'wallet-outline', id: 9 },
    { title: 'Contact Us', icon: 'call-outline', id: 10 },
    { title: 'Log Out', icon: 'log-out-outline', id: 11 },
  ];
  constructor(
    public modalController: ModalController,
    private geolocation: Geolocation,
    private router: Router,
    public animationCtrl: AnimationController,
    private platform: Platform,
    private helperService: HelperService,
    private appVersion: AppVersion,
    private commonApiServiceCallsService: CommonApiServiceCallsService,
    private pushTokenService: PushTokenService,
    private storageService: StorageService
  ) {
    this.initializeApp();
  }
  cartItems = [];
  version: any;
  async ngOnInit(): Promise<void> {
    this.helperService.getProfileObs().subscribe((profile) => {
      this.index = 0;
      if (profile != null) {
        this.userName = profile.name;
        this.showMenu = true;
      } else {
        this.showMenu = false;
      }
    });
    this.helperService.getCartItems().subscribe((cartItems) => {
      if (cartItems != null) {
        this.cartItems = cartItems;
      }
    });
  }
  public async navigatePage(menuId: number): Promise<void> {
    switch (menuId) {
      case 11:
        this.showMenu = false;
        await this.storageService.clear();
        this.router.navigate(['/login']);
        break;

      case 1:
        this.router.navigate(['/signup'], { queryParams: { signup: false } });
        break;

      case 2:
        this.router.navigate(['/product-orders']);
        break;

      case 3:
        this.router.navigate(['/service-orders']);
        break;

      case 4:
        this.router.navigate(['/complaint']);
        break;

      case 5:
        this.router.navigate(['/information-pages/about-us']);
        break;

      case 6:
        this.router.navigate(['/information-pages/terms-conditions']);
        break;

      case 7:
        this.router.navigate(['/information-pages/faq']);
        break;

      case 8:
        this.router.navigate(['/information-pages/privacy-policies']);
        break;

      case 9:
        this.router.navigate(['/information-pages/refunds-cancellation']);
        break;
      case 10:
        this.router.navigate(['/information-pages/contact-us']);
        break;
    }
  }
  initializeApp() {
    this.platform.ready().then(async () => {
      const channel1: Channel = {
        id: 'mychannel',
        name: 'mychannel',
        importance: 5,
        sound: 'girlheyringtone.mp3',
        visibility: 1,
        vibration: true,
      }

      PushNotifications.requestPermissions().then(async (result) => {
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          await LocalNotifications.createChannel(channel1);
          await PushNotifications.createChannel(channel1);
          console.log(await PushNotifications.listChannels());
          await PushNotifications.register();
        } else {
          console.log("permissions are not granted");
          // Show some error
        }
      });

      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration',
        (token: Token) => {
          //alert('Push registration success, token: ' + token.value);
          console.log(token);
          this.storageService.set('PushToken', token.value);
        }
      );

      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError',
        (error: any) => {
          //alert('Error on registration: ' + JSON.stringify(error));
          console.log(error);
        }
      );

      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener('pushNotificationReceived',
        async (notification: PushNotificationSchema) => {
          //alert('Push received: ' + JSON.stringify(notification));
          console.log(notification);
          await LocalNotifications.schedule({
            notifications: [{
              title: notification.title,
              body: notification.body,
              id: 2,
              channelId: channel1.id
            }]
          });
        }
      );

      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          //alert('Push action performed: ' + JSON.stringify(notification));
          console.log(notification);
        }
      );

      this.geolocation
        .getCurrentPosition(options)
        .then(async (resp: Geoposition) => {
          this.storageService.set('lat', resp.coords.latitude);
          this.storageService.set('lng', resp.coords.longitude);
        })
        .catch((error) => { });
      if (this.platform.is('android') || this.platform.is('ios')) {
        await this.storageService.set('mobile', 'true');
        var options = {
          enableHighAccuracy: true,
          maximumAge: 30000, // milliseconds e.g., 30000 === 30 seconds
          timeout: 27000,
        };

        this.geolocation
          .getCurrentPosition(options)
          .then(async (resp: Geoposition) => {
            await this.storageService.set('lat', resp.coords.latitude);
            await this.storageService.set('lng', resp.coords.longitude);
          })
          .catch((error) => { });

        this.appVersion.getVersionNumber().then((res) => {
          this.version = res;
          if (this.version) {
            let apiUrl = environment.adminServiceUrl;
            this.commonApiServiceCallsService
              .getAll(apiUrl + 'GetAppVersion')
              .subscribe(
                (res) => {
                  let appNewVersion = res[0]['userAppVersion'];
                  let needUpdate = appNewVersion.localeCompare(
                    this.version,
                    undefined,
                    { numeric: true, sensitivity: 'base' }
                  );
                  if (needUpdate == 1) {
                    this.helperService.showAlert(
                      'Please update your App to avail Latest features provided by My3Karrt.'
                    );
                  }
                },
                (error) => { }
              );
          }
        });
      } else {
        await this.storageService.set('mobile', 'false');
      }
    });
  }

  async presentModal(title) {
    const enterAnimation = (baseEl: any) => {
      const backdropAnimation = this.animationCtrl
        .create()
        .addElement(baseEl.querySelector('ion-backdrop')!)
        .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');
      const wrapperAnimation = this.animationCtrl
        .create()
        .beforeStyles({
          opacity: 1,
          height: '83%',
          width: 'auto',
          'min-width': '96vw',
          'margin-top': '6%',
        })
        .addElement(baseEl.querySelector('.modal-wrapper')!)
        .fromTo('transform', 'scale(0)', 'scale(1)');

      return this.animationCtrl
        .create()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(400)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    };

    const leaveAnimation = (baseEl: any) => {
      return enterAnimation(baseEl).direction('reverse');
    };

    const modal = await this.modalController.create({
      component: MapsPage,
      componentProps: { model_title: title },
      enterAnimation,
      leaveAnimation,
    });
    return await modal.present();
  }

  async cartModal() {
    const enterAnimation = (baseEl: any) => {
      const backdropAnimation = this.animationCtrl
        .create()
        .beforeStyles({
          width: '100vw',
          height: 'auto',
          'min-height': '85vh',
          'margin-top': '16%',
          'margin-bottom': '10%',
        })
        .addElement(baseEl.querySelector('ion-backdrop')!)
        .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

      const wrapperAnimation = this.animationCtrl
        .create()
        .beforeStyles({
          opacity: 1,
          width: '90vw',
          position: 'absolute',
          right: '0px',
          left: 'auto',
          height: 'auto',
          'min-height': '85vh',
          'margin-top': '6%',
          'margin-bottom': ' 0%',
        })
        .addElement(baseEl.querySelector('.modal-wrapper')!)
        .fromTo('transform', 'translateX(100%)', 'translateX(1%)');

      return this.animationCtrl
        .create()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(400)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    };

    const leaveAnimation = (baseEl: any) => {
      return enterAnimation(baseEl).direction('reverse');
    };

    const modal = await this.modalController.create({
      component: CartPage,
      enterAnimation,
      leaveAnimation,
      presentingElement: await this.modalController.getTop(),
    });
    return await modal.present();
  }

  async searchModal() {
    const enterAnimation = (baseEl: any) => {
      const backdropAnimation = this.animationCtrl
        .create()
        .beforeStyles({
          width: '100vw',
          height: 'auto',
          'min-height': '85vh',
          'margin-top': '16%',
          'margin-bottom': '10%',
        })
        .addElement(baseEl.querySelector('ion-backdrop')!)
        .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

      const wrapperAnimation = this.animationCtrl
        .create()
        .beforeStyles({
          opacity: 1,
          width: '90vw',
          position: 'absolute',
          right: '0px',
          left: 'auto',
          height: 'auto',
          'min-height': '85vh',
          'margin-top': '6%',
          'margin-bottom': ' 0%',
        })
        .addElement(baseEl.querySelector('.modal-wrapper')!)
        .fromTo('transform', 'translateX(100%)', 'translateX(1%)');

      return this.animationCtrl
        .create()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(400)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    };

    const leaveAnimation = (baseEl: any) => {
      return enterAnimation(baseEl).direction('reverse');
    };

    const modal = await this.modalController.create({
      component: CategorySearchPage,
      enterAnimation,
      leaveAnimation,
      id: 'searchModal',
    });
    return await modal.present();
  }
}
