import axios from "axios";

const BASE_URL = "https://your-backend-api.com";

export const apiService = {
  getTools: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tools`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tools:", error);
      throw error;
    }
  },
  getToolById: async (id: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/tools/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tool with ID ${id}:`, error);
      throw error;
    }
  },
  // Add more endpoints as needed
};
