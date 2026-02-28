import type {FormGroup} from '@angular/forms'
import {CommonModule} from '@angular/common'
import {Component, inject} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import {AuthService} from '../../services/auth.service'

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)

  step: 1 | 2 | 3 = 1
  isLoading = false
  errorMessage = ''
  successMessage = ''
  private submittedResetCode = '' // carry code from step 2 → step 3

  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  })

  codeForm: FormGroup = this.fb.group({
    resetCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  })

  passwordForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  }, {validators: this.passwordMatchValidator})

  private passwordMatchValidator(group: FormGroup) {
    const pw = group.get('password')?.value
    const cpw = group.get('confirmPassword')?.value
    return pw === cpw ? null : {mismatch: true}
  }

  // Step 1: send email
  onEmailSubmit() {
    if (this.emailForm.invalid) { return }
    this.isLoading = true
    this.errorMessage = ''

    this.authService.forgotPassword(this.emailForm.value.email).subscribe({
      next: (res) => {
        this.isLoading = false
        this.successMessage = res.message
        this.step = 2
      },
      error: (err) => {
        this.isLoading = false
        this.errorMessage = err.error?.message || 'Failed to send reset code'
      },
    })
  }

  // Step 2: verify code
  onCodeSubmit() {
    if (this.codeForm.invalid) { return }
    this.isLoading = true
    this.errorMessage = ''
    this.successMessage = ''

    this.authService.verifyResetCode(this.codeForm.value.resetCode).subscribe({
      next: (res) => {
        this.isLoading = false
        this.submittedResetCode = this.codeForm.value.resetCode
        this.successMessage = res.message
        this.step = 3
      },
      error: (err) => {
        this.isLoading = false
        this.errorMessage = err.error?.message || 'Invalid or expired code'
      },
    })
  }

  // Step 3: update password
  onPasswordSubmit() {
    if (this.passwordForm.invalid) { return }
    this.isLoading = true
    this.errorMessage = ''
    this.successMessage = ''

    this.authService.updatePassword(this.submittedResetCode, this.passwordForm.value.password).subscribe({
      next: (res) => {
        this.isLoading = false
        this.successMessage = res.message
        setTimeout(() => this.router.navigate(['/login']), 2000)
      },
      error: (err) => {
        this.isLoading = false
        this.errorMessage = err.error?.message || 'Failed to update password'
      },
    })
  }
}
