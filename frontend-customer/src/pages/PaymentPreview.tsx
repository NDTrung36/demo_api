import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../store/useBookingStore';
import { Plane, CheckCircle, User, Mail, Phone, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

export function PaymentPreview() {
    const navigate = useNavigate();
    const { bookingResponse, selectedFlight } = useBookingStore();

    if (!bookingResponse || !selectedFlight) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">No booking found</p>
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
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                {/* Success Header */}
                <div className="mb-8 text-center">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                    <h1 className="mt-4 text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
                    <p className="mt-2 text-gray-600">Your booking reference is</p>
                    <p className="mt-1 text-2xl font-bold text-blue-600">{bookingResponse.bookingReference}</p>
                </div>

                {/* Booking Summary */}
                <div className="space-y-6">
                    {/* Flight Details Card */}
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Flight Details</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900">{selectedFlight.airlineName}</p>
                                    <p className="text-sm text-gray-500">{selectedFlight.flightNumber}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-gray-900">
                                            {format(new Date(selectedFlight.departureTime), 'HH:mm')}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {selectedFlight.departureAirport.code}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {format(new Date(selectedFlight.departureTime), 'dd MMM yyyy')}
                                        </p>
                                    </div>
                                    <Plane className="h-6 w-6 text-gray-400" />
                                    <div className="text-left">
                                        <p className="text-xl font-bold text-gray-900">
                                            {format(new Date(selectedFlight.arrivalTime), 'HH:mm')}
                                        </p>
                                        <p className="text-sm text-gray-500">{selectedFlight.arrivalAirport.code}</p>
                                        <p className="text-xs text-gray-400">
                                            {format(new Date(selectedFlight.arrivalTime), 'dd MMM yyyy')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Duration</p>
                                        <p className="font-medium text-gray-900">{selectedFlight.duration}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Seat Class</p>
                                        <p className="font-medium text-gray-900">{selectedFlight.seatClassType}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Passenger Details Card */}
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Passenger Information</h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Full Name</p>
                                    <p className="font-medium text-gray-900">{bookingResponse.passenger.fullName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium text-gray-900">{bookingResponse.passenger.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-medium text-gray-900">{bookingResponse.passenger.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <CreditCard className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Passport Number</p>
                                    <p className="font-medium text-gray-900">
                                        {bookingResponse.passenger.passportNumber}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary Card */}
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Payment Summary</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Flight Fare</span>
                                <span className="font-medium text-gray-900">
                                    ${bookingResponse.totalAmount.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Taxes & Fees</span>
                                <span className="font-medium text-gray-900">$0</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2">
                                <div className="flex justify-between">
                                    <span className="text-lg font-semibold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-blue-600">
                                        ${bookingResponse.totalAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="rounded-lg bg-yellow-50 p-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                                <span className="text-sm font-bold text-yellow-800">!</span>
                            </div>
                            <div>
                                <p className="font-semibold text-yellow-900">Payment Pending</p>
                                <p className="text-sm text-yellow-700">
                                    Your booking is confirmed but payment is still pending. Please proceed to complete the
                                    payment.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Back to Home
                        </button>
                        <button
                            onClick={() => alert('Payment integration coming soon!')}
                            className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
