import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeStudenteTesiPageRoutingModule } from './home-studente-tesi-routing.module';

import { HomeStudenteTesiPage } from './home-studente-tesi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeStudenteTesiPageRoutingModule
  ],
  declarations: [HomeStudenteTesiPage]
})
export class HomeStudenteTesiPageModule {}
