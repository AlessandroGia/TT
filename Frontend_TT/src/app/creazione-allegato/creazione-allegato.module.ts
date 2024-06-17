import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreazioneAllegatoPageRoutingModule } from './creazione-allegato-routing.module';

import { CreazioneAllegatoPage } from './creazione-allegato.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreazioneAllegatoPageRoutingModule
  ],
  declarations: [CreazioneAllegatoPage]
})
export class CreazioneAllegatoPageModule {}
