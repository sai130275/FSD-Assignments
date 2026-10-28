export interface BookingRequest {
  customerName: string;
  customerPhone: string;
  bookingDate: string;
  bookingTime: string;
  guestCount: number;
  specialRequests?: string;
}

export interface BookingResponse {
  bookingId: string;
  referenceId: string;
  tableNumber: number;
  bookingDate: string;
  bookingTime: string;
  guestCount: number;
  status: string;
}
