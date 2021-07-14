import { Component, OnInit, Input  } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-termsandconditions',
  templateUrl: './termsandconditions.component.html',
  styleUrls: ['./termsandconditions.component.scss'],
})
export class TermsandconditionsComponent implements OnInit {
  @Input() modal: boolean;
  constructor( private modalController: ModalController) { }

  ngOnInit() {
    //this.navParams.get('modal');
    //NavParams
  }
  closeModal() { this.modalController.dismiss(); }

}
