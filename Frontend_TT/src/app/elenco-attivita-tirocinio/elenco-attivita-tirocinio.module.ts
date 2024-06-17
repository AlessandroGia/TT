import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ElencoAttivitaTirocinioPageRoutingModule } from './elenco-attivita-tirocinio-routing.module';

import { ElencoAttivitaTirocinioPage } from './elenco-attivita-tirocinio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ElencoAttivitaTirocinioPageRoutingModule
  ],
  declarations: [ElencoAttivitaTirocinioPage]
})
export class ElencoAttivitaTirocinioPageModule {}
