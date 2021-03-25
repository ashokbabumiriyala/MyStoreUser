import { Component, OnInit  } from '@angular/core';
import { ModalController} from '@ionic/angular';
 
@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss']
})
export class MapsPage implements OnInit {
  selectedRadio:any = "primary";
  mapImage:boolean = false;
  constructor(public modalCtrl: ModalController) { }
  ngOnInit() {
    
  }
 
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
  updateRadio(eve){
    
    if(eve.target.value == 'secondary') {
      this.mapImage = true;
    } else {
      this.mapImage = false;
    }
  }
}
