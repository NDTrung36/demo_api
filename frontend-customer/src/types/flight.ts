// Flight API Response Types
export interface Airport {
    code: string;
    name: string;
    city: string;
    country: string;
}

export interface FlightDto {
    id: number;
    flightNumber: string;
    airlineName: string;
    airlineCode: string;
    departureAirport: Airport;
    arrivalAirport: Airport;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: number;
    availableSeats: number;
    seatClassType: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// Search Request
export interface FlightSearchParams {
    originCode: string;
    destinationCode: string;
    departureDate: string; // ISO format: yyyy-MM-dd
    passengers: number;
}
