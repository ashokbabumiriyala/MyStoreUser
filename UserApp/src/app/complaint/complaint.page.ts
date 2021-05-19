import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.page.html',
  styleUrls: ['./complaint.page.scss'],
})
export class ComplaintPage implements OnInit {
  issues: any = [];
  issuesGrid:boolean = true;
  constructor() { }

  ngOnInit() {
    this.issues = [
      {id:1, description:'Product'},
      {id:2, description:'Service'},
      {id:3, description:'Delivery'},
      {id:4, description:'Items'},
      {id:5, description:'Cost'},
      {id:6, description:'Transction'},
      {id:7, description:'Others'}
    ]
  }
  createIssue() {
    this.issuesGrid = false;
  }
  ionViewDidLeave() {
    this.issuesGrid = true;
  }
}
