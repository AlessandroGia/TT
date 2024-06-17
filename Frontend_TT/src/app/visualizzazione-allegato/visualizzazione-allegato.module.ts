import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisualizzazioneAllegatoPageRoutingModule } from './visualizzazione-allegato-routing.module';

import { VisualizzazioneAllegatoPage } from './visualizzazione-allegato.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisualizzazioneAllegatoPageRoutingModule
  ],
  declarations: [VisualizzazioneAllegatoPage]
})
export class VisualizzazioneAllegatoPageModule {}
