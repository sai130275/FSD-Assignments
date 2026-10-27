import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
  customerName = '';
  category = '';
  comments = '';
  email = '';

  categories = ['Service', 'Food Quality', 'Delivery', 'General Suggestion', 'Complaint', 'Compliment'];

  submitting = false;
  success = false;
  error = '';

  constructor(private api: ApiService) {}

  submitFeedback(form: NgForm): void {
    if (form.invalid) return;

    this.submitting = true;
    this.error = '';

    this.api.submitFeedback({
      customerName: this.customerName.trim(),
      category: this.category,
      comments: this.comments.trim(),
      email: this.email.trim() || undefined
    }).subscribe({
      next: () => {
        this.success = true;
        this.submitting = false;
        form.resetForm();
      },
      error: (err) => {
        this.error = err.error?.message || err.error?.errors?.[0]?.msg || 'Failed to submit feedback.';
        this.submitting = false;
      }
    });
  }

  reset(): void {
    this.success = false;
    this.error = '';
  }
}
