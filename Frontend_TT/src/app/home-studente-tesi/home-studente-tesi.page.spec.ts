import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeStudenteTesiPage } from './home-studente-tesi.page';

describe('HomeStudenteTesiPage', () => {
  let component: HomeStudenteTesiPage;
  let fixture: ComponentFixture<HomeStudenteTesiPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HomeStudenteTesiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
