import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Rating } from '../../models/rating.model';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})
export class RatingsComponent implements OnInit {
  ratings: Rating[] = [];
  average = 0;
  totalCount = 0;
  loading = true;
  error = '';

  // Form fields
  customerName = '';
  stars = 0;
  hoverStar = 0;
  review = '';
  category = 'Overall';
  categories = ['Overall', 'Food', 'Service', 'Ambiance', 'Value'];

  submitting = false;
  submitSuccess = false;
  submitError = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadRatings();
  }

  loadRatings(): void {
    this.loading = true;
    this.api.getRatings().subscribe({
      next: (res) => {
        this.ratings = res.data.ratings;
        this.average = res.data.average;
        this.totalCount = res.data.totalCount;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load ratings.';
        this.loading = false;
      }
    });
  }

  submitRating(form: NgForm): void {
    if (form.invalid || this.stars === 0) {
      this.submitError = this.stars === 0 ? 'Please select a star rating.' : 'Please fill in all required fields.';
      return;
    }

    this.submitting = true;
    this.submitError = '';

    this.api.submitRating({
      customerName: this.customerName.trim(),
      stars: this.stars,
      review: this.review.trim(),
      category: this.category
    }).subscribe({
      next: () => {
        this.submitSuccess = true;
        this.submitting = false;
        form.resetForm();
        this.stars = 0;
        this.category = 'Overall';
        setTimeout(() => { this.submitSuccess = false; this.loadRatings(); }, 2000);
      },
      error: (err) => {
        this.submitError = err.error?.message || err.error?.errors?.[0]?.msg || 'Failed to submit rating.';
        this.submitting = false;
      }
    });
  }

  starArray(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i + 1);
  }

  getStarLabel(n: number): string {
    return ['', '😞 Poor', '😐 Fair', '🙂 Good', '😊 Very Good', '🤩 Excellent'][n] || '';
  }
}
