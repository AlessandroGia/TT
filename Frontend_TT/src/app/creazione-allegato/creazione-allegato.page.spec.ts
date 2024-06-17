import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreazioneAllegatoPage } from './creazione-allegato.page';

describe('CreazioneAllegatoPage', () => {
  let component: CreazioneAllegatoPage;
  let fixture: ComponentFixture<CreazioneAllegatoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreazioneAllegatoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
