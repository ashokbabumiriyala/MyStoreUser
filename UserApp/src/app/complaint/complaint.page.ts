import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import { HelperService } from '../common/helper.service';
import {ComplaintService} from './complaint.service'

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.page.html',
  styleUrls: ['./complaint.page.scss'],
})
export class ComplaintPage implements OnInit {
  issues: any = [];
  issuesGrid:boolean = true;
  complaintFormGroup:FormGroup;
  complaintList:any = [];
  mobileApp:any;
  selectedDocs:any=[];
  isFormSubmitted:boolean;
  @ViewChild('selectedWebDocs') selectedWebDocs;
  constructor(private camera: Camera, private actionSheetController: ActionSheetController,
    private helperService: HelperService, private complaintService: ComplaintService) { }

  ngOnInit() {
    if (sessionStorage.getItem('mobile') == 'true') {
      this.mobileApp = true;
    } else {
      this.mobileApp = false;
    }
    this.loadComplaints();
    this.createComplaintForm();
  }
  async loadComplaints(){
    const loadingController = await this.helperService.createLoadingController("loading");
    await loadingController.present();
   const dataObject={"UserId": Number(sessionStorage.getItem('UserId'))};
   await this.complaintService.getComplaints('UserComplaintSelect', dataObject)
    .subscribe((data: any) => {
 
      this.issues=data.issueRelatedList;
     
      this.complaintList = data.complaintList;
      this.issues = [
        {id:1, description:'Product'},
        {id:2, description:'Service'},
        {id:3, description:'Delivery'},
        {id:4, description:'Items'},
        {id:5, description:'Cost'},
        {id:6, description:'Transaction'},
        {id:7, description:'Others'}
      ];
      loadingController.dismiss();
    },
    (error: any) => {
      loadingController.dismiss();
    });

  }
  get IssueRelatedTo(){
    return this.complaintFormGroup.get('IssueRelatedTo');
  }
  get OrderId(){
    return this.complaintFormGroup.get('OrderId');
  }
  get IssueDescription(){
    return this.complaintFormGroup.get('IssueDescription');
  }
  private createComplaintForm(){
    this.complaintFormGroup = new FormGroup({
      IssueRelatedTo: new FormControl('', Validators.required),
      OrderId: new FormControl('', Validators.required)  ,
      IssueDescription: new FormControl('', Validators.required)
    });
  }
  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }
  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    }

    this.camera.getPicture(options).then((imageData) => {
    // imageData is a file URI
      let base64Img = 'data:image/jpeg;base64,' + imageData;
      this.getblobObject(base64Img);
    }, (err) => {
      // Handle error

    });
  }
  selectedImgWeb(data){
    var files = data.target.files;
    for(let i = 0 ; i <files.length; i++) {
      if (files[i]) {
        var reader = new FileReader();
        reader.onload =this._handleReaderLoaded.bind(this);
        reader.readAsBinaryString(files[i]);
      }
    }
  }
  async _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    let base64textString= btoa(binaryString);
    await this.getblobObject('data:image/jpeg;base64,' + base64textString)
   }
  async getblobObject(base64Data){
    const base64 = await fetch(base64Data);
    const blob = await base64.blob();
    this.selectedDocs.push(blob);
  }
  createIssue() {
    this.issuesGrid = false;
  }
  ionViewDidLeave() {
    this.issuesGrid = true;
    this.complaintFormGroup.reset();
  }
  async raiseComplaint(){
    this.isFormSubmitted=true;
    if (this.complaintFormGroup.invalid) {
      return;
    } else{
      let formData = new FormData();
      formData.append('UserId', sessionStorage.getItem('UserId'));
      formData.append('IssueRelatedToId', this.IssueRelatedTo.value);
      formData.append('OrderId', this.OrderId.value);
      formData.append('IssueDescription', this.IssueDescription.value);
      for (var j = 0; j < this.selectedDocs.length; j++) {
        formData.append("files", this.selectedDocs[j], 'ComplaintImage' + j + '.jpg');
      }
      const loadingController = await this.helperService.createLoadingController("loading");
      await loadingController.present();
      await this.complaintService.raiseComplaint('UserComplaintInsert', formData)
      .subscribe((data: any) => {
        loadingController.dismiss();
        this.complaintFormGroup.reset();
        this.selectedDocs = [];
        if (this.selectedWebDocs) {
          this.selectedWebDocs.nativeElement.value = "";
        }
        this.issuesGrid=true;
        this.isFormSubmitted=false;
        this.helperService.presentToast("Complaint raised Successfully","success");
        this.loadComplaints();
      },
        (error: any) => {
          loadingController.dismiss();
          this.helperService.presentToast(error,"danger");
        });
    }
  }
}
