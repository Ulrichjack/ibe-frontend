import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LucideEye, LucideEyeOff, LucideLock, LucideUser } from '@lucide/angular';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideEye, LucideEyeOff, LucideLock, LucideUser],
  templateUrl: './admin-login.component.html'
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  currentYear = new Date().getFullYear();

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { username, password } = this.loginForm.value;

    this.authService.login(username!, password!).subscribe(success => {
      this.isLoading.set(false);
      if (success) {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.errorMessage.set('Identifiant ou mot de passe incorrect.');
      }
    });
  }
}
