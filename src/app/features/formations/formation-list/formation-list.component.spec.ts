import { provideComponentTestDependencies } from '../../../testing/component-test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationListComponent } from './formation-list.component';

describe('FormationListComponent', () => {
  let component: FormationListComponent;
  let fixture: ComponentFixture<FormationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: provideComponentTestDependencies(),
      imports: [FormationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
