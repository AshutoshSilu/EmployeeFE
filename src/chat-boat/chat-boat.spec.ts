import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBoat } from './chat-boat';

describe('ChatBoat', () => {
  let component: ChatBoat;
  let fixture: ComponentFixture<ChatBoat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBoat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatBoat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
