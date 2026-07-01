import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationsAdminComponent } from './formations-admin.component';

describe('FormationsAdminComponent', () => {
  let component: FormationsAdminComponent;
  let fixture: ComponentFixture<FormationsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormationsAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
