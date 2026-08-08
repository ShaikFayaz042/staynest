const apiUrl = import.meta.env.VITE_API_URL || '';

export async function getBookingsForListing(listingId) {
  const url = `${apiUrl}/bookings?listing=${listingId}`;
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch bookings');
  const payload = await res.json();
  return payload.data || [];
}

export default { getBookingsForListing };
