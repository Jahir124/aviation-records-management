import type { Passenger } from '../types';
import api from './flightService';

export const passengerService = {
  getAllPassengers: async (): Promise<Passenger[]> => {
    const response = await api.get<Passenger[]>('/passengers');
    return response.data;
  },

  getPassengerById: async (id: number): Promise<Passenger> => {
    const response = await api.get<Passenger>(`/passengers/${id}`);
    return response.data;
  },

  getPassengersByFlightId: async (flightId: number): Promise<Passenger[]> => {
    const response = await api.get<Passenger[]>(`/passengers/flight/${flightId}`);
    return response.data;
  },

  createPassenger: async (passenger: Omit<Passenger, 'id' | 'createdAt'>): Promise<Passenger> => {
    const response = await api.post<Passenger>('/passengers', passenger);
    return response.data;
  },

  updatePassenger: async (id: number, passenger: Omit<Passenger, 'id' | 'createdAt'>): Promise<Passenger> => {
    const response = await api.put<Passenger>(`/passengers/${id}`, passenger);
    return response.data;
  },

  deletePassenger: async (id: number): Promise<void> => {
    await api.delete(`/passengers/${id}`);
  },
};