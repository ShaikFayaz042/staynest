import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import ScrollRow from './ScrollRow';

const listings = JSON.parse(localStorage.getItem('listings')) || [];

export default function ListingGrid() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get('q')?.trim().toLowerCase() || '';
  const minGuests = parseInt(params.get('guests') || '0', 10);

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
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
      return matchesQuery && matchesGuests;
    });
  }, [query, minGuests]);

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