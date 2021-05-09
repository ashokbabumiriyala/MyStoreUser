import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
class ID {
  Id: number;
}
@Injectable({
  providedIn: 'root'
})
export class CommonApiServiceCallsService {
  private httpHeaders: HttpHeaders;
  constructor(private httpClient: HttpClient,private toastController:ToastController) { }
  createHttpHeader() {
    this.httpHeaders = new HttpHeaders();
    let authToken: any;
    authToken = JSON.parse(sessionStorage.getItem('AuthToken'));
    if (authToken != null && authToken !== undefined) {
      this.httpHeaders = this.httpHeaders.set('Access-Control-Allow-Origin', '*');
      this.httpHeaders = this.httpHeaders.set('Content-Type', 'application/json');
      this.httpHeaders = this.httpHeaders.set('Authorization', 'Bearer ' + authToken);
    }
  }
  getAll(apiUrl: string): Observable<any> {
   // this.createHttpHeader();
    return this.httpClient
      .get(apiUrl)
      .pipe(catchError(error => this.handleError(error)));
  }
  get(apiUrl: string, id: number): Observable<any> {
    //this.createHttpHeader();
    const resource = new ID();
    resource.Id = id;
    return this.httpClient
      .post(apiUrl, resource)
      .pipe(catchError(error => this.handleError(error)));
  }
  getWithResource(apiUrl: string, resource: any): Observable<any> {
   // this.createHttpHeader();
    return this.httpClient
      .post(apiUrl, resource)
      .pipe(catchError(error => this.handleError(error)));
  }
  select(apiUrl: string, resource: any) {
   // this.createHttpHeader();
    return this.httpClient
      .post(apiUrl, resource)
      .pipe(catchError(error => this.handleError(error)));
  }
  create(apiUrl: string, resource: any): Observable<any> {
   // this.createHttpHeader();
    return this.httpClient
      .post(apiUrl, resource)
      .pipe(catchError(error => this.handleError(error)));
  }
  update(apiUrl: string, resource: any): Observable<any> {
    this.createHttpHeader();
    return this.httpClient
      .patch(apiUrl, resource)
      .pipe(catchError(error => this.handleError(error)));
  }
  delete(apiUrl: string, resource: any): Observable<any> {
    //this.createHttpHeader();
    return this.httpClient
      .delete(apiUrl, resource)
      .pipe(catchError(error => this.handleError(error)));
  }
  getFileData(apiUrl: string, id: number): Observable<any> {
   // this.createHttpHeader();
    const resource = new ID();
    resource.Id = id;

    return this.httpClient
      .post(apiUrl, resource, { headers: this.httpHeaders, responseType: 'blob' })
      .pipe(catchError(error => this.handleError(error)));
  }
  getFileDataWithResouce(apiUrl: string, resource: any): Observable<any> {
    //this.createHttpHeader();
    return this.httpClient
      .post(apiUrl, resource, { headers: this.httpHeaders, responseType: 'blob' })
      .pipe(catchError(error => this.handleError(error)));
  }
  private handleError(error: Response) {
    if (error.status === 404) {
      return throwError(console.log(error));
    }
    if (error.status === 400) {
      return throwError(console.log(error));
    }
    if (error.status === 202) {
      return throwError(console.log(error));
    }
    return throwError(console.log(error));
  }

   async presentToast(data: string,tostarColor:string) {
    const toast = await this.toastController.create({
      message: data,
      duration: 2000,
      position: 'top',
      color: tostarColor
    });
    toast.present();
  }

}

