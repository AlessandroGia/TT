import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NavController, ToastController } from '@ionic/angular';
import { SharedService } from '../shared/shared.service';
import { LogoutService } from '../logout/logout.service';


@Injectable({
  providedIn: 'root'
})
export class HttpinterceptorService implements HttpInterceptor {

  constructor(
    private navController: NavController,
    private toastController: ToastController,
    private sharedService: SharedService,
    private logoutService: LogoutService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    
    if (!req.url.includes('login')) {
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${this.sharedService.getJwt()}`)
      });
    }
    
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('Intercepted HTTP call', error);
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Errore di rete`;
        } else {
          switch (error.status) {
            case 401:
              errorMessage = 'Credenziali non valide';
              break;
            case 403:
              errorMessage = 'Sessione scaduta';
              this.navController.navigateRoot('/login');
              console.log('Sessione scaduta');
              break;
            case 503:
              errorMessage = 'Errore del server';
              break;
            default:
              errorMessage = `Errore generico`;
              break;
          }
        }
        this.showToast(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

}
