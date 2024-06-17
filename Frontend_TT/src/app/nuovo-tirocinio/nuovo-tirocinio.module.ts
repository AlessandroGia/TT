import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuovoTirocinioPageRoutingModule } from './nuovo-tirocinio-routing.module';

import { NuovoTirocinioPage } from './nuovo-tirocinio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuovoTirocinioPageRoutingModule
  ],
  declarations: [NuovoTirocinioPage]
})
export class NuovoTirocinioPageModule {}
