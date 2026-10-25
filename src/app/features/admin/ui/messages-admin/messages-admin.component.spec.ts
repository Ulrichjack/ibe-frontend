import { provideComponentTestDependencies } from '../../../../testing/component-test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesAdminComponent } from './messages-admin.component';

describe('MessagesAdminComponent', () => {
  let component: MessagesAdminComponent;
  let fixture: ComponentFixture<MessagesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: provideComponentTestDependencies(),
      imports: [MessagesAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
