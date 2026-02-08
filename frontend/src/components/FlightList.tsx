import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  FlightTakeoff,
  Delete,
  PersonAdd,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { passengerService } from '../services/passengerService';
import PassengerForm from './PassengerForm';
import type { Flight, Passenger } from '../types';

interface FlightListProps {
  flights: Flight[];
  onDelete: (id: number) => void;
  onRefresh: () => void;
}

const FlightList: React.FC<FlightListProps> = ({ flights, onDelete, onRefresh }) => {
  const [expandedFlight, setExpandedFlight] = useState<number | null>(null);
  const [passengers, setPassengers] = useState<{ [key: number]: Passenger[] }>({});
  const [loadingPassengers, setLoadingPassengers] = useState<{ [key: number]: boolean }>({});
  const [passengerFormOpen, setPassengerFormOpen] = useState(false);
  const [selectedFlightId, setSelectedFlightId] = useState<number | null>(null);

  useEffect(() => {
    const loadAllPassengerCounts = async () => {
      for (const flight of flights) {
        if (flight.id && !passengers[flight.id]) {
          try {
            const data = await passengerService.getPassengersByFlightId(flight.id);
            setPassengers((prev) => ({ ...prev, [flight.id!]: data }));
          } catch (error) {
            console.error('Error loading passengers for flight:', flight.id, error);
          }
        }
      }
    };
  
    if (flights.length > 0) {
      loadAllPassengerCounts();
    }
  }, [flights]);

  const handleExpandClick = async (flightId: number) => {
    if (expandedFlight === flightId) {
      setExpandedFlight(null);
    } else {
      setExpandedFlight(flightId);
      if (!passengers[flightId]) {
        await loadPassengers(flightId);
      }
    }
  };

  const loadPassengers = async (flightId: number) => {
    setLoadingPassengers((prev) => ({ ...prev, [flightId]: true }));
    try {
      const data = await passengerService.getPassengersByFlightId(flightId);
      setPassengers((prev) => ({ ...prev, [flightId]: data }));
    } catch (error) {
      console.error('Error loading passengers:', error);
    } finally {
      setLoadingPassengers((prev) => ({ ...prev, [flightId]: false }));
    }
  };

  const handleAddPassenger = (flightId: number) => {
    setSelectedFlightId(flightId);
    setPassengerFormOpen(true);
  };

  const handlePassengerSubmit = async (passenger: Omit<Passenger, 'id' | 'createdAt'>) => {
    await passengerService.createPassenger(passenger);
    if (selectedFlightId) {
      await loadPassengers(selectedFlightId);
    }
    setPassengerFormOpen(false);
    onRefresh();
  };

  const handleDeletePassenger = async (passengerId: number, flightId: number) => {
    if (window.confirm('¿Está seguro de eliminar este pasajero?')) {
      try {
        await passengerService.deletePassenger(passengerId);
        await loadPassengers(flightId);
        onRefresh();
      } catch (error) {
        console.error('Error deleting passenger:', error);
      }
    }
  };

  if (flights.length === 0) {
    return (
      <Alert severity="info">
        No hay vuelos registrados. Haga clic en "Nuevo Vuelo" para crear uno.
      </Alert>
    );
  }

  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        {flights.map((flight) => (
          <Box key={flight.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      <FlightTakeoff sx={{ verticalAlign: 'middle', mr: 1 }} />
                      {flight.origin} → {flight.destination}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fecha: {new Date(flight.date).toLocaleDateString()}
                    </Typography>
                    <Chip
                      label={`${passengers[flight.id!]?.length || 0} pasajeros`}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleAddPassenger(flight.id!)}
                      color="primary"
                      title="Agregar pasajero"
                    >
                      <PersonAdd />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDelete(flight.id!)}
                      color="error"
                      title="Eliminar vuelo"
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleExpandClick(flight.id!)}
                      title={expandedFlight === flight.id ? 'Ocultar pasajeros' : 'Ver pasajeros'}
                    >
                      {expandedFlight === flight.id ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>
                </Box>

                <Collapse in={expandedFlight === flight.id} timeout="auto" unmountOnExit>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Pasajeros:
                  </Typography>
                  {loadingPassengers[flight.id!] ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : passengers[flight.id!]?.length > 0 ? (
                    <List dense>
                      {passengers[flight.id!].map((passenger) => (
                        <ListItem
                          key={passenger.id}
                          secondaryAction={
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={() => handleDeletePassenger(passenger.id!, flight.id!)}
                              color="error"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary={`${passenger.firstName} ${passenger.lastName}`}
                            secondary={`${passenger.email} | ${passenger.phoneNumber}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No hay pasajeros registrados para este vuelo.
                    </Typography>
                  )}
                </Collapse>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <PassengerForm
        open={passengerFormOpen}
        onClose={() => setPassengerFormOpen(false)}
        onSubmit={handlePassengerSubmit}
        preselectedFlightId={selectedFlightId || undefined}
      />
    </>
  );
};

export default FlightList;