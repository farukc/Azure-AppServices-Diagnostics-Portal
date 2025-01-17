import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AlertService } from './alert.service';
import { AlertInfo, ConfirmationOption, UserAccessStatus } from '../models/alerts';
import { HealthStatus } from "diagnostic-data";

@Injectable({
  providedIn: 'root'
})
export class AppLensInterceptorService implements HttpInterceptor {
  constructor(private _alertService: AlertService) { }

  raiseAlert(event){
    let errormsg = event.error;
    errormsg = errormsg.replace(/\\"/g, '"');
    errormsg = errormsg.replace(/\"/g, '"');
    let errobj = JSON.parse(errormsg);
    let message = errobj.DetailText;
    message = message.trim();
    if (message) {
      if (message[message.length-1] == '.') {
        message = message.substring(0, message.length - 1);
      }
    }
    let alertInfo: AlertInfo = {
        header: "Do you accept the risks?",
        details: `${message}. If you choose to proceed, we will be logging it for audit purposes.`,
        seekConfirmation: true,
        confirmationOptions: [{label: 'Yes, proceed', value: 'yes'}, {label: 'No, take me back', value: 'no'}],
        alertStatus: HealthStatus.Warning
    };
    this._alertService.sendAlert(alertInfo);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.url.includes("api/invoke")) {
        }
        return event;
      }), catchError((error: HttpErrorResponse) => {
          let errorObj = JSON.parse(error.error);
        if (error.status === 403 && error.url.includes("api/invoke") && errorObj.Status == UserAccessStatus.ResourceNotRelatedToCase) {
          this.raiseAlert(error);
        }
        else if ((error.status === 401 || error.status === 403) && error.url.includes("api/invoke")) {
          this._alertService.notifyUnAuthorized(error);
        }
        return Observable.throw(error);
      }));
  }
}