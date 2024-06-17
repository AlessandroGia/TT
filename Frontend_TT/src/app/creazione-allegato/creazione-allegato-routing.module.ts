import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreazioneAllegatoPage } from './creazione-allegato.page';

const routes: Routes = [
  {
    path: '',
    component: CreazioneAllegatoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreazioneAllegatoPageRoutingModule {}
