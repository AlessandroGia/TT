import { Component, ViewChild } from '@angular/core';
import { AlertController, AlertInput, IonModal, NavController, ToastController } from '@ionic/angular';
import { SharedService } from '../services/shared/shared.service';
import { NuovaTesiApiService } from '../api/nuova-tesi/nuova-tesi-api.service';
import { Carriera } from '../interfaces/primitive/carriera-interface';
import { ActivatedRoute } from '@angular/router';
import { Insegnamento } from '../interfaces/primitive/insegnamento-interface';
import { Utente } from '../interfaces/primitive/utente-interface';

@Component({
  selector: 'app-nuova-tesi',
  templateUrl: './nuova-tesi.page.html',
  styleUrls: ['./nuova-tesi.page.scss'],
})
export class NuovaTesiPage {
  @ViewChild('modalInsegnamento', { static: true }) modalInsegnamento!: IonModal;
  @ViewChild('modalRelatore', { static: true }) modalRelatore!: IonModal;
  @ViewChild('modalCorrelatori', { static: true }) modalCorrelatori!: IonModal;

  titolo = "";
  
  insegnamenti: Insegnamento[] = [];
  relatori: Utente[] = [];
  correlatori: Utente[] = [];

  showedRicercaInsegnamenti: Insegnamento[] = [...this.insegnamenti];
  insegnamentoSelezionato: Insegnamento | undefined = undefined;
  private ricercaInsegnamenti: Insegnamento[] = [...this.insegnamenti];
  private vecchioInsegnamento: Insegnamento | undefined = undefined;
  showedInsegnamentoSelezionato: string = "";

  showedRicercaDocenti: Utente[] = [...this.relatori];
  relatoreSelezionato: Utente | undefined = undefined;
  private ricercaDocenti: Utente[] = [...this.relatori];
  private vecchioRelatore: Utente | undefined = undefined;
  private logEventRicercaDocenti: string =  "";
  showedRelatoreSelezionato: string = "";

  showedRicercaCorrelatori: Utente[] = [...this.correlatori];
  correlatoriSelezionati: Utente[] = [];
  private ricercaCorrelatori: Utente[] = [...this.correlatori];
  private vecchiCorrelatori: Utente[]  = [];
  private logEventRicercaCorrelatori: string =  "";
  showedCorrelatoriSelezionati: string = "";

  alertFlag: boolean = false;

  carriere: string[] = [];
  carrieraSelezionata: Carriera | undefined = undefined;

  constructor(private navCtrl: NavController, 
    private sharedService: SharedService, 
    private toastController: ToastController, 
    private nuovaTesiApiService: NuovaTesiApiService, 
    private route: ActivatedRoute, 
    private alertController: AlertController) {
      
    this.route.queryParams.subscribe(params => {
      this.carriere = JSON.parse(params["obj"]);
      if (this.carriere.length > 1) {
        this.presentCarriereAlert()
      }
      else {
        this.carrieraSelezionata = this.sharedService.getCarriere().find((c) => c.nomeCDS === this.carriere[0]);
        this.inizializzaDati();
      }
    });
  }

  private inizializzaDati(): void {

      this.insegnamenti = this.sharedService.getInsegnamenti(this.carrieraSelezionata!.nomeCDS);
      this.ricercaInsegnamenti = [...this.insegnamenti];
      this.showedRicercaInsegnamenti = [...this.ricercaInsegnamenti];
      
      this.relatori = this.sharedService.getAllDocentiCarriera(this.carrieraSelezionata!.nomeCDS);
      this.ricercaDocenti = [...this.relatori];
      this.showedRicercaDocenti = [...this.ricercaDocenti];
      this.logEventRicercaDocenti = "";
      
      this.nuovaTesiApiService.getInterni().subscribe((res) => {
        this.correlatori = res;
        this.ricercaCorrelatori = [...this.correlatori];
        this.showedRicercaCorrelatori = [...this.ricercaCorrelatori]; 
        this.logEventRicercaCorrelatori = "";
      });

  }

  
  private async presentCarriereAlert() {
    if (!this.alertFlag) {
      this.alertFlag = true;

      const inputs: AlertInput[] = this.carriere.map((c) => {
        return {
          cssClass: 'custom-alert-input-default',
          label: c,
          type: 'radio',
          value: c,
        };
      });

      const alert = await this.alertController.create({
        header: 'Scegli carriera',
        backdropDismiss: false,
        buttons: [
          {
            text: 'OK',
            role: 'confirm',
            handler: (data: any) => {
              this.carrieraSelezionata = this.sharedService.getCarriere().find((c) => c.nomeCDS === data);
              this.inizializzaDati();
            },
          },
        ],
        inputs,
      });

      await alert.present();

      this.alertFlag = false;
    }
  }

  private unioneArray(array1: any[], array2: any[]): any[] {
    array2.forEach((d) => {
      if (!this.sharedService.include(array1, d)) {
        array1.push(d);
      }
    });
    return array1;
  }

  private diff(array1: any[], array2: any[]): any[] {
    let a: any[] = [];
    array1.forEach((a1) => {
      if (!this.sharedService.include(array2, a1)) {
        a.push(a1)
      }
    })
    return a;
  }


  cancelInsegnamento(): void {
    this.insegnamentoSelezionato = this.vecchioInsegnamento;
    this.ricercaInsegnamenti = [...this.insegnamenti];

    if (this.relatoreSelezionato !== undefined && this.carrieraSelezionata !== undefined)
      this.ricercaInsegnamenti = this.sharedService.getInsegnamentiFromDocente(this.relatoreSelezionato, this.carrieraSelezionata.nomeCDS)

    this.showRicercaInsegnamenti();
    this.modalInsegnamento.dismiss(null, 'cancel');
  }

  cancelRelatore(): void {
    this.relatoreSelezionato = this.vecchioRelatore;
    this.ricercaDocenti = [...this.relatori];
    this.ricercaCorrelatori = [...this.correlatori];

    if (this.relatoreSelezionato === undefined && this.carrieraSelezionata !== undefined && this.insegnamentoSelezionato !== undefined){
      this.ricercaDocenti = this.sharedService.getDocentiFromInsegnamento(this.insegnamentoSelezionato, this.carrieraSelezionata.nomeCDS)
    }

    if (this.correlatoriSelezionati !== undefined && this.correlatoriSelezionati.length > 0)
      this.ricercaDocenti = this.diff(this.ricercaDocenti, this.correlatoriSelezionati);
    if (this.relatoreSelezionato !== undefined && this.relatoreSelezionato !== null)
      this.ricercaCorrelatori = this.diff(this.ricercaCorrelatori, [this.relatoreSelezionato]);
    

    this.showRicercaCorrelatori();
    this.showRicercaDocenti();
    this.logEventRicercaDocenti = "";
    this.modalRelatore.dismiss(null, 'cancel');
  }

  cancelCorrelatori(): void {
    this.correlatoriSelezionati = [...this.vecchiCorrelatori];
    this.ricercaCorrelatori = [...this.correlatori];
    this.ricercaDocenti = [...this.relatori];

    if (this.relatoreSelezionato !== undefined && this.relatoreSelezionato !== null) 
      this.ricercaCorrelatori = this.diff(this.ricercaCorrelatori, [this.relatoreSelezionato]);
    if (this.correlatoriSelezionati !== undefined && this.correlatoriSelezionati.length > 0)
      this.ricercaDocenti = this.diff(this.ricercaDocenti, this.correlatoriSelezionati);

    this.showRicercaDocenti();
    this.showRicercaCorrelatori();
    this.logEventRicercaCorrelatori = "";
    this.modalCorrelatori.dismiss(null, 'cancel');
  }

  confirmInsegnamento(): void {
    if (this.insegnamentoSelezionato !== undefined) 
      this.showedInsegnamentoSelezionato = this.insegnamentoSelezionato.nome;
    this.vecchioInsegnamento = this.insegnamentoSelezionato;
    this.ricercaInsegnamenti = [...this.insegnamenti];

    this.ricercaDocenti = [...this.relatori];


    if (this.carrieraSelezionata !== undefined && this.relatoreSelezionato !== undefined)
      this.ricercaInsegnamenti = this.sharedService.getInsegnamentiFromDocente(this.relatoreSelezionato, this.carrieraSelezionata.nomeCDS)
    else if (this.carrieraSelezionata !== undefined && this.relatoreSelezionato === undefined && this.insegnamentoSelezionato !== undefined && this.correlatoriSelezionati.length === 0) 
      this.ricercaDocenti = this.sharedService.getDocentiFromInsegnamento(this.insegnamentoSelezionato, this.carrieraSelezionata.nomeCDS)
    else if (this.carrieraSelezionata !== undefined && this.relatoreSelezionato === undefined && this.insegnamentoSelezionato !== undefined && this.correlatoriSelezionati.length > 0) {
      this.ricercaDocenti = this.sharedService.getDocentiFromInsegnamento(this.insegnamentoSelezionato, this.carrieraSelezionata.nomeCDS)
      this.ricercaDocenti = this.diff(this.ricercaDocenti, this.correlatoriSelezionati);
    }
      
    
    this.showRicercaDocenti();
    this.showRicercaInsegnamenti();
    this.modalInsegnamento.dismiss(null, 'confirm');
  }

  confirmRelatore(): void {
    if (this.relatoreSelezionato !== undefined) 
      this.showedRelatoreSelezionato = this.relatoreSelezionato.nome + " " + this.relatoreSelezionato.cognome;

    this.vecchioRelatore = this.relatoreSelezionato;
    this.ricercaDocenti = [...this.relatori];
    this.ricercaCorrelatori = [...this.correlatori];
    this.ricercaInsegnamenti = [...this.insegnamenti];



    if (this.relatoreSelezionato !== undefined && this.carrieraSelezionata !== undefined)
      this.ricercaInsegnamenti = this.sharedService.getInsegnamentiFromDocente(this.relatoreSelezionato, this.carrieraSelezionata.nomeCDS)
    else if (this.relatoreSelezionato === undefined && this.carrieraSelezionata !== undefined && this.insegnamentoSelezionato !== undefined){
      this.ricercaDocenti = this.sharedService.getDocentiFromInsegnamento(this.insegnamentoSelezionato, this.carrieraSelezionata.nomeCDS)
    }

    if(this.correlatoriSelezionati !== undefined && this.correlatoriSelezionati.length > 0)
      this.ricercaDocenti = this.diff(this.ricercaDocenti, this.correlatoriSelezionati);
    this.ricercaCorrelatori = this.diff(this.ricercaCorrelatori, [this.relatoreSelezionato]);

    this.showRicercaInsegnamenti();
    this.showRicercaCorrelatori();
    this.showRicercaDocenti();
    this.logEventRicercaDocenti = "";
    this.modalRelatore.dismiss(null, 'confirm');
  }

  confirmCorrelatori(): void {
    if (this.correlatoriSelezionati === undefined || this.correlatoriSelezionati.length === 0) {
      this.showedCorrelatoriSelezionati = "";
    } else if (this.correlatoriSelezionati.length === 1) {
      this.showedCorrelatoriSelezionati = this.correlatoriSelezionati[0].nome + " " + this.correlatoriSelezionati[0].cognome;
    } else {
      this.showedCorrelatoriSelezionati = this.correlatoriSelezionati.length + " correlatori selezionati";
    }
    
    this.vecchiCorrelatori = [...this.correlatoriSelezionati];
    this.ricercaCorrelatori = [...this.correlatori];
    this.ricercaDocenti = [...this.relatori]

    if (this.relatoreSelezionato !== undefined && this.relatoreSelezionato !== null) 
      this.ricercaCorrelatori = this.diff(this.ricercaCorrelatori, [this.relatoreSelezionato]);
    this.ricercaDocenti = this.diff(this.ricercaDocenti, this.correlatoriSelezionati);

    this.showRicercaDocenti();
    this.showRicercaCorrelatori();
    this.logEventRicercaCorrelatori = "";
    this.modalCorrelatori.dismiss(null, 'confirm');
  }

  handleInputI(event: any): void {
    const query = event.target.value.toLowerCase();
    this.ricercaInsegnamenti = this.insegnamenti.filter((d) => d.nome.toLowerCase().indexOf(query) > -1);
    this.showRicercaInsegnamenti();
  }
  gestisciCheckInsegnamenti(insegnamento: Insegnamento): void {
    this.insegnamentoSelezionato = insegnamento;
    this.showRicercaInsegnamenti();
  }
  showRicercaInsegnamenti(): void {
    if (this.insegnamentoSelezionato === undefined) {
      this.showedRicercaInsegnamenti = [...this.ricercaInsegnamenti];
    } else {
      this.showedRicercaInsegnamenti = [this.insegnamentoSelezionato].concat(this.ricercaInsegnamenti.filter((d) => d !== this.insegnamentoSelezionato));
    }
  }


  handleInputR(event: any): void {
    const query: string = event.target.value.toLowerCase();
    this.ricercaDocenti = this.relatori.filter((d) => {
      const nomeCognome = `${d.nome} ${d.cognome}`;
      return nomeCognome.toLowerCase().indexOf(query) > -1;
    });
    if(this.correlatoriSelezionati !== undefined && this.correlatoriSelezionati.length > 0)
      this.ricercaDocenti = this.diff(this.ricercaDocenti, this.correlatoriSelezionati);
    this.logEventRicercaDocenti = event;
    this.showRicercaDocenti();
    
    setTimeout(() => {
      if (query.length >= 3 && event === this.logEventRicercaDocenti) {
        this.nuovaTesiApiService.getDocenti().subscribe((res) => {
          const newRelatori = res.filter((r) => {
            const nomeCognome = `${r.nome} ${r.cognome}`;
            return nomeCognome.toLowerCase().indexOf(query) > -1;
          })
          this.ricercaDocenti = this.unioneArray(this.ricercaDocenti, newRelatori);
          if(this.correlatoriSelezionati !== undefined && this.correlatoriSelezionati.length > 0)
            this.ricercaDocenti = this.diff(this.ricercaDocenti, this.correlatoriSelezionati);
          this.showRicercaDocenti();
        });
      }
    }, 2500)
    
  }
  gestisciCheckRelatori(relatore: Utente): void {
    this.relatoreSelezionato = relatore;
    this.showRicercaDocenti();
  }
  showRicercaDocenti(): void {
    if (this.relatoreSelezionato === undefined) {
      this.showedRicercaDocenti = [...this.ricercaDocenti];
    } else {
      this.showedRicercaDocenti = [this.relatoreSelezionato].concat(this.ricercaDocenti.filter((d) => d.nome !== this.relatoreSelezionato!.nome));
    }
  }


  handleInputC(event: any): void {
    const query: string = event.target.value.toLowerCase();
    this.ricercaCorrelatori = this.correlatori.filter((d) => {
      const nomeCognome = `${d.nome} ${d.cognome}`;
      return nomeCognome.toLowerCase().indexOf(query) > -1;
    });
    if (this.relatoreSelezionato !== undefined && this.relatoreSelezionato !== null) 
      this.ricercaCorrelatori = this.diff(this.ricercaCorrelatori, [this.relatoreSelezionato]);
    this.logEventRicercaCorrelatori = event;
    this.showRicercaCorrelatori();

    setTimeout(() => {
      if (query.length >= 3 && event === this.logEventRicercaCorrelatori) {
        this.nuovaTesiApiService.cercaUtente(query).subscribe((res) => {
          this.ricercaCorrelatori = this.unioneArray(this.ricercaCorrelatori, res);
          if (this.relatoreSelezionato !== undefined && this.relatoreSelezionato !== null) 
            this.ricercaCorrelatori = this.diff(this.ricercaCorrelatori, [this.relatoreSelezionato]);
          this.showRicercaCorrelatori();
        });
      }
    }, 2500)

  }
  gestisciCheckbox(event: any): void {
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
  showRicercaCorrelatori(): void {
    if (this.correlatoriSelezionati === undefined) {
      this.showedRicercaCorrelatori = [...this.ricercaCorrelatori]; ////
    } else {
      this.showedRicercaCorrelatori = this.correlatoriSelezionati.concat(this.ricercaCorrelatori.filter((d) => { return this.correlatoriSelezionati !== undefined && this.correlatoriSelezionati.find((e) => e.nome === d.nome) === undefined }));
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

  navigaTesi(): void {
    if (this.carrieraSelezionata === undefined || this.carrieraSelezionata === null) 
      this.presentToast("Devi selezionare la carriera");
    else if (this.insegnamentoSelezionato === undefined || this.insegnamentoSelezionato === null)
      this.presentToast("Devi selezionare l'insegnamento");
    else if (this.relatoreSelezionato === undefined || this.relatoreSelezionato === null)
      this.presentToast("Devi selezionare il relatore");
    else {
      const idRelatore = this.relatoreSelezionato.id;
      const idCorrelatori = this.correlatoriSelezionati.map((c) => c.id);
      
      this.nuovaTesiApiService.creaNuovaTesi(this.titolo, this.insegnamentoSelezionato.nome, this.carrieraSelezionata.nomeCDS, idRelatore, idCorrelatori).subscribe((res) => {
        this.navCtrl.navigateBack(['/home-studente-tesi']);
      });
    }
  }
}