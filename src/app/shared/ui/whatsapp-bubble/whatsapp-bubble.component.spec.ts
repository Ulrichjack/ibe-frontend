import { provideComponentTestDependencies } from '../../../testing/component-test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsAppBubbleComponent } from './whatsapp-bubble.component';

describe('WhatsAppBubbleComponent', () => {
  let component: WhatsAppBubbleComponent;
  let fixture: ComponentFixture<WhatsAppBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: provideComponentTestDependencies(),
      imports: [WhatsAppBubbleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsAppBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
