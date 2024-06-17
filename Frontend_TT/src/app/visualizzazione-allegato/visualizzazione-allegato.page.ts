import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal, NavController, ToastController } from '@ionic/angular';
import { SharedService } from '../services/shared/shared.service';
import { ActivatedRoute } from '@angular/router';
import { AllegatoApiService } from '../api/allegato/allegato-api.service';
import { Allegato } from '../interfaces/primitive/allegato-interface';
import { AllegatoTipologiaResponse } from '../interfaces/api/allegato/allegato-response-interface';
import { Tipologia } from '../interfaces/primitive/tipologia-interface';
import { AllegatoService } from '../services/allegato/allegato.service';
import { TirocinioService } from '../services/tirocinio/tirocinio.service';
import { TesiService } from '../services/tesi/tesi.service';
import { FileHandlerService } from '../services/file-handler/file-handler.service';

@Component({
  selector: 'app-visualizzazione-allegato',
  templateUrl: './visualizzazione-allegato.page.html',
  styleUrls: ['./visualizzazione-allegato.page.scss'],
})
export class VisualizzazioneAllegatoPage {
  @ViewChild('modalTipologia') modalTipologia!: IonModal;

  isModificabile: boolean = false;

  tipologie: Tipologia[] = [];

  allegato: Allegato | null = null;
  typeAllegato: "tesi" | "tirocinio" | null = null;
  typeId: number = -1;
  idAllegato: number = -1;
  stato: string = "";

  nome: string = "";
  tipologia: string = "";
  nota: string = "";

  nuovoNome: string = "";
  nuovaNota: string = "";
  nuovaTipologia: Tipologia | undefined = undefined;

  alertFlag: boolean = false;

  showedRicercaTipologia: Tipologia[] = [];
  tipologiaSelezionata: Tipologia | undefined = undefined;
  private ricercaTipologia: Tipologia[] = [];
  private vecchiaTipologia: Tipologia | undefined = undefined;
  showedTipologiaSelezionata: string = "";


  constructor( private alertController: AlertController, 
    private toastController: ToastController, 
    private navCtrl: NavController, 
    private sharedService: SharedService, 
    private route: ActivatedRoute, 
    private allegatoApiService: AllegatoApiService,
    private allegatoService: AllegatoService,
    private tesiService: TesiService,
    private tirocinioService: TirocinioService,
    private fileHandlerService: FileHandlerService) { 

    this.route.queryParams.subscribe(params => {

      this.typeAllegato = params["typeAllegato"];
      this.typeId = Number(params["typeId"]);
      this.idAllegato = Number(params["idAllegato"]);

      if (this.typeAllegato === "tesi") {
        this.allegato = this.allegatoService.getAllegatoTesi();
        this.isModificabile = this.allegatoService.checkAllegatiIsModificabile(this.tesiService.getTesi().tesi.statoTesi);
        this.allegatoApiService.getTipologieAllegatiTesi().subscribe((res) => {
          this.tipologie = res;
          this.preparazioneTipologie();
        });
      } else if (this.typeAllegato === "tirocinio") {
        this.allegato = this.allegatoService.getAllegatoTirocinio();
        this.isModificabile = this.allegatoService.checkAllegatiIsModificabile(this.tirocinioService.getTirocinio().tirocinio.statoTirocinio);
        this.allegatoApiService.getTipologieAllegatiTirocinio().subscribe((res) => {
          this.tipologie = res;
          this.preparazioneTipologie();
        });
        
      }

      this.inizializzaVariabili() 
    });
    
  }
  ionViewWillEnter() {
    if (this.typeAllegato === "tesi") {
      this.allegato = this.allegatoService.getAllegatoTesi();
    } else if (this.typeAllegato === "tirocinio") {
      this.allegato = this.allegatoService.getAllegatoTirocinio();
    }
  }

  ionViewDidEnter() {
    this.aggiorna();
  }

  async refresh(event: any) {
    setTimeout(async () => {
      await this.aggiorna();
      event.target.complete()
    }, 1000);
  }


  private async aggiorna(): Promise<boolean> {
    if (this.typeAllegato === "tesi") {
      await this.tesiService.aggiornaTesi(this.typeId);
      const ruolo = this.tesiService.getTesi().ruoloUtente;
      if (!this.allegatoService.checkValiditaRuolo(ruolo)) {
        this.navCtrl.navigateBack(['/home-studente-tesi']);
        return false;
      }
      const stato = this.tesiService.getTesi().tesi.statoTesi;
      this.isModificabile = this.allegatoService.checkAllegatiIsModificabile(stato);
      if (!this.isModificabile) {
        this.inizializzaVariabili();
        return false;
      }
      try {
        this.allegato = await this.allegatoService.aggiornaAllegatoTesi(this.idAllegato);
        this.preparazioneTipologie();
      } catch {
        this.navCtrl.navigateBack(['/allegati-tesi-tirocini']);
        return false;
      }

    } else if (this.typeAllegato === "tirocinio") {
      await this.tirocinioService.aggiornaTirocinio(this.typeId);
      const ruolo = this.tirocinioService.getTirocinio().ruoloUtente;
      if (!this.allegatoService.checkValiditaRuolo(ruolo)) {
        this.navCtrl.navigateBack(['/home-studente-tirocinio']);
        return false;
      }
      const stato = this.tirocinioService.getTirocinio().tirocinio.statoTirocinio;
      this.isModificabile = this.allegatoService.checkAllegatiIsModificabile(stato);
      if (!this.isModificabile) {
        this.inizializzaVariabili();
        return false;
      }
      try {
        this.allegato = await this.allegatoService.aggiornaAllegatoTirocinio(this.idAllegato);
        this.preparazioneTipologie();
      } catch {
        this.navCtrl.navigateBack(['/allegati-tesi-tirocini']);
        return false;
      }
    }
    this.inizializzaVariabili();

    return true;

  }

  private inizializzaVariabili() {
    if (this.allegato !== null && this.allegato !== undefined) {
      this.nuovoNome = this.allegato.nome;
      this.nuovaTipologia = this.tipologie.find((d) => d.nomeTipologia === this.allegato?.nomeTipologia);
      this.nuovaNota = this.allegato.nota;
    }
  }



  private preparazioneTipologie(): void {
    if (this.allegato !== null && this.allegato !== undefined) {
      this.tipologiaSelezionata = this.tipologie.find((d) => d.nomeTipologia === this.allegato?.nomeTipologia);
      this.vecchiaTipologia = this.tipologiaSelezionata;
      this.ricercaTipologia = [...this.tipologie];
      this.showedTipologiaSelezionata = this.allegato.nomeTipologia
      this.showRicercaTipologie();
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
    if (this.tipologiaSelezionata !== undefined && this.tipologiaSelezionata !== null)
      this.nuovaTipologia = this.tipologiaSelezionata;
    this.showRicercaTipologie();
    this.modalTipologia.dismiss(null, 'confirm');
  }

  handleInputT(event: any): void {
    const query = event.target.value.toLowerCase();
    this.ricercaTipologia = this.tipologie.filter((d) => d.nomeTipologia.toLowerCase().indexOf(query) > -1);
    this.showRicercaTipologie();
  }
  gestisciCheckTipologie(tipologia: AllegatoTipologiaResponse): void {
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

  async presentTitoloAlert() {
    if (!this.alertFlag) {
      this.alertFlag = true;

      const alert = await this.alertController.create({
        header: 'Modifica Nome',
        buttons: [
          {
            text: 'Annulla',
            role: 'cancel',
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: (data: any) => {
              this.cambiaNomeAllegato(data.nome)
            },
          },
        ],
        inputs: [
          {
            cssClass: 'custom-alert-input-default',
            placeholder: "Nuovo nome",
            name: 'nome'
          }
        ],
      });

      await alert.present();

      this.alertFlag = false;
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

  async confermaModifiche() {
    const nome = this.nuovoNome;
    const tipologia = this.nuovaTipologia;
    const nota = this.nuovaNota;

    if(await this.aggiorna()) {
      if (this.allegato !== null) {
        if (nome === undefined || nome === null || nome === "")
          this.presentToast("Devi inserire il nome dell'allegato")
        else if (tipologia === undefined || tipologia === null)
          this.presentToast("Devi selezionare la tipologia");
        else {
          if (this.typeAllegato === "tesi") {
            this.allegatoApiService.modificaAllegatoTesi(this.allegato.id, nome, tipologia.idTipologia , nota).subscribe((res) => {
              this.navCtrl.navigateBack('/allegati-tesi-tirocini');
            });
          } else if (this.typeAllegato === "tirocinio") {
            this.allegatoApiService.modificaAllegatoTirocinio(this.allegato.id, nome, tipologia.idTipologia , nota).subscribe((res) => {
              this.navCtrl.navigateBack('/allegati-tesi-tirocini');
            });
          }
        }
      }
    }
  }
  

  async scaricaFile() {
    if (await this.aggiorna()) {
      if (this.typeAllegato === "tesi") {
        this.allegatoApiService.scaricaAllegatoTesi(this.idAllegato).subscribe((res) => {
          this.fileHandlerService.scaricaEApriFile(res.data, res.filename);
        });
      } else if (this.typeAllegato === "tirocinio") {
        this.allegatoApiService.scaricaAllegatoTirocinio(this.idAllegato).subscribe((res) => {
          this.fileHandlerService.scaricaEApriFile(res.data, res.filename);
        });
      }
    }
  }

  cambiaNomeAllegato(nuovoNome: string) {
    if (this.allegato !== null && this.allegato !== undefined && nuovoNome !== '') {
      this.nuovoNome = nuovoNome
    }
  }

  async eliminaAllegato() {
    if(await this.aggiorna()) {
      const alert = await this.alertController.create({
        header: "Confermi di voler eliminare l'allegato?",
        buttons: [
          {
            text: 'Annulla',
            role: 'cancel',
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: async () => {
              if (await this.aggiorna()) {
                if (this.allegato !== null) {
                  if (this.typeAllegato === "tesi") {
                    this.allegatoApiService.eliminaAllegatoTesi(this.allegato.id).subscribe((res) => {
                      this.navCtrl.navigateBack('/allegati-tesi-tirocini');
                    });
                  } else if (this.typeAllegato === "tirocinio") {
                    this.allegatoApiService.eliminaAllegatoTirocinio(this.allegato.id).subscribe((res) => {
                      this.navCtrl.navigateBack('/allegati-tesi-tirocini');
                    });
                  }
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
