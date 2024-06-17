import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisualizzazioneAllegatoPage } from './visualizzazione-allegato.page';

const routes: Routes = [
  {
    path: '',
    component: VisualizzazioneAllegatoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizzazioneAllegatoPageRoutingModule {}
