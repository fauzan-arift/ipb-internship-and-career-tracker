import axios from '@/api/axios';

export const offerService = {
  // Fetch offers directly from the new endpoint
  getOffers: async (status = 'Pending') => {
    const response = await axios.get('/students/offers', {
      params: { status },
    });
    return response.data;
  },
};