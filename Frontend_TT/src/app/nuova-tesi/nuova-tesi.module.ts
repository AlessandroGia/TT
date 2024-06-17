import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuovaTesiPageRoutingModule } from './nuova-tesi-routing.module';

import { NuovaTesiPage } from './nuova-tesi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuovaTesiPageRoutingModule,
  ],
  declarations: [NuovaTesiPage],
})
export class NuovaTesiPageModule {}
