import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { LoginPOSTRequest } from 'src/app/interfaces/api/login/login-request-interface';
import { LoginResponse } from 'src/app/interfaces/api/login/login-response-interface';
import { ApiServiceService } from 'src/app/services/api/api-service.service';
import { NavController, ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class LoginApiService {

  url = "";

  constructor(private http: HttpClient, 
    private ApiService: ApiServiceService,
    private navController: NavController,
    private toastController: ToastController ) {
    this.url = ApiService.url + "/login";
  }

  // In caso di utente non registrato, tenta il login su Esse3 e registra l’utente all’interno del DB, dopodiché restituisce il jwt.
  // Se l’utente è già registrato nel DB restituisce il jwt.
  // Se l’utente è uno studente, restituisce anche le carriere attive con i relativi insegnamenti e docenti.
  login(nomeUtente: string, password: string): Observable<LoginResponse> {
    const req: LoginPOSTRequest = {
      nomeUtente,
      password,
    };
    return this.http.post<LoginResponse>(this.url, req);
  }
}
