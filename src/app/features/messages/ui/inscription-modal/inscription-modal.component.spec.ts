import { provideComponentTestDependencies } from '../../../../testing/component-test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionModalComponent } from './inscription-modal.component';

describe('InscriptionModalComponent', () => {
  let component: InscriptionModalComponent;
  let fixture: ComponentFixture<InscriptionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: provideComponentTestDependencies(),
      imports: [InscriptionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscriptionModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('formation', { id: 1, nom: 'Formation test' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
