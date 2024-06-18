import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, RouterModule } from '@angular/router';
import { SharedService } from '../services/shared/shared.service';
import { AllegatiApiService } from '../api/allegati/allegati-api.service';
import { Allegato } from '../interfaces/primitive/allegato-interface';
import { AllegatiTesiTirocinioService } from '../services/allegati-tesi-tirocinio/allegati-tesi-tirocinio.service';
import { TesiService } from '../services/tesi/tesi.service';
import { TirocinioService } from '../services/tirocinio/tirocinio.service';
import { TesiResponse } from '../interfaces/api/tesi/tesi-response-interface';
import { TirocinioResponse } from '../interfaces/api/tirocinio/tirocinio-response-interface';
import { AllegatoService } from '../services/allegato/allegato.service';

@Component({
  selector: 'app-allegati-tesi-tirocini',
  templateUrl: './allegati-tesi-tirocini.page.html',
  styleUrls: ['./allegati-tesi-tirocini.page.scss'],
})
export class AllegatiTesiTirociniPage {

  isModificabile: boolean = false;

  typeObj: TesiResponse | TirocinioResponse | null = null;

  typeId: number = -1;
  type: string = "";
  stato: string = "";

  allegati: Allegato[] = [];
  allegatiPresenti: boolean = true;

  constructor( public router: RouterModule, 
    private allegatiTesiTirocinioService: AllegatiTesiTirocinioService, 
    private navCtr: NavController, 
    private route: ActivatedRoute, 
    private tesiService: TesiService,
    private tirocinioService: TirocinioService,
    private allegatoService: AllegatoService ) { 

    this.route.queryParams.subscribe(params => {
      if (params["type"] !== undefined && params["type"] !== null) 
        this.type = params["type"];
      if (params["id"] !== undefined && params["id"] !== null)
        this.typeId = Number(params["id"]);

      if (this.type === "tesi") {
        this.allegati = this.allegatiTesiTirocinioService.getTesiAllegati();
      } else if (this.type === "tirocinio") {
        this.allegati = this.allegatiTesiTirocinioService.getTirocinioAllegati();
      }
      this.preparazioneComponenti();

      if (this.stato === "ARCHIVIATO" || this.stato === "COMPLETATO" || this.stato === "ARCHIVIATA" || this.stato === "CONCLUSA") {
        this.isModificabile = false;
      } else {
        this.isModificabile = true;
      }
    });
  }

  ionViewWillEnter() {
    if (this.type === "tesi") {
      this.allegati = this.allegatiTesiTirocinioService.getTesiAllegati();
      this.isModificabile = this.allegatiTesiTirocinioService.checkAllegatiIsModificabile(this.tesiService.getTesi().tesi.statoTesi);
      this.preparazioneComponenti();
    } else if (this.type === "tirocinio") {
      this.allegati = this.allegatiTesiTirocinioService.getTirocinioAllegati();
      this.isModificabile = this.allegatiTesiTirocinioService.checkAllegatiIsModificabile(this.tirocinioService.getTirocinio().tirocinio.statoTirocinio);
      this.preparazioneComponenti();
    }
  }

  ionViewDidEnter() {
    this.aggiorna();
  }

  async refresh(event: any) {
    setTimeout(() => {
      this.aggiorna().then(
        (res) => {
          event.target.complete();
          if (!res) {
            if (this.type === "tesi") 
              this.navCtr.navigateBack(['/home-studente-tesi']);
            else if (this.type === "tirocinio")
              this.navCtr.navigateBack(['/home-studente-tirocinio']);
          } else {
          }
        },
        (err) => {
          event.target.complete()
        }
      );
    }, 1000);
  }

  private preparazioneComponenti(): void {
    if (this.allegati === undefined || this.allegati.length === 0)
      this.allegatiPresenti = false;
    else
      this.allegatiPresenti = true;
  }
  

  async aggiorna() {
    if (this.type === "tesi") {
      await this.tesiService.aggiornaTesi(this.typeId)
      const ruolo = this.tesiService.getTesi().ruoloUtente;
      if (!this.allegatiTesiTirocinioService.checkValiditaRuolo(ruolo)) {
        this.navCtr.navigateBack(['/home-studente-tesi']);
        return false;
      }
      const stato = this.tesiService.getTesi().tesi.statoTesi;
      this.isModificabile = this.allegatiTesiTirocinioService.checkAllegatiIsModificabile(stato);
      this.allegati = await this.allegatiTesiTirocinioService.preparaTesiAllegati(this.typeId)
    } else if (this.type === "tirocinio") {
      await this.tirocinioService.aggiornaTirocinio(this.typeId)
      const ruolo = this.tirocinioService.getTirocinio().ruoloUtente;
      if (!this.allegatoService.checkValiditaRuolo(ruolo)) {
        this.navCtr.navigateBack(['/home-studente-tirocinio']);
        return false;
      }
      const stato = this.tirocinioService.getTirocinio().tirocinio.statoTirocinio;
      this.isModificabile = this.allegatiTesiTirocinioService.checkAllegatiIsModificabile(stato);
      this.allegati = await this.allegatiTesiTirocinioService.preparaTirocinioAllegati(this.typeId);
    }
    this.preparazioneComponenti();
    return true;
  }

  async apriAllegato(allegato: Allegato) {
    if (await this.aggiorna()) {
      if (this.allegati.find(a => a.id === allegato.id) !== undefined) {
        const obj: NavigationExtras = {
          queryParams: {
            typeAllegato: this.type,
            typeId: this.typeId,
            idAllegato: allegato.id
          }
        }
        if (this.type === "tesi") {
          await this.allegatoService.aggiornaAllegatoTesi(allegato.id)
          await this.tesiService.aggiornaTesi(this.typeId)
        } else if (this.type === "tirocinio") {
          await this.allegatoService.aggiornaAllegatoTirocinio(allegato.id)
          await this.tirocinioService.aggiornaTirocinio(this.typeId)
        }
        this.navCtr.navigateForward(['/visualizzazione-allegato'], obj)
      }
    }
  }

  async aggiungiAllegato() {
    if (await this.aggiorna()) {
      if (this.isModificabile) {
        const obj: NavigationExtras = {
          queryParams: {
            typeAllegato: this.type,
            id: this.typeId
          }
        }
        this.navCtr.navigateForward(['/creazione-allegato'], obj)
      } 
    }
  }

}
