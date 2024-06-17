import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeStudenteTirocinioPageRoutingModule } from './home-studente-tirocinio-routing.module';

import { HomeStudenteTirocinioPage } from './home-studente-tirocinio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeStudenteTirocinioPageRoutingModule
  ],
  declarations: [HomeStudenteTirocinioPage]
})
export class HomeStudenteTirocinioPageModule {}
