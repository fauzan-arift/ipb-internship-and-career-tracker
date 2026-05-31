import axios from '@/api/axios';

export const offerService = {
  getOffers: async () => {
    const response = await axios.get('/students/offers');
    return response.data;
  },

  respondOffer: async (offerId, responseStatus) => {
    const response = await axios.patch(`/students/offers/${offerId}/respond`, {
      response_status: responseStatus,
    });
    return response.data;
  },
};