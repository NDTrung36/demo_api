import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useBookingStore } from '../store/useBookingStore';
import { bookingService } from '../services/bookingService';
import { PassengerInfo } from '../types/booking';
import { Plane, User, Mail, Phone, CreditCard, Calendar, Globe, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export function BookingDetails() {
    const navigate = useNavigate();
    const { selectedFlight, selectedSeatClass, setBookingResponse } = useBookingStore();

    const [formData, setFormData] = useState<PassengerInfo>({
        fullName: '',
        email: '',
        phone: '',
        passportNumber: '',
        dateOfBirth: '',
        nationality: '',
    });

    const { mutate: createBooking, isPending, error } = useMutation({
        mutationFn: () => {
            if (!selectedFlight || !selectedSeatClass) {
                throw new Error('No flight selected');
            }
            return bookingService.createBooking({
                flightId: selectedFlight.id,
                seatClassType: selectedSeatClass,
                passenger: formData,
            });
        },
        onSuccess: (data) => {
            setBookingResponse(data);
            navigate('/payment-preview');
        },
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        createBooking();
    };

    // Redirect if no flight selected
    if (!selectedFlight || !selectedSeatClass) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
                    <p className="mt-4 text-lg font-semibold text-gray-900">No flight selected</p>
                    <p className="mt-2 text-sm text-gray-600">Please search and select a flight first</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
                    <p className="mt-2 text-gray-600">Enter passenger information to complete your booking</p>
                </div>

                {/* Selected Flight Summary */}
                <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">Selected Flight</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-900">{selectedFlight.airlineName}</p>
                            <p className="text-sm text-gray-500">{selectedFlight.flightNumber}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                    {format(new Date(selectedFlight.departureTime), 'HH:mm')}
                                </p>
                                <p className="text-sm text-gray-500">{selectedFlight.departureAirport.code}</p>
                            </div>
                            <Plane className="h-5 w-5 text-gray-400" />
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">
                                    {format(new Date(selectedFlight.arrivalTime), 'HH:mm')}
                                </p>
                                <p className="text-sm text-gray-500">{selectedFlight.arrivalAirport.code}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-600">{selectedSeatClass}</p>
                            <p className="text-2xl font-bold text-blue-600">
                                ${selectedFlight.price.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Passenger Form */}
                <form onSubmit={handleSubmit} className="rounded-lg bg-white p-8 shadow-sm">
                    <h2 className="mb-6 text-lg font-semibold text-gray-900">Passenger Information</h2>

                    <div className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                Full Name *
                            </label>
                            <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
                                <User className="h-5 w-5 text-gray-400" />
                                <input
                                    id="fullName"
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                    placeholder="John Doe"
                                    className="w-full border-0 p-0 focus:outline-none focus:ring-0"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address *
                            </label>
                            <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
                                <Mail className="h-5 w-5 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    placeholder="john@example.com"
                                    className="w-full border-0 p-0 focus:outline-none focus:ring-0"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number *
                            </label>
                            <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
                                <Phone className="h-5 w-5 text-gray-400" />
                                <input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                    placeholder="+84 123 456 789"
                                    className="w-full border-0 p-0 focus:outline-none focus:ring-0"
                                />
                            </div>
                        </div>

                        {/* Passport Number */}
                        <div>
                            <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-700">
                                Passport Number *
                            </label>
                            <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
                                <CreditCard className="h-5 w-5 text-gray-400" />
                                <input
                                    id="passportNumber"
                                    type="text"
                                    value={formData.passportNumber}
                                    onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                                    required
                                    placeholder="A12345678"
                                    className="w-full border-0 p-0 focus:outline-none focus:ring-0"
                                />
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Date of Birth */}
                            <div>
                                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                                    Date of Birth
                                </label>
                                <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                    <input
                                        id="dateOfBirth"
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                        className="w-full border-0 p-0 focus:outline-none focus:ring-0"
                                    />
                                </div>
                            </div>

                            {/* Nationality */}
                            <div>
                                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                                    Nationality
                                </label>
                                <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
                                    <Globe className="h-5 w-5 text-gray-400" />
                                    <input
                                        id="nationality"
                                        type="text"
                                        value={formData.nationality}
                                        onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                        placeholder="Vietnam"
                                        className="w-full border-0 p-0 focus:outline-none focus:ring-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mt-6 rounded-lg bg-red-50 p-4">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                                <p className="text-sm font-medium text-red-800">
                                    {error instanceof Error ? error.message : 'Failed to create booking'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="mt-8 flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/search')}
                            className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Back to Results
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                'Continue to Payment'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
