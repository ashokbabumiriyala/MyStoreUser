import { Component, OnInit } from '@angular/core';
import { ModalController, AnimationController } from '@ionic/angular';
import { CartPage } from './Shared/cart/cart.page';
import { MapsPage } from './Shared/maps/maps.page';
import { CategorySearchPage } from './category-search/category-search.page';
import { Platform } from '@ionic/angular';
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
import { HelperService} from 'src/app/common/helper.service'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit{
  showHead:boolean = true;
  public appPages = [
    { title: 'Profile', url: '/signup', icon: 'person-outline' },
    { title: 'Previous Product Orders', url: '/product-orders', icon: 'aperture-outline' },
    { title: 'Previous Service Orders', url: '/service-orders', icon: 'color-filter-outline' },
    { title: 'Raise A Complaint', url: '/complaint', icon: 'chatbox-ellipses-outline' },
    { title: 'About My3Karrt', url: '/information-pages/about-us', icon: 'extension-puzzle-outline' },
    { title: 'Terms and Conditions', url: '/information-pages/terms-conditions', icon: 'cog-outline' },
    { title: 'Shipping Policies', url: '/information-pages/shipping-policies', icon: 'bus-outline' },
    { title: 'Privacy Policies', url: '/information-pages/privacy-policies', icon: 'prism-outline' },
    { title: 'Refunds & Cancellations', url: '/information-pages/refunds-cancellation', icon: 'wallet-outline' },
    { title: 'Contact Us', url: '/information-pages/contact-us', icon: 'call-outline' }

  ];
  constructor(public modalController: ModalController,
    public animationCtrl: AnimationController, private fcm: FCM, private platform: Platform) {
      this.initializeApp();
     }
    ngOnInit(): void {

    }
     initializeApp() {
      this.platform.ready().then(() => {
        if (this.platform.is('android') || this.platform.is('ios')) {
          console.log("running on mobile device!");
          sessionStorage.setItem('mobile', 'true');
          // subscribe to a topic
          this.fcm.subscribeToTopic('Users');

          // get FCM token
          this.fcm.getToken().then(token => {
            console.log(token);
            sessionStorage.setItem("PushToken",token);
          });

          // ionic push notification example
          this.fcm.onNotification().subscribe(data => {
            console.log(data);
            if (data.wasTapped) {
              console.log('Received in background');
            } else {
              console.log('Received in foreground');
            }
          });

          // refresh the FCM token
          this.fcm.onTokenRefresh().subscribe(token => {
            console.log(token);
            sessionStorage.setItem("PushToken",token);
          });
        } else {
          sessionStorage.setItem('mobile', 'false');
        }
      });
    }
    async presentModal() {
      const enterAnimation = (baseEl: any) => {
        const backdropAnimation = this.animationCtrl.create()
          // .beforeStyles({ 'opacity': 1,'height': '83%','width': 'auto','min-width': '96vw','margin-top': '16%'})
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
