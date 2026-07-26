import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ImageGallery from "../components/listing/ImageGallery";
import StayInfo from "../components/listing/StayInfo";
import BedroomSection from "../components/listing/BedroomSection";
import Amenities from "../components/listing/Amenities";
import BookingCard from "../components/listing/BookingCard";
import RatingSummary from "../components/listing/RatingSummary";
import ReviewSection from "../components/listing/ReviewSection";
import MapSection from "../components/listing/MapSection";
import HostSection from "../components/listing/HostSection";
import { useParams } from "react-router-dom";
import listings from "../data/listings";
// let listing = {
//   "id": "l1",
//   "hostId": "u1",
//   "title": "Cozy Family House in New Delhi",
//   "description": "Experience the charm of a house nestled in New Delhi, Delhi. Perfectly suited for 2 guests, this space offers 1 bedrooms, 1 beds and 1 bathrooms. Enjoy local cuisine, scenic views and modern comforts.",
//   "category": "House",
//   "location": {
//     "country": "India",
//     "state": "Delhi",
//     "city": "New Delhi",
//     "address": "102 New Delhi Main Road",
//     "latitude": "28.6139",
//     "longitude": "77.209"
//   },
//   "pricePerNight": 3250,
//   "guests": 2,
//   "bedroomsCount": 1,
//   "beds": 1,
//   "bathrooms": 1,
//   "rating": 4.33,
//   "reviewCount": 3,
//   "images": [
//     "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=70",
//     "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=70",
//     "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70",
//     "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=70",
//     "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=70",
//     "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=70",
//     "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70",
//     "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=70",
//     "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=70",
//     "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=70"
//   ],
//   "bedrooms": [
//     {
//       "id": "l1-b1",
//       "title": "Bedroom 1",
//       "beds": 1,
//       "images": [
//         "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70",
//         "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=70"
//       ]
//     }
//   ],
//   "amenities": [
//     "Air conditioning",
//     "Essentials",
//     "Fridge",
//     "Heating",
//     "Hot water",
//     "Coffee maker",
//     "Cooking basics",
//     "Hairdryer",
//     "Carbon monoxide alarm",
//     "Smoke alarm"
//   ],
//   "reviewIds": [
//     "r1",
//     "r2",
//     "r3"
//   ],
//   "bookingIds": [],
//   "discount": 5
// }

export default function ListingPage() {
  const { id } = useParams();
  const listing = listings.find(l => l.id === id);

  if (!listing) {
    return <div>Listing not found</div>;
  }
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pb-12">
        <ImageGallery list={listing} />
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StayInfo list={listing} />
            <BedroomSection list={listing} />
            <Amenities list={listing.amenities} />
          </div>
          <div className="lg:col-span-1">
            <BookingCard list={listing} />
          </div>
        </div>
        <RatingSummary list={listing} />
        <ReviewSection />
        <MapSection />
        <HostSection />
      </div>
      <Footer />
    </div>
  );
}
