import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LibrettoDiarioPageRoutingModule } from './libretto-diario-routing.module';

import { LibrettoDiarioPage } from './libretto-diario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LibrettoDiarioPageRoutingModule
  ],
  declarations: [LibrettoDiarioPage]
})
export class LibrettoDiarioPageModule {}
