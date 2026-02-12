import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Calendar, Users } from 'lucide-react';
import { useBookingStore } from '../store/useBookingStore';

export function Home() {
    const navigate = useNavigate();
    const setSearchParams = useBookingStore((state) => state.setSearchParams);

    const [originCode, setOriginCode] = useState('HAN');
    const [destinationCode, setDestinationCode] = useState('SGN');
    const [departureDate, setDepartureDate] = useState('2026-02-13');
    const [passengers, setPassengers] = useState(1);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();

        const searchParams = {
            originCode,
            destinationCode,
            departureDate,
            passengers,
        };

        setSearchParams(searchParams);

        navigate(
            `/search?originCode=${originCode}&destinationCode=${destinationCode}&departureDate=${departureDate}&passengers=${passengers}`,
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <Plane className="h-8 w-8 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-900">Flight Booking</h1>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-5xl font-bold tracking-tight text-gray-900">
                        Find Your Perfect Flight
                    </h2>
                    <p className="mt-4 text-xl text-gray-600">
                        Search and compare flights at the best prices
                    </p>
                </div>

                {/* Search Form */}
                <form
                    onSubmit={handleSearch}
                    className="mt-12 rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200"
                >
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {/* Origin */}
                        <div>
                            <label htmlFor="origin" className="block text-sm font-medium text-gray-700">
                                From
                            </label>
                            <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
                                <Plane className="h-5 w-5 text-gray-400" />
                                <input
                                    id="origin"
                                    type="text"
                                    value={originCode}
                                    onChange={(e) => setOriginCode(e.target.value.toUpperCase())}
                                    placeholder="HAN"
                                    maxLength={3}
                                    required
                                    className="w-full border-0 p-0 text-lg font-semibold uppercase text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
                                />
                            </div>
                        </div>

                        {/* Destination */}
                        <div>
                            <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                                To
                            </label>
                            <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
                                <Plane className="h-5 w-5 rotate-90 text-gray-400" />
                                <input
                                    id="destination"
                                    type="text"
                                    value={destinationCode}
                                    onChange={(e) => setDestinationCode(e.target.value.toUpperCase())}
                                    placeholder="SGN"
                                    maxLength={3}
                                    required
                                    className="w-full border-0 p-0 text-lg font-semibold uppercase text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
                                />
                            </div>
                        </div>

                        {/* Date */}
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                Departure
                            </label>
                            <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
                                <Calendar className="h-5 w-5 text-gray-400" />
                                <input
                                    id="date"
                                    type="date"
                                    value={departureDate}
                                    onChange={(e) => setDepartureDate(e.target.value)}
                                    required
                                    className="w-full border-0 p-0 text-lg font-semibold text-gray-900 focus:outline-none focus:ring-0"
                                />
                            </div>
                        </div>

                        {/* Passengers */}
                        <div>
                            <label htmlFor="passengers" className="block text-sm font-medium text-gray-700">
                                Passengers
                            </label>
                            <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
                                <Users className="h-5 w-5 text-gray-400" />
                                <input
                                    id="passengers"
                                    type="number"
                                    min="1"
                                    max="9"
                                    value={passengers}
                                    onChange={(e) => setPassengers(parseInt(e.target.value))}
                                    required
                                    className="w-full border-0 p-0 text-lg font-semibold text-gray-900 focus:outline-none focus:ring-0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Search Button */}
                    <button
                        type="submit"
                        className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3.5 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Search Flights
                    </button>
                </form>

                {/* Features */}
                <div className="mt-16 grid gap-8 sm:grid-cols-3">
                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <Plane className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="mt-4 font-semibold text-gray-900">Best Prices</h3>
                        <p className="mt-2 text-sm text-gray-600">Compare flights from all major airlines</p>
                    </div>
                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="mt-4 font-semibold text-gray-900">Flexible Dates</h3>
                        <p className="mt-2 text-sm text-gray-600">Find the best dates for your trip</p>
                    </div>
                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="mt-4 font-semibold text-gray-900">Easy Booking</h3>
                        <p className="mt-2 text-sm text-gray-600">Simple and secure booking process</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
