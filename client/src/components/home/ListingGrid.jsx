import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ScrollRow from './ScrollRow';
import { defaultFilters } from './FilterBar';

const apiUrl = import.meta.env.VITE_API_URL;

async function getListings() {
  const response = await fetch(`${apiUrl}/listings`);

  if (!response.ok) {
    throw new Error("Failed to fetch listings");
  }

  return response.json();
}

export default function ListingGrid({ filters = defaultFilters }) {
  const [listings, setListings] = useState([]);
   useEffect(() => {
    async function fetchListings() {
      const data = await getListings();
      setListings(data.data);
    }

    fetchListings();
  }, []);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get('q')?.trim().toLowerCase() || '';
  const minGuests = parseInt(params.get('guests') || '0', 10);

  const filteredListings = useMemo(() => {
    const normalizedFilters = {
      ...defaultFilters,
      ...filters,
    };

    return [...listings]
      .filter((listing) => {
        const matchesQuery = query
          ? [
            listing.location.city,
            listing.location.state,
            listing.location.country,
            listing.title,
            listing.description,
          ]
            .join(' ')
            .toLowerCase()
            .includes(query)
          : true;

        const matchesGuests = minGuests > 0 ? listing.guests >= minGuests : true;

        const matchesPropertyType = normalizedFilters.propertyType
          ? [normalizedFilters.propertyType.toLowerCase(), listing.category?.toLowerCase()].some((value) => {
            if (!value) return false;
            if (value.includes('flat') || value.includes('apartment')) {
              return listing.category?.toLowerCase().includes('apartment') || listing.category?.toLowerCase().includes('flat');
            }
            if (value.includes('farm')) {
              return listing.category?.toLowerCase().includes('farm');
            }
            return value === listing.category?.toLowerCase();
          })
          : true;

        const matchesPrice = normalizedFilters.priceRange
          ? (() => {
            if (normalizedFilters.priceRange === '0-3000') {
              return listing.pricePerNight <= 3000;
            }
            if (normalizedFilters.priceRange === '3000-6000') {
              return listing.pricePerNight > 3000 && listing.pricePerNight <= 6000;
            }
            if (normalizedFilters.priceRange === '6000-10000') {
              return listing.pricePerNight > 6000 && listing.pricePerNight <= 10000;
            }
            if (normalizedFilters.priceRange === '10000+') {
              return listing.pricePerNight > 10000;
            }
            return true;
          })()
          : true;

        const matchesRating = normalizedFilters.minRating > 0 ? listing.rating >= normalizedFilters.minRating : true;
        const matchesGuestFavourite = !normalizedFilters.guestFavourite || listing.rating >= 4.4;

        const matchesAmenities = normalizedFilters.amenities.length === 0
          ? true
          : normalizedFilters.amenities.every((amenity) =>
            listing.amenities?.some((item) => item.toLowerCase() === amenity.toLowerCase() || item.toLowerCase().includes(amenity.toLowerCase()))
          );

        const matchesBedrooms = normalizedFilters.bedrooms
          ? listing.bedroomsCount >= Number(normalizedFilters.bedrooms)
          : true;

        const matchesBeds = normalizedFilters.beds
          ? listing.beds >= Number(normalizedFilters.beds)
          : true;

        const matchesBathrooms = normalizedFilters.bathrooms
          ? listing.bathrooms >= Number(normalizedFilters.bathrooms)
          : true;

        return (
          matchesQuery &&
          matchesGuests &&
          matchesPropertyType &&
          matchesPrice &&
          matchesRating &&
          matchesGuestFavourite &&
          matchesAmenities &&
          matchesBedrooms &&
          matchesBeds &&
          matchesBathrooms
        );
      })
      .sort((left, right) => {
        switch (normalizedFilters.sort) {
          case 'price-low':
            return left.pricePerNight - right.pricePerNight;
          case 'price-high':
            return right.pricePerNight - left.pricePerNight;
          case 'highest-rated':
            return right.rating - left.rating;
          case 'newest':
            return Number(right.id.replace(/\D/g, '')) - Number(left.id.replace(/\D/g, ''));
          default:
            return 0;
        }
      });
  }, [filters, query, minGuests, listings]);

  const groupedListings = filteredListings.reduce((groups, listing) => {
    const city = listing.location.city;

    if (!groups[city]) {
      groups[city] = [];
    }

    groups[city].push(listing);

    return groups;
  }, {});

  return (
    <div className="mx-auto w-full max-w-[1680px] px-4 py-6 sm:px-6 md:px-8 lg:px-10">
      <div className="flex flex-col gap-10">
        {Object.entries(groupedListings).map(([city, listings]) => (
          <ScrollRow
            key={city}
            title={city}
            listings={listings}
          />
        ))}
      </div>
    </div>
  );
}