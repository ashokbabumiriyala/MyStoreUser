import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-category-search',
  templateUrl: './category-search.page.html',
  styleUrls: ['./category-search.page.scss'],
})
export class CategorySearchPage implements OnInit {

  constructor(private router:Router, private modalCtrl: ModalController) { }

  ngOnInit() {
  }
  dismiss() {
    if(document.getElementById('searchModal')) {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  } else {
    return;
  }
  }
 navigateTo(ele) {
  this.dismiss();
   if(ele == 'product') {
    this.router.navigate(['/product-info']);
   } else {
    this.router.navigate(['/service-info']);
   }
 }
}
