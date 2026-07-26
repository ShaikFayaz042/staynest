import listings from "../../data/listings";
import ScrollRow from "./ScrollRow";

export default function ListingGrid() {
  const groupedListings = listings.reduce((groups, listing) => {
    const city = listing.location.city;

    if (!groups[city]) {
      groups[city] = [];
    }

    groups[city].push(listing);

    return groups;
  }, {});

  return (
    <div className="mx-auto w-full max-w-[1680px] px-6 py-6 md:px-10">
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