import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElencoAttivitaTirocinioPage } from './elenco-attivita-tirocinio.page';

describe('ElencoAttivitaTirocinioPage', () => {
  let component: ElencoAttivitaTirocinioPage;
  let fixture: ComponentFixture<ElencoAttivitaTirocinioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ElencoAttivitaTirocinioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
