import { FlightDto } from '../types/flight';
import { useBookingStore } from '../store/useBookingStore';
import { useNavigate } from 'react-router-dom';
import { Plane } from 'lucide-react';
import { format } from 'date-fns';

interface FlightCardProps {
    flight: FlightDto;
}

export function FlightCard({ flight }: FlightCardProps) {
    const navigate = useNavigate();
    const selectFlight = useBookingStore((state) => state.selectFlight);

    const handleSelectFlight = () => {
        selectFlight(flight, flight.seatClassType);
        navigate('/booking-details');
    };

    const formatTime = (dateTimeString: string) => {
        return format(new Date(dateTimeString), 'HH:mm');
    };

    const formatDate = (dateTimeString: string) => {
        return format(new Date(dateTimeString), 'MMM dd');
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="grid grid-cols-[auto_1fr_auto] gap-6">
                {/* Left: Airline Info */}
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                        <Plane className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{flight.airlineName}</p>
                        <p className="text-sm text-gray-500">{flight.flightNumber}</p>
                    </div>
                </div>

                {/* Middle: Flight Details */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    {/* Departure */}
                    <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{formatTime(flight.departureTime)}</p>
                        <p className="text-sm font-medium text-gray-600">{flight.departureAirport.code}</p>
                        <p className="text-xs text-gray-500">{formatDate(flight.departureTime)}</p>
                    </div>

                    {/* Duration */}
                    <div className="flex min-w-[120px] flex-col items-center">
                        <p className="text-xs text-gray-500">{flight.duration}</p>
                        <div className="my-1 h-px w-full bg-gray-300"></div>
                        <p className="text-xs font-medium text-gray-600">{flight.seatClassType}</p>
                    </div>

                    {/* Arrival */}
                    <div className="text-left">
                        <p className="text-2xl font-bold text-gray-900">{formatTime(flight.arrivalTime)}</p>
                        <p className="text-sm font-medium text-gray-600">{flight.arrivalAirport.code}</p>
                        <p className="text-xs text-gray-500">{formatDate(flight.arrivalTime)}</p>
                    </div>
                </div>

                {/* Right: Price & Action */}
                <div className="flex flex-col items-end justify-center gap-3">
                    <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                            ${flight.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">{flight.availableSeats} seats left</p>
                    </div>
                    <button
                        onClick={handleSelectFlight}
                        className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Select Flight
                    </button>
                </div>
            </div>
        </div>
    );
}
