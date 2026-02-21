import {CommonModule} from '@angular/common'
import {Component, inject, signal} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {AuthService} from '../../services/auth.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  })

  constructor(private _fb: FormBuilder) {}

  errorMessage = signal<string | null>(null)

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => console.log('Logged in!'),
        error: (err) => {
          this.errorMessage.set(err.error?.message
            || 'Invalid email or password. Please try again.')
        },
      })
    }
  }
}
