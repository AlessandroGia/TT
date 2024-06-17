import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisualizzazioneAllegatoPage } from './visualizzazione-allegato.page';

describe('VisualizzazioneAllegatoPage', () => {
  let component: VisualizzazioneAllegatoPage;
  let fixture: ComponentFixture<VisualizzazioneAllegatoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VisualizzazioneAllegatoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
