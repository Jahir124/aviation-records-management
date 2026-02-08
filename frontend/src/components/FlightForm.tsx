import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import type { Flight } from '../types';

interface FlightFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (flight: Omit<Flight, 'id' | 'createdAt'>) => Promise<void>;
  initialData?: Flight;
}

const FlightForm: React.FC<FlightFormProps> = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Omit<Flight, 'id' | 'createdAt'>>({
    origin: initialData?.origin || '',
    destination: initialData?.destination || '',
    date: initialData?.date || '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.origin || !formData.destination || !formData.date) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ origin: '', destination: '', date: '' });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar el vuelo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Editar Vuelo' : 'Nuevo Vuelo'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}
            
            <TextField
              name="origin"
              label="Origen"
              value={formData.origin}
              onChange={handleChange}
              fullWidth
              required
              autoFocus
            />
            
            <TextField
              name="destination"
              label="Destino"
              value={formData.destination}
              onChange={handleChange}
              fullWidth
              required
            />
            
            <TextField
              name="date"
              label="Fecha"
              type="date"
              value={formData.date}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
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

export default FlightForm;