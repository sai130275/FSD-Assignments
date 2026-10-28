import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem } from '../models/menu-item.model';
import { PlaceOrderRequest, OrderResponse } from '../models/order.model';
import { BookingRequest, BookingResponse } from '../models/booking.model';
import { RatingRequest, RatingsResponse } from '../models/rating.model';
import { FeedbackRequest } from '../models/feedback.model';

const API = 'http://localhost:3000/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // ── Menu ──────────────────────────────────────────────────────────────
  getMenu(category?: string): Observable<ApiResponse<MenuItem[]>> {
    let params = new HttpParams();
    if (category && category !== 'All') params = params.set('category', category);
    return this.http.get<ApiResponse<MenuItem[]>>(`${API}/menu`, { params });
  }

  getCategories(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${API}/menu/categories`);
  }

  // ── Orders ────────────────────────────────────────────────────────────
  placeOrder(order: PlaceOrderRequest): Observable<ApiResponse<OrderResponse>> {
    return this.http.post<ApiResponse<OrderResponse>>(`${API}/orders`, order);
  }

  getOrder(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${API}/orders/${id}`);
  }

  // ── Bookings ──────────────────────────────────────────────────────────
  createBooking(booking: BookingRequest): Observable<ApiResponse<BookingResponse>> {
    return this.http.post<ApiResponse<BookingResponse>>(`${API}/bookings`, booking);
  }

  getBooking(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${API}/bookings/${id}`);
  }

  // ── Ratings ───────────────────────────────────────────────────────────
  getRatings(): Observable<ApiResponse<RatingsResponse>> {
    return this.http.get<ApiResponse<RatingsResponse>>(`${API}/ratings`);
  }

  submitRating(rating: RatingRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${API}/ratings`, rating);
  }

  // ── Feedback ──────────────────────────────────────────────────────────
  submitFeedback(feedback: FeedbackRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${API}/feedback`, feedback);
  }

  checkHealth(): Observable<any> {
    return this.http.get(`${API}/health`);
  }
}
