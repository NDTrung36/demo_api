import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { SearchResults } from './pages/SearchResults';
import { BookingDetails } from './pages/BookingDetails';
import { PaymentPreview } from './pages/PaymentPreview';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/booking-details" element={<BookingDetails />} />
            <Route path="/payment-preview" element={<PaymentPreview />} />
        </Routes>
    );
}

export default App;
