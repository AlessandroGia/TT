import { Injectable } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LoginResponse } from 'src/app/interfaces/api/login/login-response-interface';
import { Carriera } from 'src/app/interfaces/primitive/carriera-interface';
import { Insegnamento } from 'src/app/interfaces/primitive/insegnamento-interface';
import { Utente } from 'src/app/interfaces/primitive/utente-interface';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private initEsse3 : LoginResponse = {
    jwt: '',
    utente: {
      id: -1,
      nome: '',
      cognome: '',
      ruolo: ''
    },
    carriere: []
  }

  private esse3 = new BehaviorSubject<LoginResponse>(this.initEsse3);
  esse3$ = this.esse3.asObservable();

  constructor() { }

  // Imposta l'oggetto di login
  setEsse3(res: LoginResponse) {
    this.esse3.next(res);
  }

  // Restituisce l'oggetto di login
  getEsse3() {
    return this.esse3.getValue();
  }
  // Restituisce il JWT
  getJwt(): string {
    return this.esse3.getValue().jwt;
  }
  // Restituisce L'Utente 
  getUtente(): Utente {
    return this.esse3.getValue().utente;
  }
  // Restituisce le carriere
  getCarriere(): Carriera[] {
    return this.esse3.getValue().carriere;
  }
  // Restituisce gli insegnamenti di una determinata carriera
  getInsegnamenti(nomeCDS: string): Insegnamento[] {
    return this.esse3.getValue().carriere.find(c => c.nomeCDS === nomeCDS)?.insegnamenti || [];
  }

  include(utenti: Utente[], utente: Utente): boolean {
    return utenti.find(ui => ui.id === utente.id) !== undefined
  }

  // Restituisce tutti i docenti di una carriera
  getAllDocentiCarriera(nomeCDS: string): Utente[] {

    let docenti: Utente[] = [];

    const carriere: Carriera[] = this.esse3.getValue().carriere;

    carriere.forEach(c => {
      if (c.nomeCDS === nomeCDS) {
        c.insegnamenti.forEach(i => {
          i.docenti.forEach(d => {
            if(!this.include(docenti, d)) {
              docenti.push(d);
            }
          });
        });
      }
    });

    return docenti;
  }

  // Cancella l'oggetto di login
  clearEsse3() {
    this.esse3.next(this.initEsse3);
  }

  // Restituisce true se l'oggetto di login è settato
  isEsse3Set() {
    return this.esse3.getValue().jwt !== '';
  }
  // Restituisce true se l'utente è un docente
  isDocente(): boolean {
    return this.esse3.getValue().utente.ruolo === 'DOCENTE';
  }
  // Restituisce true se l'utente è uno studente
  isStudente(): boolean {
    return this.esse3.getValue().utente.ruolo === 'STUDENTE';
  }

  // Restituisce l'oggetto usato per la condivisuione dei dati tra le pagine
  passObj<I>(res: I): NavigationExtras  {
    return {
      queryParams: {
        obj: JSON.stringify(res)
      }
    }
  }

  // Effettua il log out dell'utente
  logOut() {
    this.clearEsse3();
  }

  // Ritorna i docenti relativi a un insegamento
  getDocentiFromInsegnamento(insegnamento: Insegnamento, nomeCds: string): Utente[] {

    let ins: Insegnamento | undefined = this.getInsegnamenti(nomeCds).find(i => i.nome === insegnamento.nome)
    if (ins != undefined) 
      return ins.docenti;
    
    return []
  }

  // Ritorna gli insegnamenti relativi ad un docente 
  getInsegnamentiFromDocente(docente: Utente, nomeCds: string) {
    return this.getInsegnamenti(nomeCds).filter(i => i.docenti.includes(docente));
  }

}
