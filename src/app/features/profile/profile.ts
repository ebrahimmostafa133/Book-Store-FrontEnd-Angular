import type {OnInit} from '@angular/core'
import type {FormGroup} from '@angular/forms'
import type {UserProfile} from '../../core/interfaces/user.interface'
import {CommonModule} from '@angular/common'
import {Component, inject, signal} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {ToastrService} from 'ngx-toastr'
import {UserService} from '../../core/services/user.service'

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  private fb = inject(FormBuilder)
  private userService = inject(UserService)
  private toastr = inject(ToastrService)

  profileForm: FormGroup
  isEditMode = signal(false)
  isLoading = signal(false)
  userData: UserProfile | null = null

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dob: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.loadProfile()
  }

  loadProfile() {
    this.isLoading.set(true)
    this.userService.getUserProfile().subscribe({
      next: (res) => {
        this.userData = res.data
        this.profileForm.patchValue({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          dob: res.data.dob ? new Date(res.data.dob).toISOString().split('T')[0] : '',
        })
        this.isLoading.set(false)
      },
      error: () => {
        this.toastr.error('Failed to load profile')
        this.isLoading.set(false)
      },
    })
  }

  toggleEdit() {
    if (this.isEditMode()) {
      // If canceling, reset form to original data
      this.loadProfile()
    }
    this.isEditMode.set(!this.isEditMode())
  }

  onSubmit() {
    if (this.profileForm.invalid) { return }

    this.isLoading.set(true)
    this.userService.updateUserProfile(this.profileForm.value).subscribe({
      next: (res) => {
        this.userData = res.data
        this.toastr.success('Profile updated!')
        this.isEditMode.set(false)
        this.isLoading.set(false)
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Update failed')
        this.isLoading.set(false)
      },
    })
  }
}
