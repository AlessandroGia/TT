import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisualizzazioneTesiPageRoutingModule } from './visualizzazione-tesi-routing.module';

import { VisualizzazioneTesiPage } from './visualizzazione-tesi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisualizzazioneTesiPageRoutingModule
  ],
  declarations: [VisualizzazioneTesiPage]
})
export class VisualizzazioneTesiPageModule {}
