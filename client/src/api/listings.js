const apiUrl = import.meta.env.VITE_API_URL || '';

export async function getListings() {
  const res = await fetch(`${apiUrl}/listings`);
  if (!res.ok) throw new Error('Failed to fetch listings');
  const payload = await res.json();
  return payload.data || [];
}

export async function getListingById(id) {
  const res = await fetch(`${apiUrl}/listings/${id}`);
  if (!res.ok) throw new Error('Failed to fetch listing');
  const payload = await res.json();
  return payload.data;
}

export default { getListings, getListingById };
// const apiUrl = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.message || 'Listing API request failed');
  }

  return payload;
}

export async function fetchListings() {
  return request('/listings');
}

export async function createListing(data) {
  return request('/listings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchListingById(id) {
  return request(`/listings/${id}`);
}

export async function updateListing(id, data) {
  return request(`/listings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteListing(id) {
  return request(`/listings/${id}`, {
    method: 'DELETE',
  });
}
