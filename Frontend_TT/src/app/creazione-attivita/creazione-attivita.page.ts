import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { SharedService } from '../services/shared/shared.service';
import { NuovaAttivitaApiService } from '../api/nuova-attivita/nuova-attivita-api.service';
import { ActivatedRoute } from '@angular/router';
import { Tirocinio } from '../interfaces/primitive/tirocinio-interface';

@Component({
  selector: 'app-creazione-attivita',
  templateUrl: './creazione-attivita.page.html',
  styleUrls: ['./creazione-attivita.page.scss'],
})
export class CreazioneAttivitaPage {

  tirocinioId: number = -1;

  ora: Number = 0;
  minuti: Number = 0;

  data: string = "";
  dataFormattata: string;
  showCalendar: boolean;

  orarioE: string = "";
  orarioEFormattato: string;
  showTimeE: boolean;

  orarioU: string = "";
  orarioUFormattato: string;
  showTimeU: boolean;

  durata: string;
  nota: string;


  constructor(private navCtrl: NavController,  private toastController: ToastController, private route: ActivatedRoute, private sharedService: SharedService, private nuovaAttivitaApiService: NuovaAttivitaApiService) { 
    
    this.route.queryParams.subscribe(params => {
      this.tirocinioId = Number(params["id"]);
    });
    
    
    this.dataFormattata = "";
    this.showCalendar = false;

    this.orarioEFormattato = "";
    this.showTimeE = false;

    this.orarioUFormattato = "";
    this.showTimeU = false;

    this.durata = "";
    this.nota = "";
  }

  openCalendar() {
    if (this.data === "" || this.data === null || this.data === undefined) 
      this.data = new Date().toISOString();
    this.showCalendar = true;
  }

  cancelCalendar() {
    this.showCalendar = false;
  }

  public aggiornaData() {
    const date = new Date(this.data);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    this.dataFormattata = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  }

  public openTimeE() {
    if (this.orarioE === "" || this.orarioE === null || this.orarioE === undefined) 
      this.orarioE = new Date().toISOString();
    this.showTimeE = true;
  }

  public cancelTimeE() {
    this.showTimeE = false;
  }

  public aggiornaOrarioE(event: any) {
    const time = new Date(this.orarioE);

    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');

    this.orarioEFormattato = `${hours}:${minutes}`;

    this.calcolaDurata();
  }

  public openTimeU() {
    if (this.orarioU === "" || this.orarioU === null || this.orarioU === undefined) 
      this.orarioU = new Date().toISOString();
    this.showTimeU = true;
  }

  public cancelTimeU() {
    this.showTimeU = false;
  }

  public aggiornaOrarioU(event: any) {
    const time = new Date(event.detail.value);

    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');

    this.orarioUFormattato = `${hours}:${minutes}`;

    this.calcolaDurata();
  }

  private calcolaDurata() {
    if (this.orarioEFormattato != "" && this.orarioUFormattato != "") {
      const entrataArray = this.orarioEFormattato.split(':');
      const uscitaArray = this.orarioUFormattato.split(':');

      const oreEntrata = parseInt(entrataArray[0], 10);
      const minutiEntrata = parseInt(entrataArray[1], 10);

      const oreUscita = parseInt(uscitaArray[0], 10);
      const minutiUscita = parseInt(uscitaArray[1], 10);

      let ore = oreUscita - oreEntrata;
      let minuti = minutiUscita - minutiEntrata;

      if (minuti < 0) {
        ore--;
        minuti += 60;
      }

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
                this.durata = `${ore} ora, ${minuti} minuto`
              else
                this.durata = `${ore} ora, ${minuti} minuti`
            } else {
              if (minuti == 1)
                this.durata = `${ore} ore, ${minuti} minuto`
              else
                this.durata = `${ore} ore, ${minuti} minuti`
            }
          }
        }
        this.ora = ore;
        this.minuti = minuti;
      } else {
        this.durata = "";
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

  conferma() {
    if (this.tirocinioId !== null) {
      if (this.dataFormattata === undefined || this.dataFormattata === null || this.dataFormattata === "") 
        this.presentToast("Devi selezionare la data di inizio attivita'")
      else if (this.orarioEFormattato === undefined || this.orarioEFormattato === null || this.orarioEFormattato === "")
        this.presentToast("Devi selezionare l'orario di inizio attivita'") 
      else if (this.orarioUFormattato === undefined || this.orarioUFormattato === null || this.orarioUFormattato === "")
        this.presentToast("Devi selezionare l'orario di fine attivita'")
      else {
        this.nuovaAttivitaApiService.creaAttivita(this.tirocinioId, this.dataFormattata, this.orarioEFormattato, this.orarioUFormattato, Number(this.ora), Number(this.minuti), this.nota).subscribe((res) => {
          this.navCtrl.navigateBack(['/elenco-attivita-tirocinio']);
        });
      }
    }
  }
}