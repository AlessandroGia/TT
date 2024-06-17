import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal, ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Tirocinio } from '../interfaces/primitive/tirocinio-interface';
import { ActivatedRoute } from '@angular/router';
import { LibrettoDiarioApiService } from '../api/libretto-diario/libretto-diario-api.service';
import { SharedService } from '../services/shared/shared.service';
import { Utente } from '../interfaces/primitive/utente-interface';

@Component({
  selector: 'app-libretto-diario',
  templateUrl: './libretto-diario.page.html',
  styleUrls: ['./libretto-diario.page.scss'],
})
export class LibrettoDiarioPage {
  @ViewChild('modalTutor', { static: true }) modalTutor!: IonModal;

  tirocinio: Tirocinio | null = null;

  tutor: Utente[] = [];

  nota = "";

  dataPF: string;
  dataPFFormattata: string;
  showCalendar: boolean;

  dataInizio: string;
  dataIFormattata: string;
  dataFine: string;
  dataFFormattata: string;
  showCalendarI: boolean;
  showCalendarF: boolean;
  
  showedRicercaTutor: Utente[] = [...this.tutor];
  tutorSelezionato: Utente | undefined = undefined;
  private ricercaTutor: Utente[] = [...this.tutor];
  private vecchioTutor: Utente | undefined = undefined;
  showedTutorSelezionato: string = "";

  constructor(private alertController: AlertController, private navCtrl: NavController, private toastController: ToastController, private route: ActivatedRoute, private librettoDiaroApiService: LibrettoDiarioApiService, private sharedService: SharedService) { 
    this.route.queryParams.subscribe(params => {
      this.tirocinio = JSON.parse(params["obj"]);
      this.inizializzaDati();
    });

    this.dataPF = new Date().toISOString();
    this.dataPFFormattata = "";
    this.showCalendar = false;
    
    this.dataInizio = new Date().toISOString();
    this.dataFine = this.dataInizio;
    this.dataIFormattata = "";
    this.dataFFormattata = "";
    this.showCalendarI = false;
    this.showCalendarF = false;
  }

  private inizializzaDati(): void {
    this.librettoDiaroApiService.getDocenti().subscribe((res) => {
      this.tutor = res;
      this.ricercaTutor = [...this.tutor];
      this.showedRicercaTutor = [...this.ricercaTutor]
    });

  }

  cancelTutor(): void {
    this.tutorSelezionato = this.vecchioTutor;
    this.ricercaTutor = [...this.tutor];
    this.showRicercaTutor();
    this.modalTutor.dismiss(null, 'cancel');
  }

  confirmTutor(): void {
    if (this.tutorSelezionato !== undefined) 
      this.showedTutorSelezionato = this.tutorSelezionato.nome + " " + this.tutorSelezionato.cognome;
    
    this.vecchioTutor = this.tutorSelezionato;
    this.ricercaTutor = [...this.tutor];
    this.showRicercaTutor();
    this.modalTutor.dismiss(null, 'confirm');
  }

  handleInputT(event: any): void {
    const query = event.target.value.toLowerCase();
    this.ricercaTutor = this.tutor.filter((d) => {
      const nomeCognome = `${d.nome} ${d.cognome}`;
      return nomeCognome.toLowerCase().indexOf(query) > -1;
    });
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
  

  openCalendar() {
    this.showCalendar = true;
  }

  cancelCalendar() {
    this.showCalendar = false;
  }

  openCalendarI() {
    this.showCalendarI = true;
  }
  
  cancelCalendarI() {
    this.showCalendarI = false;
  }

  openCalendarF() {
    this.showCalendarF = true;
  }

  cancelCalendarF() {
    this.showCalendarF = false;
  }

  public aggiornaData() {
    const date = new Date(this.dataPF);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    this.dataPFFormattata = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  }

  public aggiornaDataI() {
    const date = new Date(this.dataInizio);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    this.dataIFormattata = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  }

  public aggiornaDataF() {
    const date = new Date(this.dataFine);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    this.dataFFormattata = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
  }

  async salvaFile (res: { filename: string, data: Blob }) {
    const url = window.URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = res.filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }



  public genera() {
    
    if (this.tirocinio !== null) {
      if (this.dataPFFormattata === undefined || this.dataPFFormattata === null || this.dataPFFormattata === "")
        this.presentToast("Devi selezionare la data di approvazione per il progetto formativo");
      else if (this.tutorSelezionato === undefined || this.tutorSelezionato === null)
        this.presentToast("Devi selezionare il tutor universitario");
      else if (this.dataIFormattata === undefined || this.dataIFormattata === null || this.dataIFormattata === "")
        this.presentToast("Devi selezionare la data di inizio attivita'");
      else if (this.dataFFormattata === undefined || this.dataFFormattata === null || this.dataFFormattata === "")
        this.presentToast("Devi selezionare la data di fine attivita'");
      else if (new Date(this.dataFFormattata).getTime() - new Date(this.dataIFormattata).getTime() <= 0 )
        this.presentToast("La data di fine attivita' non e' valida");
      else {
        this.librettoDiaroApiService.generaLibrettoDiario(this.tirocinio.id, this.dataPFFormattata, this.tutorSelezionato.nome, this.dataIFormattata, this.dataFFormattata, this.nota).subscribe((res) => {
          this.salvaFile(res);
          //this.navCtrl.navigateBack(['/visualizzazione-tirocinio']);
        });
      }
    }
  }

}