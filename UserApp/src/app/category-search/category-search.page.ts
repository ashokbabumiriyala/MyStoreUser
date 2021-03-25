import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-search',
  templateUrl: './category-search.page.html',
  styleUrls: ['./category-search.page.scss'],
})
export class CategorySearchPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }
 navigateTo(ele) {
   if(ele == 'product') {
    this.router.navigate(['/product-info']);
   } else {
    this.router.navigate(['/service-info']);
   }
 }
}
