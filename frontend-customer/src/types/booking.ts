// Booking API Types
export interface BookingRequest {
    flightId: number;
    seatClassType: string;
    passenger: PassengerInfo;
}

export interface PassengerInfo {
    fullName: string;
    email: string;
    phone: string;
    passportNumber: string;
    dateOfBirth?: string; // ISO format: yyyy-MM-dd
    nationality?: string;
}

export interface BookingResponse {
    id: number;
    bookingReference: string;
    status: string;
    totalAmount: number;
    flight: import('./flight').FlightDto;
    passenger: PassengerInfo;
}
