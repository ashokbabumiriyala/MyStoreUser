import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-info',
  templateUrl: './service-info.page.html',
  styleUrls: ['./service-info.page.scss'],
})
export class ServiceInfoPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }
  getProducts() {
    this.router.navigate(['/service-list'])
  }
}
