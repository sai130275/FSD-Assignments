import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  customerName = '';
  customerPhone = '';
  bookingDate = '';
  bookingTime = '';
  guestCount = 2;
  specialRequests = '';

  submitting = false;
  success = false;
  error = '';
  bookingResult: any = null;

  minDate = '';
  timeSlots: string[] = [];

  ngOnInit(): void {
    // Minimum date = today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.generateTimeSlots();
  }

  generateTimeSlots(): void {
    this.timeSlots = [];
    for (let h = 10; h < 22; h++) {
      this.timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
      this.timeSlots.push(`${h.toString().padStart(2, '0')}:30`);
    }
  }

  constructor(private api: ApiService) {}

  submitBooking(form: NgForm): void {
    if (form.invalid) return;

    this.submitting = true;
    this.error = '';

    const payload = {
      customerName: this.customerName.trim(),
      customerPhone: this.customerPhone.trim(),
      bookingDate: this.bookingDate,
      bookingTime: this.bookingTime,
      guestCount: Number(this.guestCount),
      specialRequests: this.specialRequests.trim()
    };

    this.api.createBooking(payload).subscribe({
      next: (res) => {
        this.success = true;
        this.bookingResult = res.data;
        this.submitting = false;
        form.resetForm({ guestCount: 2 });
      },
      error: (err) => {
        this.error = err.error?.message || err.error?.errors?.[0]?.msg || 'Booking failed. Please try again.';
        this.submitting = false;
      }
    });
  }

  newBooking(): void {
    this.success = false;
    this.bookingResult = null;
    this.error = '';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
}
