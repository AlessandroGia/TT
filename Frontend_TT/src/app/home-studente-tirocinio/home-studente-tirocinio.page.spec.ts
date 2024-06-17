import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeStudenteTirocinioPage } from './home-studente-tirocinio.page';

describe('HomeStudenteTirocinioPage', () => {
  let component: HomeStudenteTirocinioPage;
  let fixture: ComponentFixture<HomeStudenteTirocinioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HomeStudenteTirocinioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
