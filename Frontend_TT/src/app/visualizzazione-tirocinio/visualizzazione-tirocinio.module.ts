import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisualizzazioneTirocinioPageRoutingModule } from './visualizzazione-tirocinio-routing.module';

import { VisualizzazioneTirocinioPage } from './visualizzazione-tirocinio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisualizzazioneTirocinioPageRoutingModule
  ],
  declarations: [VisualizzazioneTirocinioPage]
})
export class VisualizzazioneTirocinioPageModule {}
