import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { getUserWishlistItems, createWishlist, deleteWishlist } from "../../api/wishlist";

export default function ListingCard({ listing }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saveToggle, setSaveToggle] = useState(false);
  const [saved, setSaved] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function checkSaved() {
      if (!user) {
        if (mounted) setSaved(false);
        return;
      }
      try {
        const items = await getUserWishlistItems();
        const found = items.find((it) => String(it.listing) === String(listing._id));
        if (mounted) {
          setSaved(!!found);
          setWishlistItemId(found?._id || null);
        }
      } catch (err) {
        console.error(err);
      }
    }
    checkSaved();
    return () => { mounted = false; };
  }, [user, listing._id]);

  const handleClick = () => {
    navigate(`/listing/${listing._id}`);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    (async () => {
      try {
        if (!saved) {
          const created = await createWishlist(listing._id);
          setSaved(true);
          setWishlistItemId(created._id || created.id);
        } else if (wishlistItemId) {
          await deleteWishlist(wishlistItemId);
          setSaved(false);
          setWishlistItemId(null);
        } else {
          // fallback: refetch to find id then delete
          const items = await getUserWishlistItems();
          const found = items.find((it) => String(it.listing) === String(listing._id));
          if (found) {
            await deleteWishlist(found._id);
            setSaved(false);
            setWishlistItemId(null);
          }
        }
      } catch (err) {
        console.error(err);
      }
    })();
    setSaveToggle(!saveToggle);
  };

  return (
    <div onClick={handleClick} className="group cursor-pointer">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-700">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        {listing.rating >= 4.4 && (
          <div className="absolute left-3 top-3 rounded-full bg-white dark:bg-gray-800 px-3 py-1 text-xs font-semibold text-gray-900 dark:text-white shadow">
            Guest favourite
          </div>
        )}

        <button
          onClick={handleSaveClick}
          className="absolute right-3 top-3 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition hover:scale-110"
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
        >
          <i className={`text-xl ${saved ? "fa-solid fa-heart text-[#fd4148]" : "fa-regular fa-heart"}`} />
        </button>
      </div>

      {/* Details */}
      <div className="mt-3 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-[15px] font-semibold text-gray-900 dark:text-white">
            Home in {listing.location.city}
          </h3>

          <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
            <i className="fa-solid fa-star text-[11px]"></i>
            <span>{listing.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-[15px] text-gray-700 dark:text-gray-300">
          <span className="font-semibold text-gray-900 dark:text-white">
            ₹{listing.pricePerNight.toLocaleString("en-IN")}
          </span>{" "}
          for 2 nights
        </p>
      </div>
    </div>
  );
}