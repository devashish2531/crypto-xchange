import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoxchangeComponent } from './cryptoxchange.component';

describe('CryptoxchangeComponent', () => {
  let component: CryptoxchangeComponent;
  let fixture: ComponentFixture<CryptoxchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CryptoxchangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptoxchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
