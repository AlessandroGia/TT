import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreazioneAttivitaPage } from './creazione-attivita.page';

describe('CreazioneAttivitaPage', () => {
  let component: CreazioneAttivitaPage;
  let fixture: ComponentFixture<CreazioneAttivitaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreazioneAttivitaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
