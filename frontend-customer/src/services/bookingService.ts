import apiClient from '../lib/api-client';
import { ApiResponse } from '../types/flight';
import { BookingRequest, BookingResponse } from '../types/booking';

export const bookingService = {
    /**
     * Create a new booking
     */
    createBooking: async (request: BookingRequest): Promise<BookingResponse> => {
        console.log('==== BOOKING API REQUEST ====');
        console.log('URL: /api/v1/bookings');
        console.log('Request payload:', JSON.stringify(request, null, 2));
        console.log('============================');

        const response = await apiClient.post<ApiResponse<BookingResponse>>('/v1/bookings', request);

        console.log('==== BOOKING API RESPONSE ====');
        console.log('Status:', response.status);
        console.log('Response data:', JSON.stringify(response.data, null, 2));
        console.log('==============================');

        return response.data.data;
    },
};
