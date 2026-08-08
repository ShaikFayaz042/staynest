const apiUrl = import.meta.env.VITE_API_URL || '';

export async function getUserWishlistItems() {
  const res = await fetch(`${apiUrl}/wishlist`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch wishlist');
  const payload = await res.json();
  return payload.data || [];
}

export async function createWishlist(listingId) {
  const res = await fetch(`${apiUrl}/wishlist`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ listing: listingId }),
  });
  if (!res.ok) throw new Error('Failed to create wishlist item');
  const payload = await res.json();
  return payload.data;
}

export async function deleteWishlist(wishlistId) {
  const res = await fetch(`${apiUrl}/wishlist/${wishlistId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete wishlist item');
  const payload = await res.json();
  return payload.data;
}

export default {
  getUserWishlistItems,
  createWishlist,
  deleteWishlist,
};
