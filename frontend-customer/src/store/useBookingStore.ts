import { create } from 'zustand';
import { FlightDto, FlightSearchParams } from '../types/flight';
import { BookingResponse } from '../types/booking';

interface BookingStore {
    // Search parameters
    searchParams: FlightSearchParams | null;
    setSearchParams: (params: FlightSearchParams) => void;

    // Selected flight and seat class
    selectedFlight: FlightDto | null;
    selectedSeatClass: string | null;
    selectFlight: (flight: FlightDto, seatClass: string) => void;
    clearSelection: () => void;

    // Booking result
    bookingResponse: BookingResponse | null;
    setBookingResponse: (response: BookingResponse) => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
    searchParams: null,
    setSearchParams: (params) => set({ searchParams: params }),

    selectedFlight: null,
    selectedSeatClass: null,
    selectFlight: (flight, seatClass) => set({ selectedFlight: flight, selectedSeatClass: seatClass }),
    clearSelection: () => set({ selectedFlight: null, selectedSeatClass: null }),

    bookingResponse: null,
    setBookingResponse: (response) => set({ bookingResponse: response }),
}));
