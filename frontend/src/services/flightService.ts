import axios from 'axios';
import type { Flight, FlightWithPassengers } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const flightService = {
  getAllFlights: async (): Promise<Flight[]> => {
    const response = await api.get<Flight[]>('/flights');
    return response.data;
  },

  getFlightById: async (id: number): Promise<FlightWithPassengers> => {
    const response = await api.get<FlightWithPassengers>(`/flights/${id}`);
    return response.data;
  },

  createFlight: async (flight: Omit<Flight, 'id' | 'createdAt'>): Promise<Flight> => {
    const response = await api.post<Flight>('/flights', flight);
    return response.data;
  },

  updateFlight: async (id: number, flight: Omit<Flight, 'id' | 'createdAt'>): Promise<Flight> => {
    const response = await api.put<Flight>(`/flights/${id}`, flight);
    return response.data;
  },

  deleteFlight: async (id: number): Promise<void> => {
    await api.delete(`/flights/${id}`);
  },
};

export default api;