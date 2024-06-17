import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisualizzazioneTesiPage } from './visualizzazione-tesi.page';

describe('VisualizzazioneTesiPage', () => {
  let component: VisualizzazioneTesiPage;
  let fixture: ComponentFixture<VisualizzazioneTesiPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VisualizzazioneTesiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
