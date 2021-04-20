import { Component } from '@angular/core';
import { ModalController, AnimationController } from '@ionic/angular';
import { CartPage } from './Shared/cart/cart.page';
import { MapsPage } from './Shared/maps/maps.page';
import { CategorySearchPage } from './category-search/category-search.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']  
})
export class AppComponent {
  showHead:boolean = true;
  public appPages = [
    { title: 'Profile', url: '/folder/Inbox', icon: 'person-outline' },
    { title: 'Previous Product Orders', url: '/folder/Outbox', icon: 'aperture-outline' },
    { title: 'Previous Service Orders', url: '/folder/Favorites', icon: 'color-filter-outline' },
    { title: 'Raise A Complaint', url: '/folder/Favorites', icon: 'chatbox-ellipses-outline' }
  ];
  constructor(public modalController: ModalController,
    public animationCtrl: AnimationController) { }
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
