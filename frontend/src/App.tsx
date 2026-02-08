import React, { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { FlightTakeoff, Add } from '@mui/icons-material';
import { flightService } from './services/flightService';
import { passengerService } from './services/passengerService';
import FlightForm from './components/FlightForm';
import FlightList from './components/FlightList';
import PassengerForm from './components/PassengerForm';
import type { Flight, Passenger } from './types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [flightFormOpen, setFlightFormOpen] = useState(false);
  const [passengerFormOpen, setPassengerFormOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await flightService.getAllFlights();
      setFlights(data);
    } catch (err: any) {
      setError('Error al cargar los vuelos. Por favor, verifique que el servidor esté ejecutándose en http://localhost:5271');
      console.error('Error loading flights:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFlightSubmit = async (flight: Omit<Flight, 'id' | 'createdAt'>) => {
    await flightService.createFlight(flight);
    await loadFlights();
  };

  const handlePassengerSubmit = async (passenger: Omit<Passenger, 'id' | 'createdAt'>) => {
    await passengerService.createPassenger(passenger);
    await loadFlights();
  };

  const handleFlightDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este vuelo? Se eliminarán también todos los pasajeros asociados.')) {
      try {
        await flightService.deleteFlight(id);
        await loadFlights();
      } catch (err) {
        console.error('Error deleting flight:', err);
        alert('Error al eliminar el vuelo');
      }
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <FlightTakeoff sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestión de Vuelos
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Vuelos" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" component="h1">
              Vuelos Registrados
            </Typography>
            <Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setFlightFormOpen(true)}
                sx={{ mr: 1 }}
              >
                Nuevo Vuelo
              </Button>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setPassengerFormOpen(true)}
              >
                Nuevo Pasajero
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <FlightList
              flights={flights}
              onDelete={handleFlightDelete}
              onRefresh={loadFlights}
            />
          )}
        </TabPanel>
      </Container>

      <FlightForm
        open={flightFormOpen}
        onClose={() => setFlightFormOpen(false)}
        onSubmit={handleFlightSubmit}
      />

      <PassengerForm
        open={passengerFormOpen}
        onClose={() => setPassengerFormOpen(false)}
        onSubmit={handlePassengerSubmit}
      />
    </Box>
  );
}

export default App;