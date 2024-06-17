import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibrettoDiarioPage } from './libretto-diario.page';

describe('LibrettoDiarioPage', () => {
  let component: LibrettoDiarioPage;
  let fixture: ComponentFixture<LibrettoDiarioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LibrettoDiarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
