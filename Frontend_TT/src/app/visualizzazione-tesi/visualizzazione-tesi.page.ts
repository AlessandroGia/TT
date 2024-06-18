import { HomeTesiService } from './../services/home-tesi/home-tesi.service';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { IonModal, NavController } from '@ionic/angular';
import { TesiApiService } from '../api/tesi/tesi-api.service';
import { SharedService } from '../services/shared/shared.service';
import { Utente } from '../interfaces/primitive/utente-interface';
import { AllegatiTesiTirocinioService } from '../services/allegati-tesi-tirocinio/allegati-tesi-tirocinio.service';
import { TesiService } from '../services/tesi/tesi.service';
import { TesiResponse } from '../interfaces/api/tesi/tesi-response-interface';

@Component({
  selector: 'app-visualizzazione-tesi',
  templateUrl: './visualizzazione-tesi.page.html',
  styleUrls: ['./visualizzazione-tesi.page.scss'],
})
export class VisualizzazioneTesiPage {
  @ViewChild('modalCorrelatori', { static: true }) modalCorrelatori!: IonModal;

  tesiId: number = -1;
  tesi : TesiResponse | null = null;

  ruoloUtente: string | null = null;

  isModificabile: boolean = false;

  dataDiscussione: string;
  showCalendar: boolean;
  
  alertFlag: boolean = false;

  correlatori: Utente[] = [];
  
  showedRicercaCorrelatori: Utente[] = [...this.correlatori];
  correlatoriSelezionati: Utente[] = [];
  private ricercaCorrelatori: Utente[] = [...this.correlatori];
  private vecchiCorrelatori: Utente[]  = [];
  private logEventRicercaCorrelatori: string =  "";
  showedCorrelatoriSelezionati: string = "";


  constructor( private alertController: AlertController,
    private tesiService: TesiService,
    private allegatiTesiTirocinioService: AllegatiTesiTirocinioService,
    private toastController: ToastController, 
    private navCtrl: NavController, 
    private route: ActivatedRoute, 
    private sharedService: SharedService, 
    private tesiApiService: TesiApiService,
    private HomeTesiService: HomeTesiService ) { 
    
    this.tesi = this.tesiService.getTesi();
    this.isModificabile = this.tesiService.checkTesiIsModificabile(this.tesi.tesi.statoTesi, this.tesi.ruoloUtente);

    this.route.queryParams.subscribe(params => {
      
      if (params["id"] !== undefined && params["id"] !== null)
        this.tesiId = Number(params["id"]);

      this.tesiApiService.getInterni().subscribe((res) => {
        this.correlatori = res;
        this.preparazioneCorrelatori();
      });

    });
    
    this.dataDiscussione = new Date().toISOString();
    this.showCalendar = false;

  }

  ionViewWillEnter() {
    //this.homeTesiService.preparaTesiObj().then();
    this.tesi = this.tesiService.getTesi();
    this.isModificabile = this.tesiService.checkTesiIsModificabile(this.tesi.tesi.statoTesi, this.tesi.ruoloUtente)
  
  }

  ionViewDidEnter() {
    this.aggiorna();
  }

  async refresh(event: any) {
    setTimeout(async () => {
      await this.aggiorna()
      event.target.complete();
    }, 1000);
  }

  private async aggiorna(): Promise<boolean> {
    this.tesi = await this.tesiService.aggiornaTesi(this.tesiId);
    await this.HomeTesiService.preparaTesiObj();
    if (this.tesi !== null) {
      if (!this.tesiService.checkValiditaRuolo(this.tesi.ruoloUtente)) {
        this.navCtrl.navigateBack(['/home-studente-tesi']);
        return false;
      }
      this.isModificabile = this.tesiService.checkTesiIsModificabile(this.tesi.tesi.statoTesi, this.tesi.ruoloUtente);
      this.preparazioneCorrelatori();
      return true;
    }
    this.navCtrl.navigateBack(['/home-studente-tesi']);
    return false;
  }

  private preparazioneCorrelatori(): void {
    if (this.tesi !== null && this.tesi !== undefined) {
      this.correlatoriSelezionati = [...this.tesi.tesi.correlatori];
      this.vecchiCorrelatori = [...this.correlatoriSelezionati];
      this.ricercaCorrelatori = [...this.correlatori];
      this.ricercaCorrelatori = this.diff(this.ricercaCorrelatori, this.tesi.tesi.relatore)
      this.showRicercaCorrelatori();
      if (this.correlatoriSelezionati.length === 0) {
        this.showedCorrelatoriSelezionati = "";
      } else if (this.correlatoriSelezionati.length === 1) {
        this.showedCorrelatoriSelezionati = this.correlatoriSelezionati[0].nome + " " + this.correlatoriSelezionati[0].cognome;
      } else {
        this.showedCorrelatoriSelezionati = this.correlatoriSelezionati.length + " correlatori selezionati";
      }
    }
  }


  private diff(array1: Utente[], str: any): any[] {
    let a: any[] = [];
    array1.forEach((a1) => {
      if(`${a1.nome} ${a1.cognome}` !== str.substring(6)) {
        a.push(a1);
      }
    });
    return a;
  }


  private unioneArray(array1: any[], array2: any[]): any[] {

    array2.forEach((d) => {
      if (!this.sharedService.include(array1, d)) {
        array1.push(d);
      }
    });
    return array1;
  }

  showRicercaCorrelatori() {
    if (this.correlatoriSelezionati === undefined) {
      this.showedRicercaCorrelatori = [...this.ricercaCorrelatori]; ////
    } else {
      this.showedRicercaCorrelatori = this.correlatoriSelezionati.concat(this.ricercaCorrelatori.filter((d) => { return this.correlatoriSelezionati !== undefined && this.correlatoriSelezionati.find((e) => e.nome === d.nome) === undefined }));
    }
  }

  cancelCorrelatori() {
    this.correlatoriSelezionati = [...this.vecchiCorrelatori];
    this.ricercaCorrelatori = [...this.correlatori];
    this.ricercaCorrelatori = this.diff(this.ricercaCorrelatori, this.tesi?.tesi.relatore)
    this.showRicercaCorrelatori();
    this.logEventRicercaCorrelatori = "";
    this.modalCorrelatori.dismiss(null, 'cancel');
  }

  async confirmCorrelatori() {
    if (this.correlatoriSelezionati === undefined || this.correlatoriSelezionati.length === 0) {
      this.showedCorrelatoriSelezionati = "";
    } else if (this.correlatoriSelezionati.length === 1) {
      this.showedCorrelatoriSelezionati = this.correlatoriSelezionati[0].nome + " " + this.correlatoriSelezionati[0].cognome;
    } else {
      this.showedCorrelatoriSelezionati = this.correlatoriSelezionati.length + " correlatori selezionati";
    }

    this.vecchiCorrelatori = [...this.correlatoriSelezionati];
    this.ricercaCorrelatori = [...this.correlatori];
    this.ricercaCorrelatori = this.diff(this.ricercaCorrelatori, this.tesi?.tesi.relatore)
    this.showRicercaCorrelatori();
    this.logEventRicercaCorrelatori = "";

    if (this.tesi !== null && this.tesi.tesi.id !== undefined && this.correlatoriSelezionati !== this.vecchiCorrelatori) {
      this.tesiApiService.modificaCorrelatoriTesi(this.tesi.tesi.id, this.correlatoriSelezionati.map((d) => d.id)).subscribe();
    }
    
    this.modalCorrelatori.dismiss(null, 'confirm');
  }

  handleInputC(event: any): void {
    const query: string = event.target.value.toLowerCase();
    this.ricercaCorrelatori = this.correlatori.filter((d) => {
      const nomeCognome = `${d.nome} ${d.cognome}`;
      return nomeCognome.toLowerCase().indexOf(query) > -1;
    });
    this.ricercaCorrelatori = this.diff(this.ricercaCorrelatori, this.tesi?.tesi.relatore)
    this.logEventRicercaCorrelatori = event;
    this.showRicercaCorrelatori();
    setTimeout(() => {
      if (query.length >= 3 && event === this.logEventRicercaCorrelatori) {
        this.tesiApiService.getRicerca(query).subscribe((res) => {
          this.ricercaCorrelatori = this.unioneArray(this.ricercaCorrelatori, res);
          this.ricercaCorrelatori = this.diff(this.ricercaCorrelatori, this.tesi?.tesi.relatore)
          this.showRicercaCorrelatori();
        });
      }
    }, 2500);
  }

  gestisciCheckbox(event: any) {
    const check: Boolean = event.detail.checked;
    const utente: Utente = event.detail.value;
    if (check) {
      if (this.correlatoriSelezionati.length < 2) {
        this.correlatoriSelezionati.push(utente);
        this.showRicercaCorrelatori();
      } else {
        event.target.checked = false;
      }
    } else {
      const index = this.correlatoriSelezionati?.indexOf(utente);
      if (index !== -1) {
        this.correlatoriSelezionati?.splice(index, 1);
        this.showRicercaCorrelatori();
      }
    }
  }

  async presentTitoloAlert() {
    if (await this.aggiorna()) {
      if (!this.alertFlag) {

        this.alertFlag = true;
        const alert = await this.alertController.create({
          header: 'Modifica Titolo',
          buttons: [
            {
              text: 'Annulla',
              role: 'cancel',
            },
            {
              text: 'OK',
              role: 'confirm',
              handler: (data: any) => {
                this.cambiaTitolo(data.nome)
              },
            },
          ],
          inputs: [
            {
              placeholder: "Nuovo titolo",
              name: 'nome'
            }
          ],
        });
        await alert.present();
        this.alertFlag = false;
      }
    }
  }

  async cambiaTitolo(nuovoTitolo: string) {
    if (nuovoTitolo !== '') {
      if (this.tesi !== null && this.tesi.tesi.id !== undefined) {
        if (await this.aggiorna()) {
          this.tesiApiService.modificaTitoloTesi(this.tesi.tesi.id, nuovoTitolo).subscribe();
          this.tesi.tesi.titolo = nuovoTitolo
        } 
      }
    }
  }

  async presentConcludiTesi() {
    if (await this.aggiorna()) {
      if (this.tesi !== null && this.tesi !== undefined ) {
        if (this.tesi.tesi.dataDiscussione === undefined || this.tesi.tesi.dataDiscussione === null || this.tesi.tesi.dataDiscussione === "")
          this.presentToast("Devi selezionare la data discussione tesi");
        else {
          const alert = await this.alertController.create({
            header: 'Confermi di aver discusso la tesi in data ' + this.tesi.tesi.dataDiscussione + '?',
            buttons: [
              {
                text: 'Annulla',
                role: 'cancel',
              },
              {
                text: 'OK',
                role: 'confirm',
                handler: () => {
                  this.concludiTesi();
                },
              },
            ],
          });
          await alert.present();
        }
      }
    }
  }

  async presentEliminaTesi() {
    if (await this.aggiorna()) {
      const alert = await this.alertController.create({
        header: 'Confermi di voler eliminare la tesi?',
        buttons: [
          {
            text: 'Annulla',
            role: 'cancel',
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              this.eliminaTesi();
            },
          },
        ],
      });
      await alert.present();
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

  async concludiTesi() {
    if (this.tesi !== null && this.tesi.tesi.id !== undefined) {
      if (this.tesi.tesi.dataDiscussione === undefined || this.tesi.tesi.dataDiscussione === null || this.tesi.tesi.dataDiscussione === "")
        this.presentToast("Devi selezionare la data discussione tesi");
      else {
        if (await this.aggiorna()) {
          this.tesiApiService.cambiaDataDiscussioneTesi(this.tesi!.tesi.id, this.tesi.tesi.dataDiscussione).subscribe((res) => {
            this.tesiApiService.cambiaStatoTesi(this.tesi!.tesi.id, "CONCLUSA").subscribe(async (res) => {
              await this.HomeTesiService.preparaTesiObj();
              this.navCtrl.navigateBack(['/home-studente-tesi']);
            });
          });
        }
      }
    }
  }

  async eliminaTesi() {
    if (this.tesi !== null && this.tesi.tesi.id !== undefined) {
      if (await this.aggiorna()) {
        this.tesiApiService.cambiaStatoTesi(this.tesi.tesi.id, "ARCHIVIATA").subscribe(async (res) => {
          await this.HomeTesiService.preparaTesiObj();
          this.navCtrl.navigateBack(['/home-studente-tesi']);
        });
      }
    }
  }

  async openCorrelatoriModal() {
    if (await this.aggiorna()) 
      this.preparazioneCorrelatori();
  }

  async visualizzaAllegati() {

    if (this.tesi !== null) {
      if (await this.aggiorna()) {
        try {
          await this.allegatiTesiTirocinioService.preparaTesiAllegati(this.tesi.tesi.id);
          const obj: NavigationExtras = {
            queryParams: {
              type: "tesi",
              id: this.tesi.tesi.id,
              stato: this.tesi.tesi.statoTesi
            }
          }
          this.navCtrl.navigateForward(['/allegati-tesi-tirocini'], obj);
        } catch (error) {}
      }
    }
  }

  async openCalendar() {
    if (await this.aggiorna()) {
      this.showCalendar = true;
    }
  }

  async cancelCalendar() {
    if (await this.aggiorna()) {
      this.showCalendar = false;
    }
  }

  public aggiornaData() {
    const date = new Date(this.dataDiscussione);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (this.tesi !== undefined && this.tesi !== null)
      this.tesi.tesi.dataDiscussione = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  }

}
