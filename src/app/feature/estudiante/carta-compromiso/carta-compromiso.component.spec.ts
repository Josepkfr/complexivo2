import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaCompromisoComponent } from './carta-compromiso.component';

describe('CartaCompromisoComponent', () => {
  let component: CartaCompromisoComponent;
  let fixture: ComponentFixture<CartaCompromisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartaCompromisoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartaCompromisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
