  export async function fetchRoomDetails(roomId) {
  try {
    const response = await fetch(`/api/chatRooms/${roomId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch room details');
    }
    return await response.json();
  } catch (err) {
    console.error('Failed to fetch room details:', err);
    throw err;
  }
}
