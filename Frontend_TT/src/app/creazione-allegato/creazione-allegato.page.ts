import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, NavController, ToastController } from '@ionic/angular';
import { NuovoAllegatoApiService } from '../api/nuovo-allegato/nuovo-allegato-api.service';
import { SharedService } from '../services/shared/shared.service';
import { ActivatedRoute } from '@angular/router';
import { NuovoAllegatoTipologiaResponse } from '../interfaces/api/nuovo-allegato/nuovo-allegato-response-interface';
import { Form } from '@angular/forms';
import { AllegatiApiService } from '../api/allegati/allegati-api.service';
import { TesiService } from '../services/tesi/tesi.service';
import { TirocinioService } from '../services/tirocinio/tirocinio.service';

@Component({
  selector: 'app-creazione-allegato',
  templateUrl: './creazione-allegato.page.html',
  styleUrls: ['./creazione-allegato.page.scss'],
})
export class CreazioneAllegatoPage {
  @ViewChild('modalTipologia', { static: true }) modalTipologia!: IonModal;

  nomeAllegato: string = "";
  nota: string = "";

  tipologia: string = "";
  idTipologia: number = -1;

  selectedFileName: string = '';
  fileSelezionato: File | undefined = undefined;
  

  showedRicercaTipologia: NuovoAllegatoTipologiaResponse[] = [];
  tipologiaSelezionata: NuovoAllegatoTipologiaResponse | undefined = undefined;
  private ricercaTipologia: NuovoAllegatoTipologiaResponse[] = [];
  private vecchiaTipologia: NuovoAllegatoTipologiaResponse | undefined = undefined;
  showedTipologiaSelezionata: string = "";

  tipologie: NuovoAllegatoTipologiaResponse[] = [];

  constructor(private navCtrl: NavController, 
    private toastController: ToastController, 
    private sharedService: SharedService, 
    private nuovoAllegatoApiService: NuovoAllegatoApiService, 
    private route: ActivatedRoute,
    private tesiService: TesiService,
    private tirocinioService: TirocinioService ) {

    this.route.queryParams.subscribe(params => {
      this.tipologia = params["typeAllegato"];
      this.idTipologia = Number(params["id"]);

      if (this.tipologia !== null) {
        if (this.tipologia === "tesi") {
          this.nuovoAllegatoApiService.getTipologieAllegatiTesi().subscribe((res) => {
            this.tipologie = res;
            this.inizializzazione();
          });
        } else if (this.tipologia === "tirocinio") {
          this.nuovoAllegatoApiService.getTipologieAllegatiTirocinio().subscribe((res) => {
            this.tipologie = res;
            this.inizializzazione();
          });
        }
      }
    });
  }

  private inizializzazione(): void {
    this.ricercaTipologia = [...this.tipologie];
    this.showedRicercaTipologia = [...this.ricercaTipologia]
  }


  selectFile() {
    document.getElementById('fileInput')?.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileSelezionato = file;
      this.selectedFileName = file.name;
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

  async conferma() {
    
    if (this.tipologia === "tesi") {
      await this.tesiService.aggiornaTesi(this.idTipologia);
      const stato = this.tesiService.getTesi().tesi.statoTesi;
      if (stato === "CONCLUSA" || stato === "ARCHIVIATA") {
        this.navCtrl.navigateBack(['/allegati-tesi-tirocini']);
        return;
      }
      const ruolo = this.tesiService.getTesi().ruoloUtente;
      if (ruolo === null || ruolo === undefined || ruolo === "") {
        this.navCtrl.navigateBack(['/home-studente-tesi']);
        return;
      }
    } else if (this.tipologia === "tirocinio") {
      await this.tirocinioService.aggiornaTirocinio(this.idTipologia);
      const stato = this.tirocinioService.getTirocinio().tirocinio.statoTirocinio;
      if (stato === "COMPLEATATO" || stato === "ARCHIVIATO") {
        this.navCtrl.navigateBack(['/allegati-tesi-tirocini']);
        return;
      }
      const ruolo = this.tirocinioService.getTirocinio().ruoloUtente;
      if (ruolo === null || ruolo === undefined || ruolo === "") {
        this.navCtrl.navigateBack(['/home-studente-tirocinio']);
        return;
      }
    }

    if (this.tipologia !== null) {

      if (this.nomeAllegato === undefined || this.nomeAllegato === null || this.nomeAllegato === "")
        this.presentToast("Devi inserire il nome dell'allegato")
      else if (this.tipologiaSelezionata === undefined || this.tipologiaSelezionata === null)
        this.presentToast("Devi selezionare la tipologia");
      else if (this.fileSelezionato === undefined || this.fileSelezionato === null)
        this.presentToast("Devi allegare il file");
      else {
        if (this.tipologia === "tesi") {
          this.nuovoAllegatoApiService.aggiungiAllegatoTesi(this.idTipologia, this.nomeAllegato, this.tipologiaSelezionata.idTipologia, this.nota, this.fileSelezionato).subscribe((res) => {
            this.navCtrl.navigateBack(['/allegati-tesi-tirocini']);
          });
        } else if (this.tipologia === "tirocinio") {
          this.nuovoAllegatoApiService.aggiungiAllegatoTirocinio(this.idTipologia, this.nomeAllegato, this.tipologiaSelezionata.idTipologia, this.nota, this.fileSelezionato).subscribe((res) => {
            this.navCtrl.navigateBack(['/allegati-tesi-tirocini']);
          });
        }
      }
    } 
  }

  cancelTipologia(): void {
    this.tipologiaSelezionata = this.vecchiaTipologia;
    this.ricercaTipologia = [...this.tipologie];
    this.showRicercaTipologie();
    this.modalTipologia.dismiss(null, 'cancel');
  }

  confirmTipologia(): void {
    if (this.tipologiaSelezionata !== undefined) 
      this.showedTipologiaSelezionata = this.tipologiaSelezionata.nomeTipologia;

    this.vecchiaTipologia = this.tipologiaSelezionata;
    this.ricercaTipologia = [...this.tipologie];
    this.showRicercaTipologie();
    this.modalTipologia.dismiss(null, 'confirm');
  }

  handleInputT(event: any): void {
    const query = event.target.value.toLowerCase();
    this.ricercaTipologia = this.tipologie.filter((d) => d.nomeTipologia.toLowerCase().indexOf(query) > -1);
    this.showRicercaTipologie();
  }
  gestisciCheckTipologie(tipologia: NuovoAllegatoTipologiaResponse): void {
    this.tipologiaSelezionata = tipologia;
    this.showRicercaTipologie();
  }
  showRicercaTipologie(): void {
    if (this.tipologiaSelezionata === undefined) {
      this.showedRicercaTipologia = [...this.ricercaTipologia];
    } else {
      this.showedRicercaTipologia = [this.tipologiaSelezionata].concat(this.ricercaTipologia.filter((d) => d !== this.tipologiaSelezionata));
    }
  }
}