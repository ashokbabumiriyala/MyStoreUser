import { Component } from '@angular/core';
import { ModalController, AnimationController } from '@ionic/angular';
import { CartPage } from './Shared/cart/cart.page';
import { MapsPage } from './Shared/maps/maps.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']  
})
export class AppComponent {
  showHead:boolean = true;
  public appPages = [
    { title: 'Profile', url: '/folder/Inbox', icon: 'person-outline' },
    { title: 'product Orders', url: '/folder/Outbox', icon: 'aperture-outline' },
    { title: 'Service Orders', url: '/folder/Favorites', icon: 'color-filter-outline' },
    { title: 'Raise A Complaint', url: '/folder/Favorites', icon: 'chatbox-ellipses-outline' }
  ];
  constructor(public modalController: ModalController,
    public animationCtrl: AnimationController) { }
    async presentModal() {
      const enterAnimation = (baseEl: any) => {
        const backdropAnimation = this.animationCtrl.create()
          .addElement(baseEl.querySelector('ion-backdrop')!)
          .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');         

        const wrapperAnimation = this.animationCtrl.create()
          .beforeStyles({ 'opacity': 1 })
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
          .addElement(baseEl.querySelector('ion-backdrop')!)
          .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');         

        const wrapperAnimation = this.animationCtrl.create()
          .beforeStyles({ 'opacity': 1 })
          .addElement(baseEl.querySelector('.modal-wrapper')!)
          .fromTo('transform', 'translateX(100%)', 'translateX(15%)');
  
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
        leaveAnimation
      });
      return await modal.present();
    }
  }
