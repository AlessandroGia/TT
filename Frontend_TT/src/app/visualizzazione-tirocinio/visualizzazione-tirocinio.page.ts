import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { IonModal, NavController } from '@ionic/angular';
import { Tirocinio } from '../interfaces/primitive/tirocinio-interface';
import { TirocinioApiService } from '../api/tirocinio/tirocinio-api.service';
import { SharedService } from '../services/shared/shared.service';
import { Utente } from '../interfaces/primitive/utente-interface';
import { HomeTirocinioService } from '../services/home-tirocinio/home-tirocinio.service';
import { AllegatiTesiTirocinioService } from '../services/allegati-tesi-tirocinio/allegati-tesi-tirocinio.service';
import { TirocinioService } from '../services/tirocinio/tirocinio.service';
import { TirocinioResponse } from '../interfaces/api/tirocinio/tirocinio-response-interface';
import { ElencoAttivitaService } from '../services/elenco-attivita/elenco-attivita.service';

@Component({
  selector: 'app-visualizzazione-tirocinio',
  templateUrl: './visualizzazione-tirocinio.page.html',
  styleUrls: ['./visualizzazione-tirocinio.page.scss'],
})
export class VisualizzazioneTirocinioPage {
  @ViewChild('modalCollaboratori', { static: true }) modalCollaboratori!: IonModal;
  @ViewChild('modalTutorU', { static: true }) modalTutorU!: IonModal;

  tirocinioId: number = -1;
  tirocinio: TirocinioResponse | null = null;

  ruoloUtente: string | null = null;

  isModificabile: boolean = false;

  completamento: string = "";
  oreSvolte: number = 0;

  alertFlag: boolean = false;

  collaboratori: Utente[] = [];

  showedRicercaCollaboratori: Utente[] = [...this.collaboratori];
  collaboratoriSelezionati: Utente[] = [];
  private ricercaCollaboratori: Utente[] = [...this.collaboratori];
  private vecchiCollaboratori: Utente[]  = [];
  private logEventRicercaCollaboratori: string =  "";
  showedCollaboratoriSelezionati: string = "";

  constructor( private alertController: AlertController, 
    private tirocinioService: TirocinioService,
    private allegatiTesiTirocinioService: AllegatiTesiTirocinioService, 
    private homeTirocinioService: HomeTirocinioService, 
    private toastController: ToastController, 
    private navCtrl: NavController, 
    private route: ActivatedRoute, 
    private tirocinioApiService: TirocinioApiService, 
    private sharedService: SharedService,
    private elencoAttivitaService: ElencoAttivitaService ) { 
    
    this.tirocinio = this.tirocinioService.getTirocinio();
    this.isModificabile = this.tirocinioService.checkTirocinioIsModificabile(this.tirocinio.tirocinio.statoTirocinio, this.tirocinio.ruoloUtente);

    this.route.queryParams.subscribe(params => {

      if (params["id"] !== undefined || params["id"] !== null) 
        this.tirocinioId = params["id"];

      this.tirocinioApiService.getInterni().subscribe((res) => {
        this.collaboratori = res;
        this.preparazioneCollaboratori();

        this.tirocinioApiService.getCompletamentoTirocinio(this.tirocinio!.tirocinio.id).subscribe((res) => {
          this.completamento = res.oreSvolte + "/" + this.tirocinio!.tirocinio.durata + " ore";
        });

      });
    });
  }

  ionViewWillEnter() {
    //this.homeTirocinioService.preparaTirocinioObj().then();
    
    this.tirocinioApiService.getCompletamentoTirocinio(this.tirocinio!.tirocinio.id).subscribe((res) => {
      this.oreSvolte = res.oreSvolte;
      this.completamento = this.oreSvolte + "/" + this.tirocinio!.tirocinio.durata + " ore";
    });

    this.tirocinio = this.tirocinioService.getTirocinio();
    this.isModificabile = this.tirocinioService.checkTirocinioIsModificabile(this.tirocinio.tirocinio.statoTirocinio, this.tirocinio.ruoloUtente);
    this.aggiorna();
  }

  ionViewDidEnter() {
    //this.aggiorna();
  }

  async refresh(event: any) {
    setTimeout(async () => {
      await this.aggiorna();
      event.target.complete();
    }, 1000);
  }

  private async aggiorna(): Promise<boolean> {
    this.tirocinio = await this.tirocinioService.aggiornaTirocinio(this.tirocinioId);
    if (this.tirocinio !== null) {
      if (!this.tirocinioService.checkValiditaRuolo(this.tirocinio.ruoloUtente)) {
        this.navCtrl.navigateBack(['/home-studente-tirocinio']);
        return false;
      }
      this.isModificabile = this.tirocinioService.checkTirocinioIsModificabile(this.tirocinio.tirocinio.statoTirocinio, this.tirocinio.ruoloUtente);
      this.preparazioneCollaboratori();
      return true;
    }
    this.navCtrl.navigateBack(['/home-studente-tirocinio']);
    return false;
  }

  private preparazioneCollaboratori(): void {
    if (this.tirocinio !== null && this.tirocinio !== undefined) {
      this.collaboratoriSelezionati = [...this.tirocinio.tirocinio.collaboratori]
      this.vecchiCollaboratori = [...this.collaboratoriSelezionati];
      this.ricercaCollaboratori = [...this.collaboratori];
      this.ricercaCollaboratori = this.diff(this.ricercaCollaboratori, this.tirocinio.tirocinio.tutor);
      this.showRicercaCollaboratori();
      if (this.collaboratoriSelezionati.length === 0) {
        this.showedCollaboratoriSelezionati = "";
      } else if (this.collaboratoriSelezionati.length === 1) {
        this.showedCollaboratoriSelezionati = this.collaboratoriSelezionati[0].nome + " " + this.collaboratoriSelezionati[0].cognome;
      } else {
        this.showedCollaboratoriSelezionati = this.collaboratoriSelezionati.length + " collaboratori selezionati";
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


  boxCollaboratori() {
    if (this.collaboratoriSelezionati.length === 0) {
      return "";
    } else if (this.collaboratoriSelezionati.length === 1) {
      return this.collaboratoriSelezionati[0];
    } else {
      return this.collaboratoriSelezionati.length + " collaboratori selezionati";
    }
  }

  cancelCollaboratori() {
    this.collaboratoriSelezionati = [...this.vecchiCollaboratori];
    this.ricercaCollaboratori = [...this.collaboratori];
    this.ricercaCollaboratori = this.diff(this.ricercaCollaboratori, this.tirocinio?.tirocinio.tutor);
    this.showRicercaCollaboratori();
    this.logEventRicercaCollaboratori = "";
    this.modalCollaboratori.dismiss(null, 'cancel');
  }


  confirmCollaboratori(): void {  
    if (this.collaboratoriSelezionati === undefined || this.collaboratoriSelezionati.length === 0) {
      this.showedCollaboratoriSelezionati = "";
    } else if (this.collaboratoriSelezionati.length === 1) {
      this.showedCollaboratoriSelezionati = this.collaboratoriSelezionati[0].nome + " " + this.collaboratoriSelezionati[0].cognome;
    } else {
      this.showedCollaboratoriSelezionati = this.collaboratoriSelezionati.length + " collaboratori selezionati";
    }

    this.ricercaCollaboratori = this.diff(this.ricercaCollaboratori, this.tirocinio?.tirocinio.tutor);
    this.vecchiCollaboratori = [...this.collaboratoriSelezionati];
    this.ricercaCollaboratori = [...this.collaboratori];
    this.showRicercaCollaboratori();
    this.logEventRicercaCollaboratori = "";

    if (this.tirocinio !== null && this.tirocinio.tirocinio.id !== undefined && this.collaboratoriSelezionati !== this.vecchiCollaboratori) {
      this.tirocinioApiService.modificaCollaboratoriTirocinio(this.tirocinio.tirocinio.id, this.collaboratoriSelezionati.map((c) => c.id)).subscribe();
    }

    this.modalCollaboratori.dismiss(null, 'confirm');
  }


  handleInputC(event: any): void {
    const query: string = event.target.value.toLowerCase();
    this.ricercaCollaboratori = this.collaboratori.filter((d) => {
      const nomeCognome = `${d.nome} ${d.cognome}`;
      return nomeCognome.toLowerCase().indexOf(query) > -1;
    });
    this.ricercaCollaboratori = this.diff(this.ricercaCollaboratori, this.tirocinio?.tirocinio.tutor);
    this.logEventRicercaCollaboratori = event;
    this.showRicercaCollaboratori();
    
    setTimeout(() => {
      if (query.length >= 3 && event == this.logEventRicercaCollaboratori) {
        this.tirocinioApiService.ricercaUtenti(query).subscribe((res) => {
          this.ricercaCollaboratori = this.unioneArray(this.ricercaCollaboratori, res);
          this.ricercaCollaboratori = this.diff(this.ricercaCollaboratori, this.tirocinio?.tirocinio.tutor);
          this.showRicercaCollaboratori();
        });
      }
    }, 2500);
  }


  gestisciCheckbox(event: any): void {
    const check: Boolean = event.target.checked;
    const utente: Utente = event.target.value;
    if (check) {
      if (this.collaboratoriSelezionati.length < 2) {
        this.collaboratoriSelezionati.push(utente);
        this.showRicercaCollaboratori();
      } else {
        event.target.checked = false;
      }
    } else {
      const index = this.collaboratoriSelezionati.indexOf(utente);
      if (index !== -1) {
        this.collaboratoriSelezionati.splice(index, 1);
        this.showRicercaCollaboratori();
      }
    }
  }
  showRicercaCollaboratori(): void {
    if (this.collaboratoriSelezionati === undefined) {
      this.showedRicercaCollaboratori = [...this.ricercaCollaboratori];
    } else {
      this.showedRicercaCollaboratori = this.collaboratoriSelezionati.concat(this.ricercaCollaboratori.filter((i) => { return this.collaboratoriSelezionati !== undefined && this.collaboratoriSelezionati.find((c) => c.nome === i.nome) === undefined } ));
    }
  }

  public navigaLibrettoDiario() {
    if (this.tirocinio !== null) {
      const obj = this.sharedService.passObj<Tirocinio>(this.tirocinio.tirocinio);
      this.navCtrl.navigateForward(['/libretto-diario'], obj);
    }
  }

  async presentEliminaTirocinio() {
    if (await this.aggiorna()) {
      const alert = await this.alertController.create({
        header: 'Confermi di voler eliminare il tirocinio?',
        buttons: [
          {
            text: 'ANNULLA',
            role: 'cancel',
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              this.eliminaTirocinio();
            },
          },
        ],
      });
  
      await alert.present();
    }
  }

  async presentConfermaTirocinio() {
    if (await this.aggiorna()) {
      const alert = await this.alertController.create({
        header: 'Confermi di voler concludere il tirocinio?',
        buttons: [
          {
            text: 'ANNULLA',
            role: 'cancel',
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              this.concludiTirocinio();
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

  async concludiTirocinio() {
    if (this.tirocinio !== null && this.tirocinio.tirocinio.id !== undefined) {
      this.tirocinioApiService.modificaStatoTirocinio(this.tirocinio.tirocinio.id, "COMPLETATO").subscribe((res) => {
        this.homeTirocinioService.preparaTirocinioObj().then((tir) => {
          this.navCtrl.navigateForward(['/home-studente-tirocinio']);
        });
      });
    }
  }

  async verificaConclusioneTirocinio () {
    if (this.tirocinio !== null && this.tirocinio.tirocinio.id !== undefined) {
      this.presentToast("Devi completare le ore del tirocinio")
    } else {
      this.concludiTirocinio();
    }
  }

  eliminaTirocinio() {
    if (this.tirocinio !== null && this.tirocinio.tirocinio.id !== undefined) {
      this.tirocinioApiService.modificaStatoTirocinio(this.tirocinio.tirocinio.id, "ARCHIVIATO").subscribe((res) => {
        this.homeTirocinioService.preparaTirocinioObj().then((tir) => {
          this.navCtrl.navigateForward(['/home-studente-tirocinio']);
        });
      });
    }
  }

  async visualizzaAllegati() {
    if (await this.aggiorna()) {
      if (this.tirocinio !== null) {
        try {
          await this.allegatiTesiTirocinioService.preparaTirocinioAllegati(this.tirocinio.tirocinio.id)
          const obj: NavigationExtras = {
            queryParams: {
              type: "tirocinio",
              id: this.tirocinio.tirocinio.id
            }
          }
          this.navCtrl.navigateForward(['/allegati-tesi-tirocini'], obj);
        } catch { }
      }
    }
  }

  public async elencoAttivita() {
    if (await this.aggiorna()) {
      if (this.tirocinio !== null) {
        try {
          await this.elencoAttivitaService.aggiornaAttivita(this.tirocinio.tirocinio.id);
          const obj: NavigationExtras = {
            queryParams: {
              id: this.tirocinio.tirocinio.id
            }
          }
          this.navCtrl.navigateForward(['/elenco-attivita-tirocinio'], obj);
        } catch { }
      }
    }
  }

}