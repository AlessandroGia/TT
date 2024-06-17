import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisualizzazioneTirocinioPage } from './visualizzazione-tirocinio.page';

describe('VisualizzazioneTirocinioPage', () => {
  let component: VisualizzazioneTirocinioPage;
  let fixture: ComponentFixture<VisualizzazioneTirocinioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VisualizzazioneTirocinioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
