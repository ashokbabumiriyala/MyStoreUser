import { Component, OnInit } from '@angular/core';
import { ModalController, AnimationController } from '@ionic/angular';
import { CartPage } from './Shared/cart/cart.page';
import { MapsPage } from './Shared/maps/maps.page';
import { CategorySearchPage } from './category-search/category-search.page';
import { Platform } from '@ionic/angular';
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
import { HelperService} from 'src/app/common/helper.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { CommonApiServiceCallsService} from './Shared/common-api-service-calls.service';
import { environment} from './../environments/environment';
import { Router, NavigationStart } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit{
  showHead:boolean = true;
  userName:string;
  showMenu:boolean;
  public appPages = [
    { title: 'Profile',  icon: 'person-outline', id:1},
    { title: 'Product Orders', icon: 'aperture-outline',id:2 },
    { title: 'Service Orders',  icon: 'color-filter-outline',id:3 },
    { title: 'Raise A Complaint', icon: 'chatbox-ellipses-outline',id:4},
    { title: 'About My3Karrt',  icon: 'extension-puzzle-outline',id:5 },
    { title: 'Terms and Conditions',icon: 'cog-outline' ,id:6},
    // { title: 'Shipping Policies',  icon: 'bus-outline',id:7 },
    { title: 'FAQ',  icon: 'logo-foursquare',id:7 },
    { title: 'Privacy Policies',  icon: 'prism-outline',id:8 },
    { title: 'Refunds & Cancellations', icon: 'wallet-outline' ,id:9},
    { title: 'Contact Us',  icon: 'call-outline',id:10 },
    { title: 'Log Out',  icon: 'log-out-outline' ,id:11 }   
  ];
  constructor(public modalController: ModalController,
    private router: Router,   
    public animationCtrl: AnimationController, private fcm: FCM, private platform: Platform,
     private helperService: HelperService, private appVersion: AppVersion, private commonApiServiceCallsService: CommonApiServiceCallsService) {
      this.initializeApp();
     }
     cartItems =[];
     version:any;
    ngOnInit(): void {
      this.helperService.getProfileObs().subscribe(profile => {
        if(profile!=null){
        this.userName = profile.name;
        this.showMenu=true;
        }else{
          this.showMenu=false;
        }
      });
      this.helperService.getCartItems().subscribe(cartItems => {
        if(cartItems!=null){
          this.cartItems = cartItems;
        }
      });     
    }
    public navigatePage(menuId: number): void {       
      switch (menuId) {      
        case 11:
          this.showMenu=false;    
          this.router.navigate(['/login']);
          break;

          case 1:           
          this.router.navigate(['/signup']);
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
      this.platform.ready().then(() => {
        if (this.platform.is('android') || this.platform.is('ios')) {
          sessionStorage.setItem('mobile', 'true');
          this.appVersion.getVersionNumber().then((res) => {
            this.version = res;
            if (this.version){
              let apiUrl = environment.adminServiceUrl;
              this.commonApiServiceCallsService.getAll(apiUrl + 'GetAppVersion').subscribe((res)=>{
                let appNewVersion = res[0]['userAppVersion'];
                let needUpdate = appNewVersion.localeCompare(this.version, undefined, { numeric: true, sensitivity: 'base' })
                if (needUpdate == 1) {
                  this.helperService.showAlert('Please update your App to avail Latest features provided by My3Karrt.');
                }
              }, (error) => {
              })
            }
          });
          // subscribe to a topic
          this.fcm.subscribeToTopic('Users');

          // get FCM token
          this.fcm.getToken().then(token => {

            sessionStorage.setItem("PushToken",token);         });

          // ionic push notification example
          this.fcm.onNotification().subscribe(data => {

            if (data.wasTapped) {
              console.log('Received in background');
            } else {
              console.log('Received in foreground');
            }
          });

          // refresh the FCM token
          this.fcm.onTokenRefresh().subscribe(token => {

            sessionStorage.setItem("PushToken",token);
          });
        } else {
          sessionStorage.setItem('mobile', 'false');
        }
      });
    }
    async presentModal(title) {
      const enterAnimation = (baseEl: any) => {
        const backdropAnimation = this.animationCtrl.create()         
          .addElement(baseEl.querySelector('ion-backdrop')!)
          .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');
        const wrapperAnimation = this.animationCtrl.create()
          .beforeStyles({ 'opacity': 1,'height': '83%','width': 'auto','min-width': '96vw','margin-top': '6%'})
          .addElement(baseEl.querySelector('.modal-wrapper')!)
          .fromTo('transform', 'scale(0)', 'scale(1)');

        return this.animationCtrl.create()
          .addElement(baseEl)
          .easing('ease-out')
          .duration(400)
          .addAnimation([backdropAnimation, wrapperAnimation]);
      }

      const leaveAnimation = (baseEl: any) => {
        return enterAnimation(baseEl).direction('reverse');
      }

      const modal = await this.modalController.create({
        component: MapsPage,
        componentProps: {"model_title": title},
        enterAnimation,
        leaveAnimation
      });
      return await modal.present();
    }
    async cartModal () {
      const enterAnimation = (baseEl: any) => {
        const backdropAnimation = this.animationCtrl.create()
        .beforeStyles({ 'width': '100vw','height': 'auto','min-height': '85vh',
          'margin-top': '16%','margin-bottom': '10%'})
          .addElement(baseEl.querySelector('ion-backdrop')!)
          .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

        const wrapperAnimation = this.animationCtrl.create()
          .beforeStyles({ 'opacity': 1,'width': '90vw','position': 'absolute',
          'right': '0px','left': 'auto','height': 'auto','min-height': '85vh',
          'margin-top': '6%','margin-bottom':' 0%' })
          .addElement(baseEl.querySelector('.modal-wrapper')!)
          .fromTo('transform', 'translateX(100%)', 'translateX(1%)');

        return this.animationCtrl.create()
          .addElement(baseEl)
          .easing('ease-out')
          .duration(400)
          .addAnimation([backdropAnimation, wrapperAnimation]);
      }

      const leaveAnimation = (baseEl: any) => {
        return enterAnimation(baseEl).direction('reverse');
      }

      const modal = await this.modalController.create({
        component: CartPage,
        enterAnimation,
        leaveAnimation,
        presentingElement: await this.modalController.getTop()
      });
      return await modal.present();
    }

    async searchModal () {
      const enterAnimation = (baseEl: any) => {
        const backdropAnimation = this.animationCtrl.create()
        .beforeStyles({ 'width': '100vw','height': 'auto','min-height': '85vh',
          'margin-top': '16%','margin-bottom': '10%'})
          .addElement(baseEl.querySelector('ion-backdrop')!)
          .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

        const wrapperAnimation = this.animationCtrl.create()
          .beforeStyles({ 'opacity': 1,'width': '90vw','position': 'absolute',
          'right': '0px','left': 'auto','height': 'auto','min-height': '85vh',
          'margin-top': '6%','margin-bottom':' 0%' })
          .addElement(baseEl.querySelector('.modal-wrapper')!)
          .fromTo('transform', 'translateX(100%)', 'translateX(1%)');

        return this.animationCtrl.create()
          .addElement(baseEl)
          .easing('ease-out')
          .duration(400)
          .addAnimation([backdropAnimation, wrapperAnimation]);
      }

      const leaveAnimation = (baseEl: any) => {
        return enterAnimation(baseEl).direction('reverse');
      }

      const modal = await this.modalController.create({
        component: CategorySearchPage,
        enterAnimation,
        leaveAnimation,
        id:"searchModal"
      });
      return await modal.present();
    }
  }
