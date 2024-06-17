import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisualizzazioneAttivitaPageRoutingModule } from './visualizzazione-attivita-routing.module';

import { VisualizzazioneAttivitaPage } from './visualizzazione-attivita.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisualizzazioneAttivitaPageRoutingModule
  ],
  declarations: [VisualizzazioneAttivitaPage]
})
export class VisualizzazioneAttivitaPageModule {}
