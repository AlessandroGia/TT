import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { AttivitaApiService } from '../api/attivita/attivita-api.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../services/shared/shared.service';
import { Attivita } from '../interfaces/primitive/attivita-interface';
import { Tirocinio } from '../interfaces/primitive/tirocinio-interface';
import { AttivitaService } from '../services/attivita/attivita.service';
import { TirocinioService } from '../services/tirocinio/tirocinio.service';

@Component({
  selector: 'app-visualizzazione-attivita',
  templateUrl: './visualizzazione-attivita.page.html',
  styleUrls: ['./visualizzazione-attivita.page.scss'],
})
export class VisualizzazioneAttivitaPage {

  isModificabile: boolean = false;
  ruoloUtente: string | null = null

  attivita: Attivita | null = null;

  attivitaId: number = -1;
  tirocinioId: number = -1;

  data: string = "";
  orarioEntrata: string = "";
  orarioUscita: string = "";
  durata: string = "";
  attivitaSvolta: string = "";

  nota: string = "";

  constructor(private alertController: AlertController, 
    private toastController: ToastController, 
    private navCtrl: NavController, 
    private sharedService: SharedService, 
    private route: ActivatedRoute, 
    private attivitaApiService: AttivitaApiService,
    private attivitaService: AttivitaService,
    private tirocinioService: TirocinioService) { 
    
    this.attivita = this.attivitaService.getAttivita();
    const tirocinio = this.tirocinioService.getTirocinio();
    this.isModificabile = this.attivitaService.checkIsModificabile(tirocinio.tirocinio.statoTirocinio, tirocinio.ruoloUtente);

    this.route.queryParams.subscribe(params => {
      this.attivitaId = JSON.parse(params["attivitaId"]);
      this.tirocinioId = JSON.parse(params["tirocinioId"]);

      this.preparazioneComponenti();
    });
  }

  ionViewWillEnter() {
    this.attivita = this.attivitaService.getAttivita();
    this.preparazioneComponenti();
    const tirocinio = this.tirocinioService.getTirocinio();
    this.isModificabile = this.attivitaService.checkIsModificabile(tirocinio.tirocinio.statoTirocinio, tirocinio.ruoloUtente);
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
      this.isModificabile = this.attivitaService.checkIsModificabile(tirocinio.tirocinio.statoTirocinio, tirocinio.ruoloUtente);
      this.attivita = await this.attivitaService.aggiornaAttivita(this.attivitaId);
      this.preparazioneComponenti();
      return true;
    }
    this.navCtrl.navigateBack(['/home-studente-tirocinio']);
    return false;
  }

  preparazioneComponenti() {
    if (this.attivita !== null) {
      this.data = this.attivita.data;
      this.orarioEntrata = this.attivita.orarioEntrata;
      this.orarioUscita = this.attivita.orarioUscita;
      const ore = this.attivita.ore;
      const minuti = this.attivita.minuti;
      this.attivitaSvolta = this.attivita.attivitaSvolta;
      this.nota = this.attivita.attivitaSvolta;

      if ((minuti > 0 && ore == 0) || (minuti >= 0 && ore > 0)) {
        if (!ore) {
          if (minuti == 1) 
            this.durata = `${minuti} minuto`
          else
            this.durata = `${minuti} minuti`
        } else {
          if (!minuti) {
            if (ore == 1)
              this.durata = `${ore} ora`
            else
              this.durata = `${ore} ore`
          } else {
            if (ore == 1) {
              if (minuti == 1)
                this.durata = `${ore} ora e ${minuti} minuto`
              else
                this.durata = `${ore} ora e ${minuti} minuti`
            } else {
              if (minuti == 1)
                this.durata = `${ore} ore e ${minuti} minuto`
              else
                this.durata = `${ore} ore e ${minuti} minuti`
            }
          }
        }
      }
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
  }

  async applicaModifiche() {
    const nota = this.nota;
    if (await this.aggiorna()) {
      if (this.attivita !== null) {
        if ((nota !== "" || nota !== null || nota !== undefined) && nota !== this.attivita.attivitaSvolta) {
          this.attivita.attivitaSvolta = nota;
          this.attivitaApiService.modificaAttivita(this.attivita.id, nota).subscribe((res) => {
            this.navCtrl.navigateBack(['/elenco-attivita-tirocinio']);
          });
        }
      }
    }
  }

  async eliminaAttivita() {
    if (await this.aggiorna()) {
      const alert = await this.alertController.create({
        header: "Confermi di voler eliminare l'attività?",
        buttons: [
          {
            text: 'Annulla',
            role: 'cancel',
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: async () => {
              if (this.attivita !== null) {
                if (await this.aggiorna()) {
                  this.attivitaApiService.cancellaAttivita(this.attivita.id).subscribe((res) => {
                    this.navCtrl.navigateBack(['/elenco-attivita-tirocinio']);
                  });
                }
              }
            }
          },
        ],
      });
      await alert.present();
    }
  }
}