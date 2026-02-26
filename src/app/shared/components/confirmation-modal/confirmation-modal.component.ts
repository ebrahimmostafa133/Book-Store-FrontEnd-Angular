import {Component, EventEmitter, Input, Output} from '@angular/core'

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModal {
  @Input() title: string = 'Confirm Action'
  @Input() message: string = 'Are you sure you want to proceed?'
  @Input() confirmText: string = 'Confirm'
  @Input() cancelText: string = 'Cancel'
  @Input() confirmColor: string = 'bg-red-600 hover:bg-red-700'
  @Input() isOpen: boolean = false

  @Output() confirmed = new EventEmitter<void>()
  @Output() cancelled = new EventEmitter<void>()

  onConfirm(): void {
    this.confirmed.emit()
  }

  onCancel(): void {
    this.cancelled.emit()
  }
}
