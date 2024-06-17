import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuovaTesiPage } from './nuova-tesi.page';

describe('NuovaTesiPage', () => {
  let component: NuovaTesiPage;
  let fixture: ComponentFixture<NuovaTesiPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NuovaTesiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
