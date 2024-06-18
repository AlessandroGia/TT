import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { AlertController, AlertInput, GestureController, GestureDetail, IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import { SharedService } from '../services/shared/shared.service';
import { NavigationExtras } from '@angular/router';
import { LoginResponse } from '../interfaces/api/login/login-response-interface';
import { Tirocinio } from '../interfaces/primitive/tirocinio-interface';
import { HomeTirocinioApiService } from '../api/home-tirocinio/home-tirocinio-api.service';
import { HomeTirocinioResponse } from '../interfaces/api/home-tirocinio/home-tirocinio-response-interface';
import { HomeTirocinioService } from '../services/home-tirocinio/home-tirocinio.service';
import { HomeTesiService } from '../services/home-tesi/home-tesi.service';
import { TirocinioService } from '../services/tirocinio/tirocinio.service';
import { LogoutService } from '../services/logout/logout.service';

@Component({
  selector: 'app-home-studente-tirocinio',
  templateUrl: './home-studente-tirocinio.page.html',
  styleUrls: ['./home-studente-tirocinio.page.scss'],
})
export class HomeStudenteTirocinioPage {

  isCardActive = false;

  private backButtonSubscription: any;

  isDocente: boolean = false;
  isStudente: boolean = false;
  toggleCreaTirocinio: boolean = false;

  esse3: LoginResponse | null = null;
  tirociniRes: HomeTirocinioResponse[] = [];
  tirociniPresenti: boolean = true;

  nomeCongnomeUtente: string = "";

  alertFlag: boolean = false;

  carriereCreaTirocinio: string[] = [];

  ruoloCorrente: string = "";
  allRuoli: string[] = [];
  
  statiCorrenti: string[] = [];
  allStati: string[] = [];
  
  completamento: string = "";

  constructor( public navCtrl: NavController, 
    private tirocinioService: TirocinioService,
    private tesiService: HomeTesiService, 
    private homeTirocinioService: HomeTirocinioService, 
    private routerOutlet: IonRouterOutlet, 
    private platform: Platform, 
    private el: ElementRef, 
    private gestureCtrl: GestureController, 
    private cdRef: ChangeDetectorRef, 
    private sharedService: SharedService,
    private HomeTirocinioApiService: HomeTirocinioApiService, 
    private alertController: AlertController,
    private logoutService: LogoutService ) {

    this.tirociniRes = this.homeTirocinioService.getTirocinioObj();
    
    this.routerOutlet.swipeGesture = false;
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(100, () => { });

    this.isDocente = this.sharedService.isDocente();
    this.isStudente = this.sharedService.isStudente();
    this.nomeCongnomeUtente = this.sharedService.getUtente().nome + " " + this.sharedService.getUtente().cognome;
    this.preparazioneComponenti();

  } 

  segmentChanged(event: any) {
    this.homeTirocinioService.setFiltroRuoloSelezionato(event.detail.value);
    this.ruoloCorrente = event.detail.value;
    this.aggiornaFiltroStati();
  }

  async refresh(event: any) {
    setTimeout(() => {
      try {
        this.inizializzazione();
      } catch { } finally {
        this.aggiornaFiltroRuoli();
        this.aggiornaFiltroStati();
        event.target.complete();
      }
    }, 1000);
  }



  ionViewWillEnter() {
    this.tesiService.preparaTesiObj();
    this.tirociniRes = this.homeTirocinioService.getTirocinioObj();
    this.ruoloCorrente = this.homeTirocinioService.getFiltroRuoloSelezionato();
    this.aggiornaFiltroRuoli();
    this.statiCorrenti = [...this.homeTirocinioService.getFiltroStatiSelezionati()];
    this.aggiornaFiltroStati();
    this.preparazioneComponenti();
  }

  ionViewDidEnter() {
    this.inizializzazione();
  }

  ionViewDidLeave() {
    this.routerOutlet.swipeGesture = true;
    this.backButtonSubscription.unsubscribe();
  }

  private async inizializzazione(): Promise<void> {
    this.tirociniRes = await this.homeTirocinioService.preparaTirocinioObj();
    this.aggiornaFiltroRuoli();
    this.aggiornaFiltroStati();
    this.preparazioneComponenti();
  }

  private preparazioneComponenti(): void {
    if (this.tirociniRes === undefined || this.tirociniRes.length === 0)
      this.tirociniPresenti = false;
    else
      this.tirociniPresenti = true;
    if (this.isStudente) {
      this.carriereCreaTirocinio = this.getCarriereCreaTirocinio();
      if (this.carriereCreaTirocinio.length === 0) {
        this.toggleCreaTirocinio = false;
      } else {
        this.toggleCreaTirocinio = true;
      }
    }
  } 

  public async presentFiltroStati() {
    if (!this.alertFlag) {
      this.alertFlag = true;

      const inputs: AlertInput[] = this.allStati.map((c) => {
        
        let checked: boolean = this.statiCorrenti.includes(c);
        
        let i: number = this.tirociniRes.filter((t) => {
          if (t.ruoloUtente === this.ruoloCorrente)
            return t.tirocinio.statoTirocinio == c;
          return false;
        }).length;

        let color: string = "default"

        if (c === "DA_APPROVARE")
          color = "yellow";
        else if (c === "IN_CORSO")
          color = "green";
        else if (c === "COMPLETATO")
          color = "white";
        else if (c === "ARCHIVIATO")
          color = "red";

        return {
          cssClass: `custom-alert-input-${color}`,
          label: `${c.replace("_", " ")} (${i})`,
          type: 'checkbox',
          value: c,
          checked,
        };

      });

      const alert = await this.alertController.create({
        cssClass: 'custom-alert',
        header: 'Filtra gli stati',
        backdropDismiss: false,
        buttons: [
          {
            text: 'OK',
            role: 'confirm',
            handler: (data: any) => {
              this.homeTirocinioService.setFiltroStatiSelezionati([...data])
              this.statiCorrenti = [...data];
              this.aggiornaFiltroStati();
            },
          },
        ],
        inputs,
      });

      await alert.present();
      this.alertFlag = false;
    }
  }

  getAllStati() {
    let stati: Set<string> = new Set();
    this.tirociniRes.forEach(t => {
      if (t.ruoloUtente === this.ruoloCorrente)
        stati.add(t.tirocinio.statoTirocinio)
    });
    return Array.from(stati);
  }
  aggiornaFiltroStati() {
    this.allStati = [...this.getAllStati()];
    let statiCorrenti: string[] = [];

    this.homeTirocinioService.getFiltroStatiSelezionati().forEach((s) => {
      if (this.allStati.includes(s)) {
        statiCorrenti.push(s);
      }
    })

    if (statiCorrenti.length === 0) {
      if (this.allStati.length > 0) {
        if (this.allStati.includes("IN_CORSO")) {
          this.homeTirocinioService.setFiltroStatiSelezionati(["IN_CORSO"])
          this.statiCorrenti = ["IN_CORSO"];
        } else if (this.allStati.includes("DA_APPROVARE")){
          this.homeTirocinioService.setFiltroStatiSelezionati(["DA_APPROVARE"])
          this.statiCorrenti = ["DA_APPROVARE"];
        } else {
          this.homeTirocinioService.setFiltroStatiSelezionati([this.allStati[0]])
          this.statiCorrenti = [this.allStati[0]]
        }
      } else {
        this.homeTirocinioService.setFiltroStatiSelezionati([]);
        this.statiCorrenti = [];
      }
    } else  {
      this.homeTirocinioService.setFiltroStatiSelezionati([...statiCorrenti])
      this.statiCorrenti = [...statiCorrenti];
    }
  }

  getAllRuoli(): string[] {
    let ruoli: Set<string> = new Set();
    this.tirociniRes.forEach(t => ruoli.add(t.ruoloUtente));
    return Array.from(ruoli);
  }
  aggiornaFiltroRuoli() {
    this.allRuoli = [...this.getAllRuoli()];
    if (!this.allRuoli.includes(this.homeTirocinioService.getFiltroRuoloSelezionato())) {
      if (this.allRuoli.length > 0) {
        this.homeTirocinioService.setFiltroRuoloSelezionato(this.allRuoli[0]);
        this.ruoloCorrente = this.allRuoli[0];
      }
      else {
        this.homeTirocinioService.setFiltroRuoloSelezionato("");
        this.ruoloCorrente = "";
      }
    }
  }

  // funzione che restituisce quali sono i tirocini relativi ad una determinata carriera che non hanno come stato "DA_APPROVARE", "IN_CORSO" o "COMPLETATO"
  private getCarriereCreaTirocinio(): string[] {
      const carriere: Set<string> = new Set(this.sharedService.getCarriere().map(c => c.nomeCDS));
  
      if (!this.tirociniRes) {
        return Array.from(carriere);
      }
  
      const corsiDaScartare: Set<string> = new Set(
        this.tirociniRes.filter((t) => {
          return t.tirocinio.statoTirocinio === "DA_APPROVARE" || t.tirocinio.statoTirocinio === "IN_CORSO" || t.tirocinio.statoTirocinio === "COMPLETATO"
        }).map(t => t.tirocinio.nomeCDS)
      )
      return [...carriere].filter((c) => !corsiDaScartare.has(c));
      
    }

  public async visualizzaTirocinio(tirocinio: HomeTirocinioResponse) {
    if (tirocinio !== undefined && tirocinio !== null) {
      try {
        let tirocinioAggiornato = await this.tirocinioService.aggiornaTirocinio(tirocinio.tirocinio.id);
        if (tirocinioAggiornato.ruoloUtente !== undefined && tirocinioAggiornato.ruoloUtente !== null && tirocinioAggiornato.ruoloUtente !== "") {
          if (tirocinioAggiornato.ruoloUtente === "TUTOR" && tirocinioAggiornato.tirocinio.statoTirocinio === "DA_APPROVARE") {
            this.presentConfermaTirocinioAlert(tirocinioAggiornato.tirocinio);
          } else if (tirocinioAggiornato.ruoloUtente !== "TUTOR" && tirocinioAggiornato.tirocinio.statoTirocinio === "DA_APPROVARE") {
            this.presenteAspettaApprovazioneAlert();
          } else {     
            const navigationExtras: NavigationExtras = { 
              queryParams: {
                id: tirocinioAggiornato.tirocinio.id,
                ruoloUtente: tirocinioAggiornato.ruoloUtente
              }
            }
            this.navCtrl.navigateForward(['/visualizzazione-tirocinio'], navigationExtras);
          }
        } else {
          this.inizializzazione();
        }
      } catch (error) { }

    }
  }

  public logOut() {
    this.logoutService.logOut();
    this.navCtrl.navigateBack(['/login'], { replaceUrl: true });
  }

  public navigaTesi() {
    this.navCtrl.navigateBack(['/home-studente-tesi']); 
  }

  public creaNuovoTirocinio() {
    const obj = this.sharedService.passObj<string[]>(this.carriereCreaTirocinio)
    this.navCtrl.navigateForward(['/nuovo-tirocinio'], obj);
  }

  

  private async presenteAspettaApprovazioneAlert() {
    if (!this.alertFlag) {
      this.alertFlag = true;

      const alert = await this.alertController.create({
        header: 'Impossibile aprire il tirocinio',
        message: 'Il tirocinio è in attesa di approvazione',
        buttons: ['OK']
      });

      await alert.present();

      this.alertFlag = false;
    }
  }

  private async presentConfermaTirocinioAlert(tirocinio: Tirocinio) {
    if (!this.alertFlag) {
      this.alertFlag = true;

      const alert = await this.alertController.create({
        header: 'Approvare il tirocinio?',
        buttons: [
          {
            text: 'Si',
            role: 'confirm',
            handler: () => {
              this.HomeTirocinioApiService.modificaStatoTirocinio(tirocinio.id, "IN_CORSO").subscribe((res) => {
                this.inizializzazione();
              });
            },
          },
          {
            text: 'No',
            role: 'decline',
            handler: () => {
              this.HomeTirocinioApiService.cancellaTirocinio(tirocinio.id).subscribe((res) => {
                this.inizializzazione();
              });
            },
          }
        ],
      });

      await alert.present();

      this.alertFlag = false;
    }
  }


  // funzioni per la gestione dello swipe verso destra
  ngAfterViewInit() {
    const gesture = this.gestureCtrl.create({
      el: this.el.nativeElement.querySelector('.homeStudenteContent'),
      onStart: () => this.onStart(),
      onMove: (detail) => this.onMove(detail),
      onEnd: () => this.onEnd(),
      gestureName: 'example',
    });

    gesture.enable();
  }
  private onStart() {
    this.isCardActive = true;
    this.cdRef.detectChanges();
  }
  private onMove(detail: GestureDetail) {
    if (detail.deltaX > 200 && detail.velocityX > 2) {
      this.navCtrl.navigateBack(['/home-studente-tesi']);
    }
  }
  private onEnd() {
    this.isCardActive = false;
    this.cdRef.detectChanges();
  }

}
