import { provideComponentTestDependencies } from '../../../testing/component-test-providers';
import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationDetailComponent } from './formation-detail.component';

describe('FormationDetailComponent', () => {
  let component: FormationDetailComponent;
  let fixture: ComponentFixture<FormationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: provideComponentTestDependencies(),
      imports: [FormationDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('affiche la photo de groupe quand la formation ne possède aucune photo', () => {
    component.loadFormation('ancienne-formation');
    const http = TestBed.inject(HttpTestingController);
    http.expectOne(request => request.url.endsWith('/formations/slug/ancienne-formation')).flush({
      success: true,
      data: { id: 1, nom: 'Formation héritée', description: 'Description', categorie: 'Esthétique',
        slug: 'ancienne-formation', photoPrincipale: null, photosGalerie: [], prix: null,
        nombrePlaces: null, placesRestantesAffichees: 0, active: true }
    });
    fixture.detectChanges();
    const image = fixture.nativeElement.querySelector('img[alt="Formation héritée"]') as HTMLImageElement;
    expect(image.getAttribute('src')).toBe('assets/img/ibe-formation.webp');
    http.verify();
  });

});
