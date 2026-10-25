import { provideComponentTestDependencies } from '../../../../testing/component-test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialsAdminComponent } from './testimonials-admin.component';

describe('TestimonialsAdminComponent', () => {
  let component: TestimonialsAdminComponent;
  let fixture: ComponentFixture<TestimonialsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: provideComponentTestDependencies(),
      imports: [TestimonialsAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestimonialsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
