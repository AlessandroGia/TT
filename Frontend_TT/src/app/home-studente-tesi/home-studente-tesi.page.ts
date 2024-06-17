import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, Optional, ViewChild } from '@angular/core';
import { AlertController, AlertInput, GestureController, GestureDetail, IonContent, IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras } from "@angular/router"
import { LoginResponse } from '../interfaces/api/login/login-response-interface';
import { SharedService } from '../services/shared/shared.service';
import { HomeTesiApiService } from '../api/home-tesi/home-tesi-api.service';
import { Tesi } from '../interfaces/primitive/tesi-interface';
import { HomeTesiResponse } from '../interfaces/api/home-tesi/home-tesi-response-interface';
import { HomeTesiService } from '../services/home-tesi/home-tesi.service';
import { HomeTirocinioService } from '../services/home-tirocinio/home-tirocinio.service';
import { TesiService } from '../services/tesi/tesi.service';
import { LogoutService } from '../services/logout/logout.service';
import { TesiResponse } from '../interfaces/api/tesi/tesi-response-interface';

@Component({
  selector: 'app-home-studente-tesi',
  templateUrl: './home-studente-tesi.page.html',
  styleUrls: ['./home-studente-tesi.page.scss'],
})
export class HomeStudenteTesiPage {

  isCardActive = false;

  private backButtonSubscription: any;

  isDocente: boolean = false;
  isStudente: boolean = false;
  toggleCreaTesi: boolean = false;

  esse3: LoginResponse | null = null;
  tesiRes: HomeTesiResponse[] = [];
  tesiPresenti: boolean = true;

  nomeCongnomeUtente: string = "";

  alertFlag: boolean = false;

  carriereCreaTesi: string[] = [];

  ruoloCorrente: string = "";
  allRuoli: string[] = [];
  
  statiCorrenti: string[] = [];
  allStati: string[] = [];

  select: number = 0;

  constructor( private routerOutlet: IonRouterOutlet,
    private tesiService: TesiService,
    private tirocinioService: HomeTirocinioService,
    private homeTesiService: HomeTesiService,
    private el: ElementRef,
    private platform: Platform,
    private gestureCtrl: GestureController,
    private cdRef: ChangeDetectorRef, private navCtrl: NavController, 
    private route: ActivatedRoute, 
    private sharedService: SharedService, 
    private homeTesiApiService: HomeTesiApiService, 
    private alertController: AlertController,
    private logoutService: LogoutService,) {

    this.tesiRes = this.homeTesiService.getTesiObj();

    this.routerOutlet.swipeGesture = false;
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(100, () => { });

    this.isDocente = this.sharedService.isDocente();
    this.isStudente = this.sharedService.isStudente();
    this.nomeCongnomeUtente = this.sharedService.getUtente().nome + " " + this.sharedService.getUtente().cognome;
    this.preparazioneComponenti();
    
  }

  cardFiltrate(card: TesiResponse[]) {
    return card.filter((t) => {
      this.ruoloCorrente === t.ruoloUtente && this.statiCorrenti.includes(t.tesi.statoTesi)
    });
  }

  segmentChanged(event: any) {
    this.homeTesiService.setFiltroRuoloSelezionato(event.detail.value);
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
    this.tirocinioService.preparaTirocinioObj();
    this.tesiRes = this.homeTesiService.getTesiObj(); // NON TOGLIERE
    this.ruoloCorrente = this.homeTesiService.getFiltroRuoloSelezionato();
    this.aggiornaFiltroRuoli();
    this.statiCorrenti = [...this.homeTesiService.getFiltroStatiSelezionati()];
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
    this.tesiRes = await this.homeTesiService.preparaTesiObj();
    this.aggiornaFiltroRuoli();
    this.aggiornaFiltroStati();
    this.preparazioneComponenti();
  }

  private preparazioneComponenti(): void {
    if (this.tesiRes === undefined || this.tesiRes.length === 0)
      this.tesiPresenti = false;
    else
      this.tesiPresenti = true;
    if (this.isStudente) {
      this.carriereCreaTesi = this.getCarriereCreaTesi();
      if (this.carriereCreaTesi.length === 0) {
        this.toggleCreaTesi = false;
      } else {
        this.toggleCreaTesi = true;
      }
    }
  }

  public async presentFiltroStati() {
    if (!this.alertFlag) {
      this.alertFlag = true;

      const inputs: AlertInput[] = this.allStati.map((c) => {
        
        let checked: boolean = this.statiCorrenti.includes(c);
        let i: number = this.tesiRes.filter((t) => {
          if (t.ruoloUtente === this.ruoloCorrente)
            return t.tesi.statoTesi == c;
          return false;
        }).length;

        let color: string = "default"

        if (c === "DA_APPROVARE")
          color = "yellow";
        else if (c === "IN_CORSO")
          color = "green";
        else if (c === "CONCLUSA")
          color = "white";
        else if (c === "ARCHIVIATA")
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
              this.homeTesiService.setFiltroStatiSelezionati([...data])
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
    this.tesiRes.forEach(t => {
      if (t.ruoloUtente === this.ruoloCorrente)
        stati.add(t.tesi.statoTesi)
    });
    return Array.from(stati);
  }
  aggiornaFiltroStati() {
    this.allStati = [...this.getAllStati()];
    let statiCorrenti: string[] = [];

    this.homeTesiService.getFiltroStatiSelezionati().forEach((s) => {
      if (this.allStati.includes(s)) {
        statiCorrenti.push(s);
      }
    })

    if (statiCorrenti.length === 0) {
      if (this.allStati.length > 0) {
        if (this.allStati.includes("IN_CORSO")) {
          this.homeTesiService.setFiltroStatiSelezionati(["IN_CORSO"])
          this.statiCorrenti = ["IN_CORSO"];
        } else if (this.allStati.includes("DA_APPROVARE")){
          this.homeTesiService.setFiltroStatiSelezionati(["DA_APPROVARE"])
          this.statiCorrenti = ["DA_APPROVARE"];
        } else {
          this.homeTesiService.setFiltroStatiSelezionati([this.allStati[0]])
          this.statiCorrenti = [this.allStati[0]]
        }
      } else {
        this.homeTesiService.setFiltroStatiSelezionati([]);
        this.statiCorrenti = [];
      }
    } else  {
      this.homeTesiService.setFiltroStatiSelezionati([...statiCorrenti])
      this.statiCorrenti = [...statiCorrenti];
    }
  }

  getAllRuoli(): string[] {
    let ruoli: Set<string> = new Set();
    this.tesiRes.forEach(t => ruoli.add(t.ruoloUtente));
    return Array.from(ruoli);
  }
  aggiornaFiltroRuoli() {
    this.allRuoli = [...this.getAllRuoli()];
    if (!this.allRuoli.includes(this.homeTesiService.getFiltroRuoloSelezionato())) {
      if (this.allRuoli.length > 0) {
        this.homeTesiService.setFiltroRuoloSelezionato(this.allRuoli[0]);
        this.ruoloCorrente = this.allRuoli[0];
      }
      else {
        this.homeTesiService.setFiltroRuoloSelezionato("");
        this.ruoloCorrente = "";
      }
    }
  }

  // funzione che restituisce quali sono le tesi relative ad una determinata carriera che non hanno come stato "DA_APPROVARE", "IN_CORSO" o "CONCLUSA"
  private getCarriereCreaTesi(): string[] {
    const carriere: Set<string> = new Set(this.sharedService.getCarriere().map(c => c.nomeCDS));

    if (!this.tesiRes) {
      return Array.from(carriere);
    }

    const corsiDaScartare: Set<string> = new Set(
      this.tesiRes.filter((t) => {
        return t.tesi.statoTesi === "DA_APPROVARE" || t.tesi.statoTesi === "IN_CORSO" || t.tesi.statoTesi === "CONCLUSA"
      }).map(t => t.tesi.nomeCDS)
    )
    return [...carriere].filter((c) => !corsiDaScartare.has(c));
    
  }

  public async visualizzaTesi(tesi: HomeTesiResponse) {
    if (tesi !== undefined || tesi !== null) {
      try {
        let tesiAggiornata = await this.tesiService.aggiornaTesi(tesi.tesi.id);
        if (tesiAggiornata.ruoloUtente !== undefined && tesiAggiornata.ruoloUtente !== null && tesiAggiornata.ruoloUtente !== "") {
          if (tesiAggiornata.ruoloUtente === "RELATORE" && tesiAggiornata.tesi.statoTesi === "DA_APPROVARE") {
            this.presentConfermaTesiAlert(tesiAggiornata.tesi);
          } else if (tesiAggiornata.ruoloUtente !== "RELATORE" && tesiAggiornata.tesi.statoTesi === "DA_APPROVARE") {
            this.presenteAspettaApprovazioneAlert();
          } else {
            const navigationExtras: NavigationExtras = { 
              queryParams: {
                id: tesiAggiornata.tesi.id,
              }
            }
            this.navCtrl.navigateForward(['/visualizzazione-tesi'], navigationExtras);
          }
        } else {
          this.inizializzazione();
        }
      } catch (error) { }
    }
  }

  public logOut() {
    this.logoutService.logOut();
    this.navCtrl.navigateForward(['/login'], { replaceUrl: true })
  }

  public navigaTirocinio() {
    this.navCtrl.navigateForward(['/home-studente-tirocinio']);
  }

  public creaNuovaTesi() {
    const obj = this.sharedService.passObj<string[]>(this.carriereCreaTesi)
    this.navCtrl.navigateForward(['/nuova-tesi'], obj);
  }
  
  private async presenteAspettaApprovazioneAlert() {
    if (!this.alertFlag) {
      this.alertFlag = true;

      const alert = await this.alertController.create({
        header: 'Impossibile aprire la tesi',
        message: 'La tesi è in attesa di approvazione',
        buttons: ['OK']
      });

      await alert.present();
      this.alertFlag = false;
    }
  }

  private async presentConfermaTesiAlert(tesi: Tesi) {
    if (!this.alertFlag) {
      this.alertFlag = true;

      const alert = await this.alertController.create({
        header: 'Approvare la tesi?',
        buttons: [
          {
            text: 'Si',
            role: 'confirm',
            handler: () => {
              this.homeTesiApiService.modificaStatoTesi(tesi.id, "IN_CORSO").subscribe((res) => {
                this.inizializzazione();
              });
            },
          },
          {
            text: 'No',
            role: 'decline',
            handler: () => {
              this.homeTesiApiService.cancellaTesi(tesi.id).subscribe((res) => {
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

  // funzioni per la gestione dello swipe verso sinistra
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
    if (detail.deltaX < -200 && detail.velocityX < -2) {
      this.navCtrl.navigateForward(['/home-studente-tirocinio']);
    }
  }
  private onEnd() {
    this.isCardActive = false;
    this.cdRef.detectChanges();
  }

}
