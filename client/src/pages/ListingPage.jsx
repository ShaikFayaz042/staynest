import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ImageGallery from "../components/listing/ImageGallery";
import StayInfo from "../components/listing/StayInfo";
import BedroomSection from "../components/listing/BedroomSection";
import Amenities from "../components/listing/Amenities";
import BookingCard from "../components/listing/BookingCard";
import ListingReviews from "../components/listing/ListingReviews";
import MapSection from "../components/listing/MapSection";
import HostSection from "../components/listing/HostSection";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";


const apiUrl = import.meta.env.VITE_API_URL;

async function getListingById(id) {
  const response = await fetch(`${apiUrl}/listings/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch listing");
  }

  return response.json();
}

export default function ListingPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    async function fetchListings() {
      const data = await getListingById(id);
      setListing(data.data);
    }

    fetchListings();
  }, [id]);

  if (!listing) {
    return <div className="text-center py-20 text-gray-900 dark:text-white">Listing not found</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar hideSearch />
      <div className="mx-auto w-full max-w-[1640px] px-4 pb-12 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <ImageGallery list={listing} />
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.75fr)_420px] lg:items-start lg:gap-16">
          <div className="lg:col-span-1">
            <StayInfo list={listing} />
            <BedroomSection list={listing} />
            <Amenities list={listing.amenities} />
          </div>
          <div className="lg:col-span-1">
            <BookingCard list={listing} />
          </div>
        </div>
        <ListingReviews listingId={listing._id || listing.id}></ListingReviews>
        <MapSection location={listing.location} />
        <HostSection hostId={
          typeof listing.host === "object"
            ? listing.host._id || listing.host.id
            : listing.host || listing.hostId
        } />
      </div>
      <Footer />
    </div>
  );
}