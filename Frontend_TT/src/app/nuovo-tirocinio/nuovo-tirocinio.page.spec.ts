import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuovoTirocinioPage } from './nuovo-tirocinio.page';

describe('NuovoTirocinioPage', () => {
  let component: NuovoTirocinioPage;
  let fixture: ComponentFixture<NuovoTirocinioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NuovoTirocinioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
