import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adslider } from './adslider';

describe('Adslider', () => {
  let component: Adslider;
  let fixture: ComponentFixture<Adslider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adslider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adslider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
