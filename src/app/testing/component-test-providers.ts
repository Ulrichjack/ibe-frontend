import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

// Dépendances des tests de composants ; toutes les requêtes restent simulées.
export function provideComponentTestDependencies() {
  return [provideHttpClient(), provideHttpClientTesting(), provideRouter([])];
}
