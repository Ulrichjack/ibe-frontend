import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappBubbleComponent } from './whatsapp-bubble.component';

describe('WhatsappBubbleComponent', () => {
  let component: WhatsappBubbleComponent;
  let fixture: ComponentFixture<WhatsappBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsappBubbleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
