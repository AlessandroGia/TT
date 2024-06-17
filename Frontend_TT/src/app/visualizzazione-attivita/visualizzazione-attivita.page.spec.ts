import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisualizzazioneAttivitaPage } from './visualizzazione-attivita.page';

describe('VisualizzazioneAttivitaPage', () => {
  let component: VisualizzazioneAttivitaPage;
  let fixture: ComponentFixture<VisualizzazioneAttivitaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VisualizzazioneAttivitaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
