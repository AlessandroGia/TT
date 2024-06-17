import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllegatiTesiTirociniPage } from './allegati-tesi-tirocini.page';

const routes: Routes = [
  {
    path: '',
    component: AllegatiTesiTirociniPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllegatiTesiTirociniPageRoutingModule {}
