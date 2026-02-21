import type {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms'
import {CommonModule} from '@angular/common'
import {Component, inject, signal} from '@angular/core'
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import {AuthService} from '../../services/auth.service'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
})
export class Register {
  accountTypes = ['user', 'admin']

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')
    const confirmPassword = control.get('confirmPassword')

    return password && confirmPassword && password.value !== confirmPassword.value
      ? {passwordMismatch: true}
      : null
  }

  ageValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const birthDate = new Date(control.value)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()

    if (age < 0) {
      return {futureDate: true}
    // } else if (age < 18 ){
    //   return { underage: true }
    } else {
      return null
    }
  }

  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    dob: new FormControl('', [Validators.required, this.ageValidator]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, {validators: this.passwordMatchValidator})

  private authService = inject(AuthService)
  errorMessage = signal<string | null>(null)

  onSubmit() {
    if (this.registerForm.valid) {
      const {confirmPassword, ...signupData} = this.registerForm.value

      this.authService.register(signupData).subscribe({
        next: () => console.log('Registration Successful'),
        error: (err) => {
          this.errorMessage.set(err.error?.message
            || 'something went wrong')
        },
      })
    }
  }
}
