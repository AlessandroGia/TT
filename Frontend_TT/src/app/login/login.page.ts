import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { LoginApiService } from '../api/login/login-api.service';
import { SharedService } from '../services/shared/shared.service';
import { HomeTirocinioService } from '../services/home-tirocinio/home-tirocinio.service';
import { HomeTesiService } from '../services/home-tesi/home-tesi.service';
import { LogoutService } from '../services/logout/logout.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  // Variabili utilizzate per ricevere gli input dagli ion-input
  userName: string = "";
  password: string = "";
  caricamento: boolean = false;

  // Variabile utilizzata per la disattivazione del backButton dell'hardware
  private backButtonSubscription: any;

  isToastOpen = false;

  constructor(private routerOutlet: IonRouterOutlet,
    private platform: Platform,
    public navCtrl: NavController,
    private loginService: LoginApiService,
    private sharedService: SharedService,
    private tirocinioService: HomeTirocinioService,
    private tesiService: HomeTesiService,
    private toastController: ToastController,
    private logoutService: LogoutService
  ) { }

  ionViewCanLeave(): boolean {
    return false;
  }

  // All'entrata nella pagina disattiviamo il backButton dell'hardware (Android) e lo swipe (iOS)
  ionViewDidEnter() {
    this.routerOutlet.swipeGesture = false;
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(100, () => { });
  }

  // All'uscita dalla pagina ripristiniamo il backButton dell'hardware (Android) e lo swipe (iOS)
  ionViewDidLeave() {
    this.routerOutlet.swipeGesture = true;
    this.backButtonSubscription.unsubscribe();
    this.userName = "";
    this.password = "";
    this.caricamento = false;
  }
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
  }

  // Funzione che permette di accedere 
  public async accedi() {
    if (this.userName === undefined || this.userName === null || this.userName === "")
      this.presentToast("Devi inserire il nome utente")
    else if(this.password === undefined || this.password === null || this.password === "")
      this.presentToast("Devi inserire la password")
    else {
      this.caricamento = true;
      this.loginService.login(
        this.userName, this.password
      ).subscribe({
        next: async (res) => {
          this.logoutService.logOut();
          this.sharedService.setEsse3(res);
          try {
            await this.tesiService.preparaTesiObj()
            await this.tirocinioService.preparaTirocinioObj()
            this.navCtrl.navigateForward(['/home-studente-tesi']);
          } catch (error) {
            this.caricamento = false;
          }
        },
        error: (err) => {
          this.caricamento = false;
        },
      });
    }
  }

}