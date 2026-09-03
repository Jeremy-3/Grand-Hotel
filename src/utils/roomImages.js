// Map room numbers and room types to local room_photos
export const getRoomImage = (roomNumber, roomTypeName, backendImage) => {
  const roomNum = Number(roomNumber);
  
  // Direct room number mapping to the photos from Room_photos
  if (roomNum === 101) return '/room_photos/standard1.jpeg';
  if (roomNum === 102) return '/room_photos/standard2.jpeg';
  if (roomNum === 201) return '/room_photos/Delux1.jpeg';
  if (roomNum === 202) return '/room_photos/Delux2.jpeg';
  if (roomNum === 301) return '/room_photos/Superior1.jpeg';
  if (roomNum === 302) return '/room_photos/Superior2.jpeg';
  if (roomNum === 401) return '/room_photos/Executive1.jpeg';
  if (roomNum === 402) return '/room_photos/Executive2.jpg';

  // Fallback by room type name
  const typeLower = (roomTypeName || '').toLowerCase();
  if (typeLower.includes('standard')) return '/room_photos/standard1.jpeg';
  if (typeLower.includes('deluxe')) return '/room_photos/Delux1.jpeg';
  if (typeLower.includes('superior')) return '/room_photos/Superior1.jpeg';
  if (typeLower.includes('executive') || typeLower.includes('club')) return '/room_photos/Executive1.jpeg';

  // Return backendImage if valid url or fallback
  if (backendImage && (backendImage.startsWith('http') || backendImage.startsWith('/'))) {
    return backendImage;
  }

  return '/room_photos/Delux1.jpeg';
};
