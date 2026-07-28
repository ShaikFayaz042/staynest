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

export default function ListingPage() {
  const { id } = useParams();
  const listings = JSON.parse(localStorage.getItem('listings')) || [];
  const listing = listings.find(l => l.id === id);

  if (!listing) {
    return <div className="text-center py-20 text-gray-900 dark:text-white">Listing not found</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
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
        <RatingSummary reviewIds={listing.reviewIds || []} />
        <ReviewSection reviewIds={listing.reviewIds || []} />
        <MapSection />
        <HostSection hostId={listing.hostId} />
      </div>
      <Footer />
    </div>
  );
}