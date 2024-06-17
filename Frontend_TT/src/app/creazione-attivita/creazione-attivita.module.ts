import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreazioneAttivitaPageRoutingModule } from './creazione-attivita-routing.module';

import { CreazioneAttivitaPage } from './creazione-attivita.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreazioneAttivitaPageRoutingModule
  ],
  declarations: [CreazioneAttivitaPage]
})
export class CreazioneAttivitaPageModule {}
