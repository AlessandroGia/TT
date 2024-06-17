import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Tirocinio } from '../interfaces/primitive/tirocinio-interface';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { SharedService } from '../services/shared/shared.service';
import { ElencoAttivitaApiService } from '../api/elenco-attivita/elenco-attivita-api.service';
import { Attivita } from '../interfaces/primitive/attivita-interface';
import { ElencoAttivitaResponse } from '../interfaces/api/elenco-attivita/elenco-attivita-response-interface';
import { TirocinioService } from '../services/tirocinio/tirocinio.service';
import { TirocinioResponse } from '../interfaces/api/tirocinio/tirocinio-response-interface';
import { ElencoAttivitaService } from '../services/elenco-attivita/elenco-attivita.service';
import { AttivitaService } from '../services/attivita/attivita.service';

@Component({
  selector: 'app-elenco-attivita-tirocinio',
  templateUrl: './elenco-attivita-tirocinio.page.html',
  styleUrls: ['./elenco-attivita-tirocinio.page.scss'],
})
export class ElencoAttivitaTirocinioPage {

  oreSuperate: boolean = false;

  isModificabile: boolean = false;
  completamento: string = "";

  tirocinio: TirocinioResponse | null = null;
  tirocinioId: number = -1;

  elencoAttivita: ElencoAttivitaResponse | null = null;
  attivitaPresenti: boolean = true;

  constructor(private navCtrl: NavController, 
    private route: ActivatedRoute, 
    private sharedService: SharedService, 
    private elencoAttivitaApiService: ElencoAttivitaApiService, 
    private tirocinioService: TirocinioService,
    private elencoAttivitaService: ElencoAttivitaService,
    private attivitaService: AttivitaService) { 

    //this.tirocinio = this.tirocinioService.getTirocinio();
    this.elencoAttivita = this.elencoAttivitaService.getAttivita();
    this.preparazioneComponenti();
    const tirocinio = this.tirocinioService.getTirocinio();
    this.isModificabile = this.elencoAttivitaService.checkIsModificabile(tirocinio.tirocinio.statoTirocinio, tirocinio.ruoloUtente);

    this.route.queryParams.subscribe(params => {
      if (params["id"] !== undefined && params["id"] !== null)
        this.tirocinioId = Number(params["id"]);
    });

  }

  ionViewWillEnter() {
    this.elencoAttivita = this.elencoAttivitaService.getAttivita();
    this.preparazioneComponenti();
    const tirocinio = this.tirocinioService.getTirocinio();
    this.isModificabile = this.elencoAttivitaService.checkIsModificabile(tirocinio.tirocinio.statoTirocinio, tirocinio.ruoloUtente);
    this.aggiorna();
  }

  async refresh(event: any) {
    setTimeout(async () => {
      await this.aggiorna();
      event.target.complete();
    }, 1000);
  }

  private async aggiorna() {
    const tirocinio = await this.tirocinioService.aggiornaTirocinio(this.tirocinioId);
    if (tirocinio !== undefined && tirocinio !== null) {
      if (!this.tirocinioService.checkValiditaRuolo(tirocinio.ruoloUtente)) {
        this.navCtrl.navigateBack(['/home-studente-tirocinio']);
        return false;
      }
      this.isModificabile = this.elencoAttivitaService.checkIsModificabile(tirocinio.tirocinio.statoTirocinio, tirocinio.ruoloUtente);
      this.elencoAttivita = await this.elencoAttivitaService.aggiornaAttivita(this.tirocinioId);
      this.preparazioneComponenti();
      return true;
    }
    this.navCtrl.navigateBack(['/home-studente-tirocinio']);
    return false;
  }

  private preparazioneComponenti() {
    if (this.elencoAttivita !== null && this.elencoAttivita !== undefined) {
      if (this.elencoAttivita.elencoAttivita === null || this.elencoAttivita.elencoAttivita === undefined || this.elencoAttivita.elencoAttivita.length === 0) {
        this.attivitaPresenti = false;
      } else {
        this.attivitaPresenti = true;
      }
      this.completamento = `Completamento ${this.elencoAttivita.oreSvolte}/${this.elencoAttivita.durata}`;
      this.oreSuperate = this.elencoAttivita.oreSvolte >= this.elencoAttivita.durata;
    }
  }

  ionViewDidEnter() { }

  getDurata(ore: number, minuti: number): string {
    if ((minuti > 0 && ore == 0) || (minuti >= 0 && ore > 0)) {
      if (!ore) {
        if (minuti == 1) 
          return `${minuti} minuto`
        else
          return `${minuti} minuti`
      } else {
        if (!minuti) {
          if (ore == 1)
            return `${ore} ora`
          else
            return `${ore} ore`
        } else {
          if (ore == 1) {
            if (minuti == 1)
              return `${ore} ora e ${minuti} minuto`
            else
              return `${ore} ora e ${minuti} minuti`
          } else {
            if (minuti == 1)
              return `${ore} ore e ${minuti} minuto`
            else
              return `${ore} ore e ${minuti} minuti`
          }
        }
      }
    }
    return "";
  }

  async apriAttivita(attivita: Attivita) {
    if (await this.aggiorna()) {
      if (this.elencoAttivita?.elencoAttivita.find(a => a.id === attivita.id) !== undefined) {
        if (attivita !== null) {
          const obj: NavigationExtras = {
            queryParams: {
              attivitaId: Number(attivita.id),
              tirocinioId: Number(this.tirocinioId),
            }
          }
          await this.tirocinioService.aggiornaTirocinio(this.tirocinioId);
          await this.attivitaService.aggiornaAttivita(attivita.id);
          this.navCtrl.navigateForward(['/visualizzazione-attivita'], obj);
        }
      }
    }
  }

  async aggiungiAttivita() {
    if (await this.aggiorna()) {
      const obj: NavigationExtras = {
        queryParams: {
          id: Number(this.tirocinioId),
        }
      }
      this.navCtrl.navigateForward(['/creazione-attivita'], obj);
    }
  }

}
