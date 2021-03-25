import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
  constructor(public modalController: ModalController) {}
  async presentModal() {
    const modal = await this.modalController.create({
      component: MapsPage,
      cssClass: 'map',
    });
    return await modal.present();
  }
}
