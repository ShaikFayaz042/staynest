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

export default function ListingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pb-12">
        <ImageGallery />
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StayInfo />
            <BedroomSection />
            <Amenities />
          </div>
          <div className="lg:col-span-1">
            <BookingCard />
          </div>
        </div>
        <RatingSummary />
        <ReviewSection />
        <MapSection />
        <HostSection />
      </div>
      <Footer />
    </div>
  );
}
