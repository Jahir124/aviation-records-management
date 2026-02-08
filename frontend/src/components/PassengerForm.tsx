import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { flightService } from '../services/flightService';
import type { Flight, Passenger } from '../types';

interface PassengerFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (passenger: Omit<Passenger, 'id' | 'createdAt'>) => Promise<void>;
  initialData?: Passenger;
  preselectedFlightId?: number;
}

const PassengerForm: React.FC<PassengerFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  initialData,
  preselectedFlightId 
}) => {
  const [formData, setFormData] = useState<Omit<Passenger, 'id' | 'createdAt'>>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phoneNumber: initialData?.phoneNumber || '',
    flightId: initialData?.flightId || preselectedFlightId || 0,
  });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadFlights()
    }
  }, [open]);

  const loadFlights = async () => {
    try {
      const data = await flightService.getAllFlights();
      setFlights(data);
    } catch (err) {
      console.error('Error loading flights:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    setFormData((prev) => ({ ...prev, flightId: Number(e.target.value) }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phoneNumber || !formData.flightId) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ 
        firstName: '', 
        lastName: '', 
        email: '', 
        phoneNumber: '', 
        flightId: preselectedFlightId || 0 
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar el pasajero');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Editar Pasajero' : 'Nuevo Pasajero'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}
            
            <TextField
              name="firstName"
              label="Nombre"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              required
              autoFocus
            />
            
            <TextField
              name="lastName"
              label="Apellido"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              required
            />
            
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
            
            <TextField
              name="phoneNumber"
              label="Teléfono"
              value={formData.phoneNumber}
              onChange={handleChange}
              fullWidth
              required
            />
            
            <FormControl fullWidth required>
              <InputLabel>Vuelo</InputLabel>
              <Select
                value={formData.flightId}
                label="Vuelo"
                onChange={handleSelectChange}
              >
                <MenuItem value={0} disabled>
                  Seleccionar vuelo
                </MenuItem>
                {flights.map((flight) => (
                  <MenuItem key={flight.id} value={flight.id}>
                    {flight.origin} → {flight.destination} ({flight.date})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PassengerForm;