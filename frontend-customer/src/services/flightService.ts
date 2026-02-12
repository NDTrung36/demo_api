import apiClient from '../lib/api-client';
import { ApiResponse, FlightDto, FlightSearchParams } from '../types/flight';

export const flightService = {
    /**
     * Search for flights based on search criteria
     */
    searchFlights: async (params: FlightSearchParams): Promise<FlightDto[]> => {
        const response = await apiClient.get<ApiResponse<FlightDto[]>>('/v1/flights/search', {
            params,
        });
        return response.data.data;
    },
};
