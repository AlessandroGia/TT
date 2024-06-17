import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllegatiTesiTirociniPageRoutingModule } from './allegati-tesi-tirocini-routing.module';

import { AllegatiTesiTirociniPage } from './allegati-tesi-tirocini.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllegatiTesiTirociniPageRoutingModule
  ],
  declarations: [AllegatiTesiTirociniPage]
})
export class AllegatiTesiTirociniPageModule {}
