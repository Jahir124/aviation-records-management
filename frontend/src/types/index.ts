export interface Flight {
    id?: number;
    origin: string;
    destination: string;
    date: string;
    createdAt?: string;
  }
  
  export interface Passenger {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    flightId: number;
    createdAt?: string;
  }
  
  export interface FlightWithPassengers extends Flight {
    passengers: Passenger[];
  }