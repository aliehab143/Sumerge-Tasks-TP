import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { Auth } from './auth';
import { AuthService } from '../../services/auth.service';

describe('Auth', () => {
  let component: Auth;
  let fixture: ComponentFixture<Auth>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login', 'register']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Auth, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Auth);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with forms', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.registerForm).toBeDefined();
  });

  it('should have initial loading state as false', () => {
    expect(component.isLoading).toBeFalse();
  });

  it('should validate required email field', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('');
    emailControl?.markAsTouched();
    
    expect(component.hasError(component.loginForm, 'email')).toBeTrue();
  });

  it('should validate required password field', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('');
    passwordControl?.markAsTouched();
    
    expect(component.hasError(component.loginForm, 'password')).toBeTrue();
  });

  it('should call authService.login when form is valid', () => {
    mockAuthService.login.and.returnValue(of({ success: true }));
    
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });
    
    component.onLogin();
    
    expect(mockAuthService.login).toHaveBeenCalled();
  });

  it('should call authService.register when form is valid', () => {
    mockAuthService.register.and.returnValue(of({ success: true }));
    
    component.registerForm.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
    
    component.onRegister();
    
    expect(mockAuthService.register).toHaveBeenCalled();
  });
});
