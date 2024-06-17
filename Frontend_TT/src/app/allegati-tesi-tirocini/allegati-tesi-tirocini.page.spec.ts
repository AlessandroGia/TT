import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllegatiTesiTirociniPage } from './allegati-tesi-tirocini.page';

describe('AllegatiTesiTirociniPage', () => {
  let component: AllegatiTesiTirociniPage;
  let fixture: ComponentFixture<AllegatiTesiTirociniPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AllegatiTesiTirociniPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
