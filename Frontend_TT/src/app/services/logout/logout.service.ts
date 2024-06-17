import { Injectable } from '@angular/core';
import { AllegatiTesiTirocinioService } from '../allegati-tesi-tirocinio/allegati-tesi-tirocinio.service';
import { AllegatoService } from '../allegato/allegato.service';
import { AttivitaService } from '../attivita/attivita.service';
import { ElencoAttivitaService } from '../elenco-attivita/elenco-attivita.service';
import { HomeTesiService } from '../home-tesi/home-tesi.service';
import { HomeTirocinioService } from '../home-tirocinio/home-tirocinio.service';
import { TesiService } from '../tesi/tesi.service';
import { TirocinioService } from '../tirocinio/tirocinio.service';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(
    private allegatiTesiTirocinioService: AllegatiTesiTirocinioService,
    private allegatoService: AllegatoService,
    private attivita: AttivitaService,
    private elencoAttivita: ElencoAttivitaService,
    private homeTesiService: HomeTesiService,
    private homeTirocinioService: HomeTirocinioService,
    private sharedService: SharedService,
    private tesiService: TesiService,
    private tirocinioService: TirocinioService
  ) { }

  public logOut() {
    this.allegatiTesiTirocinioService.resetAll();
    this.allegatoService.resetAll();
    this.attivita.resetAll();
    this.elencoAttivita.resetAll();
    this.homeTesiService.resetAll();
    this.homeTirocinioService.resetAll();
    this.sharedService.logOut();
    this.tesiService.resetAll();
    this.tirocinioService.resetAll();
  }

 }
