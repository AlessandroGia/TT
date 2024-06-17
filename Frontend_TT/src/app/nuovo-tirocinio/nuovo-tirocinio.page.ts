import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, AlertInput, IonModal, NavController, ToastController } from '@ionic/angular';
import { SharedService } from '../services/shared/shared.service';
import { NuovoTirocinioApiService } from '../api/nuovo-tirocinio/nuovo-tirocinio-api.service';
import { ActivatedRoute } from '@angular/router';
import { Carriera } from '../interfaces/primitive/carriera-interface';
import { Laboratorio } from '../interfaces/primitive/laboratorio-interface';
import { Utente } from '../interfaces/primitive/utente-interface';

@Component({
  selector: 'app-nuovo-tirocinio',
  templateUrl: './nuovo-tirocinio.page.html',
  styleUrls: ['./nuovo-tirocinio.page.scss'],
})
export class NuovoTirocinioPage {
  @ViewChild('modalLaboratorio', { static: true }) modalLaboratorio!: IonModal;
  @ViewChild('modalTutor', { static: true }) modalTutor!: IonModal;
  @ViewChild('modalCollaboratori', { static: true }) modalCollaboratori!: IonModal;

  durataTirocinio: number = 0;
  cfu: number = 0;

  laboratori: Laboratorio[] = [];
  tutor: Utente[] = [];
  collaboratori: Utente[] = [];

  showedRicercaLaboratori: Laboratorio[] = [...this.laboratori];
  laboratorioSelezionato: Laboratorio | undefined = undefined;
  private ricercaLaboratori: Laboratorio[] = [...this.laboratori];
  private vecchioLaboratorio: Laboratorio | undefined = undefined;
  showedLaboratorioSelezionato: string = "";

  showedRicercaTutor: Utente[] = [...this.tutor];
  tutorSelezionato: Utente | undefined = undefined;
  private ricercaTutor: Utente[] = [...this.tutor];
  private vecchioTutor: Utente | undefined = undefined;
  showedTutorSelezionato: string = "";

  showedRicercaCollaboratori: Utente[] = [...this.collaboratori];
  collaboratoriSelezionati: Utente[] = [];
  private ricercaCollaboratori: Utente[] = [...this.collaboratori];
  private vecchiCollaboratori: Utente[]  = [];
  private logEventRicercaCollaboratori: string =  "";
  showedCollaboratoriSelezionati: string = "";

  alertFlag: boolean = false;

  carriere: string[] = [];
  carrieraSelezionata: Carriera | undefined = undefined;

  constructor(private navCtrl: NavController, private sharedService: SharedService, private toastController: ToastController, private nuovoTirocinioApiService: NuovoTirocinioApiService, private route: ActivatedRoute, private alertController: AlertController) {

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

    this.nuovoTirocinioApiService.getLaboratori().subscribe((res) => {
      this.laboratori = res;
      this.ricercaLaboratori = [...this.laboratori];
      this.showedRicercaLaboratori = [...this.ricercaLaboratori]
    });

    this.nuovoTirocinioApiService.getDocenti().subscribe((res) => {
      this.tutor = res;
      this.ricercaTutor = [...this.tutor];
      this.showedRicercaTutor = [...this.ricercaTutor]
    });

    this.nuovoTirocinioApiService.getInterni().subscribe((res) => {
      this.collaboratori = res;
      this.ricercaCollaboratori = [...this.collaboratori];
      this.showedRicercaCollaboratori = [...this.ricercaCollaboratori]
      this.logEventRicercaCollaboratori = "";
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

  cancelLaboratorio(): void {
    this.laboratorioSelezionato = this.vecchioLaboratorio;
    this.ricercaLaboratori = [...this.laboratori];
    this.showRicercaLaboratori();
    this.modalLaboratorio.dismiss(null, 'cancel');
  }

  cancelTutor(): void {
    this.tutorSelezionato = this.vecchioTutor;
    this.ricercaTutor = [...this.tutor];
    this.ricercaCollaboratori = [...this.collaboratori]

    if (this.collaboratoriSelezionati !== undefined && this.collaboratori.length > 0)
      this.ricercaTutor = this.diff(this.ricercaTutor, this.collaboratoriSelezionati);
    if (this.tutorSelezionato != undefined && this.tutorSelezionato != null)
      this.ricercaCollaboratori = this.diff(this.ricercaCollaboratori, [this.tutorSelezionato]);
    
    this.showRicercaCollaboratori();
    this.showRicercaTutor();
    this.modalTutor.dismiss(null, 'cancel');
  }

  cancelCollaboratori(): void {
    this.collaboratoriSelezionati = [...this.vecchiCollaboratori];
    this.ricercaCollaboratori = [...this.collaboratori];
    this.ricercaTutor = [...this.tutor]

    if (this.tutorSelezionato != undefined && this.tutorSelezionato != null)
      this.ricercaCollaboratori = this.diff(this.ricercaCollaboratori, [this.tutorSelezionato])
    if (this.collaboratoriSelezionati !== undefined && this.collaboratori.length > 0)
      this.ricercaTutor = this.diff(this.ricercaTutor, this.collaboratoriSelezionati);

    this.showRicercaTutor()
    this.showRicercaCollaboratori();
    this.logEventRicercaCollaboratori = "";
    this.modalCollaboratori.dismiss(null, 'cancel');
  }

  confirmLaboratorio(): void {
    if (this.laboratorioSelezionato !== undefined) 
      this.showedLaboratorioSelezionato = this.laboratorioSelezionato.nome;
    
    this.vecchioLaboratorio = this.laboratorioSelezionato;
    this.ricercaLaboratori = [...this.laboratori];
    this.showRicercaLaboratori();
    this.modalLaboratorio.dismiss(null, 'confirm');
  }

  confirmTutor(): void {
    if (this.tutorSelezionato !== undefined) 
      this.showedTutorSelezionato = this.tutorSelezionato.nome + " " + this.tutorSelezionato.cognome;
    
    this.vecchioTutor = this.tutorSelezionato;
    this.ricercaTutor = [...this.tutor];
    this.ricercaCollaboratori = [...this.collaboratori];

    if (this.collaboratoriSelezionati !== undefined && this.collaboratori.length > 0)
      this.ricercaTutor = this.diff(this.ricercaTutor, this.collaboratoriSelezionati)
    this.ricercaCollaboratori = this.diff(this.ricercaCollaboratori, [this.tutorSelezionato]);

    this.showRicercaCollaboratori();
    this.showRicercaTutor();
    this.modalTutor.dismiss(null, 'confirm');
  }

  confirmCollaboratori(): void {
    if (this.collaboratoriSelezionati === undefined || this.collaboratoriSelezionati.length === 0) {
      this.showedCollaboratoriSelezionati = "";
    } else if (this.collaboratoriSelezionati.length === 1) {
      this.showedCollaboratoriSelezionati = this.collaboratoriSelezionati[0].nome + " " + this.collaboratoriSelezionati[0].cognome;
    } else {
      this.showedCollaboratoriSelezionati = this.collaboratoriSelezionati.length + " collaboratori selezionati";
    }

    this.vecchiCollaboratori = [...this.collaboratoriSelezionati];
    this.ricercaCollaboratori = [...this.collaboratori];
    this.ricercaTutor = [...this.tutor];

    if (this.tutorSelezionato != undefined && this.tutorSelezionato != null)
      this.ricercaCollaboratori = this.diff(this.ricercaCollaboratori, [this.tutorSelezionato])
    this.ricercaTutor = this.diff(this.ricercaTutor, this.collaboratoriSelezionati);
    
    this.showRicercaTutor();
    this.showRicercaCollaboratori();
    this.logEventRicercaCollaboratori = "";
    this.modalCollaboratori.dismiss(null, 'confirm');
  }

  handleInputL(event: any): void {
    const query = event.target.value.toLowerCase();
    this.ricercaLaboratori = this.laboratori.filter((d) => d.nome.toLowerCase().indexOf(query) > -1);
    this.showRicercaLaboratori();
  }
  gestisciCheckLaboratori(laboratorio: Laboratorio): void {
    this.laboratorioSelezionato = laboratorio;
    this.showRicercaLaboratori();
  }
  showRicercaLaboratori(): void {
    if (this.laboratorioSelezionato === undefined) {
      this.showedRicercaLaboratori = [...this.ricercaLaboratori];
    } else {
      this.showedRicercaLaboratori = [this.laboratorioSelezionato].concat(this.ricercaLaboratori.filter((l) => l !== this.laboratorioSelezionato));
    }
  }

  handleInputT(event: any): void {
    const query = event.target.value.toLowerCase();
    this.ricercaTutor = this.tutor.filter((d) =>  {
      const nomeCognome = `${d.nome} ${d.cognome}`;
      return nomeCognome.toLowerCase().indexOf(query) > -1;
    });
    if (this.collaboratoriSelezionati !== undefined && this.collaboratori.length > 0)
      this.ricercaTutor = this.diff(this.ricercaTutor, this.collaboratoriSelezionati)
    this.showRicercaTutor();
  }
  gestisciCheckTutor(tutor: Utente): void {
    this.tutorSelezionato = tutor;
    this.showRicercaTutor();
  }
  showRicercaTutor(): void {
    if (this.tutorSelezionato === undefined) {
      this.showedRicercaTutor = [...this.ricercaTutor];
    } else {
      this.showedRicercaTutor = [this.tutorSelezionato].concat(this.ricercaTutor.filter((t) => t !== this.tutorSelezionato));
    }
  }

  handleInputC(event: any): void {
    const query: string = event.target.value.toLowerCase();
    this.ricercaCollaboratori = this.collaboratori.filter((d) => {
      const nomeCognome = `${d.nome} ${d.cognome}`;
      return nomeCognome.toLowerCase().indexOf(query) > -1;
    });
    if (this.tutorSelezionato != undefined && this.tutorSelezionato != null)
      this.ricercaCollaboratori = this.diff(this.ricercaCollaboratori, [this.tutorSelezionato])
    this.logEventRicercaCollaboratori = event;
    this.showRicercaCollaboratori();

    setTimeout(() => {
      if (query.length >= 3 && event == this.logEventRicercaCollaboratori) {
        this.nuovoTirocinioApiService.cercaUtente(query).subscribe((res) => {
          this.ricercaCollaboratori = this.unioneArray(this.ricercaCollaboratori, res);
          if (this.tutorSelezionato != undefined && this.tutorSelezionato != null)
            this.ricercaCollaboratori = this.diff(this.ricercaCollaboratori, [this.tutorSelezionato])
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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
  }


  navigaTirocinio(): void {
    if (this.carrieraSelezionata !== undefined) {
      if (this.laboratorioSelezionato === undefined || this.laboratorioSelezionato === null)
        this.presentToast("Devi selezionare il labaratorio");
      else if (this.tutorSelezionato === undefined || this.tutorSelezionato === null) 
        this.presentToast("Devi selezionare il tutor");
      else if (this.cfu === undefined || this.cfu === null || this.cfu <= 0)
        this.presentToast("Numero di cfu non valido");
      else if (this.durataTirocinio === undefined || this.durataTirocinio === null || this.durataTirocinio <= 0)
        this.presentToast("Durata non valida");
      else {
  
      const idLaboratorio = this.laboratorioSelezionato.id;
      const idTutor = this.tutorSelezionato.id;
      const idCollaboratori = this.collaboratoriSelezionati.map((c) => c.id);
  
      this.nuovoTirocinioApiService.creaNuovoTirocinio(idLaboratorio, idTutor, this.carrieraSelezionata.nomeCDS, Number(this.cfu), Number(this.durataTirocinio), idCollaboratori).subscribe((res) => {
        this.navCtrl.navigateForward(['/home-studente-tirocinio']);
      });
      }
    }
  }
}