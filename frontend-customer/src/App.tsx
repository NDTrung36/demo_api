import { Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    );
}

function Home() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                    ✈️ Flight Booking
                </h1>
                <p className="mt-3 text-lg text-muted">
                    Find and book the best flights at great prices.
                </p>
            </div>
        </div>
    );
}

export default App;
