import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { flightService } from '../services/flightService';
import { FlightCard } from '../components/FlightCard';
import { Plane, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export function SearchResults() {
    const [searchParams] = useSearchParams();

    const originCode = searchParams.get('originCode') || '';
    const destinationCode = searchParams.get('destinationCode') || '';
    const departureDate = searchParams.get('departureDate') || '';
    const passengers = parseInt(searchParams.get('passengers') || '1');

    const { data: flights, isLoading, error } = useQuery({
        queryKey: ['flights', originCode, destinationCode, departureDate, passengers],
        queryFn: () =>
            flightService.searchFlights({
                originCode,
                destinationCode,
                departureDate,
                passengers,
            }),
        enabled: !!(originCode && destinationCode && departureDate),
    });

    // Loading state
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
                    <p className="mt-4 text-lg text-gray-600">Searching for flights...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                    <p className="mt-4 text-lg font-semibold text-gray-900">Error loading flights</p>
                    <p className="mt-2 text-sm text-gray-600">
                        {error instanceof Error ? error.message : 'Please try again later'}
                    </p>
                </div>
            </div>
        );
    }

    // No flights found
    if (!flights || flights.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Plane className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-lg font-semibold text-gray-900">No flights found</p>
                    <p className="mt-2 text-sm text-gray-600">Try adjusting your search criteria</p>
                </div>
            </div>
        );
    }

    const formattedDate = format(new Date(departureDate), 'dd MMM yyyy');

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {originCode} → {destinationCode}
                    </h1>
                    <p className="mt-2 text-gray-600">
                        {formattedDate} · {passengers} {passengers === 1 ? 'passenger' : 'passengers'}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        {flights.length} {flights.length === 1 ? 'flight' : 'flights'} available
                    </p>
                </div>

                {/* Flight List */}
                <div className="space-y-4">
                    {flights.map((flight) => (
                        <FlightCard key={`${flight.id}-${flight.seatClassType}`} flight={flight} />
                    ))}
                </div>
            </div>
        </div>
    );
}
