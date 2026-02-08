# Sistema de Gestión de Registros Aéreos

Aplicación Full Stack para la gestión de vuelos y pasajeros desarrollada con React + TypeScript + Vite + Material-UI en el frontend y .NET Core + Entity Framework + SQLite en el backend.

## 📋 Descripción

Sistema web que permite:
- ✈️ Crear y administrar vuelos (origen, destino, fecha)
- 👥 Registrar pasajeros asociados a vuelos específicos
- 📊 Visualizar vuelos y lista de pasajeros asignados
- 🗑️ Eliminar vuelos y pasajeros
- 🔗 Mantener integridad referencial (al eliminar un vuelo se eliminan sus pasajeros)

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** con TypeScript
- **Vite** como build tool y dev server
- **Material-UI (MUI)** para componentes y diseño
- **Axios** para consumo de API REST
- **React Hooks** para gestión de estado

### Backend
- **.NET Core 8** (o superior)
- **Entity Framework Core** como ORM
- **SQLite** como base de datos relacional
- **API RESTful** con arquitectura MVC
- **Swagger** para documentación de API

## 📁 Estructura del Proyecto
```
aviation-records-management/
├── frontend/                  # Aplicación React + Vite
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   │   ├── FlightForm.tsx
│   │   │   ├── FlightList.tsx
│   │   │   └── PassengerForm.tsx
│   │   ├── services/          # Servicios API
│   │   │   ├── flightService.ts
│   │   │   └── passengerService.ts
│   │   ├── types/             # Tipos TypeScript
│   │   │   └── index.ts
│   │   ├── App.tsx            # Componente principal
│   │   ├── main.tsx           # Punto de entrada
│   │   └── index.css
│   ├── vite.config.ts         # Configuración de Vite
│   ├── package.json
│   └── tsconfig.json
└── backend/                   # API .NET Core
    ├── Controllers/           # Controladores de API
    │   ├── FlightsController.cs
    │   └── PassengersController.cs
    ├── Data/                  # DbContext
    │   └── FlightDbContext.cs
    ├── DTOs/                  # Data Transfer Objects
    │   └── FlightDtos.cs
    ├── Models/                # Entidades del dominio
    │   ├── Flight.cs
    │   └── Passenger.cs
    ├── Program.cs             # Punto de entrada
    ├── appsettings.json       # Configuración
    └── backend.csproj
```

## 🚀 Instalación y Ejecución

### Prerrequisitos

- **Node.js** (versión 16 o superior) - [Descargar](https://nodejs.org/)
- **.NET SDK 8.0** (o superior) - [Descargar](https://dotnet.microsoft.com/download)
- **npm** o **yarn** (incluido con Node.js)

### Backend (.NET Core)

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Restaurar dependencias:
```bash
dotnet restore
```

3. Ejecutar la aplicación:
```bash
dotnet run
```

✅ El servidor estará disponible en `http://localhost:5271` (o el puerto que se muestre en la consola)

**Nota:** La base de datos SQLite se crea automáticamente al iniciar el backend.

### Frontend (React + Vite)

1. En una **nueva terminal**, navegar al directorio del frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. **IMPORTANTE:** Verificar que el puerto del backend sea correcto en `vite.config.ts`:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5271',  // ← Ajustar al puerto del backend
      changeOrigin: true,
    }
  }
}
```

4. Iniciar la aplicación:
```bash
npm run dev
```

✅ La aplicación se abrirá en `http://localhost:5173`

## 🔌 Endpoints de la API

### Vuelos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/flights` | Obtener todos los vuelos |
| GET | `/api/flights/{id}` | Obtener un vuelo con sus pasajeros |
| POST | `/api/flights` | Crear un nuevo vuelo |
| PUT | `/api/flights/{id}` | Actualizar un vuelo |
| DELETE | `/api/flights/{id}` | Eliminar un vuelo (y sus pasajeros) |

### Pasajeros

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/passengers` | Obtener todos los pasajeros |
| GET | `/api/passengers/{id}` | Obtener un pasajero |
| GET | `/api/passengers/flight/{flightId}` | Obtener pasajeros por vuelo |
| POST | `/api/passengers` | Crear un nuevo pasajero |
| PUT | `/api/passengers/{id}` | Actualizar un pasajero |
| DELETE | `/api/passengers/{id}` | Eliminar un pasajero |

## 💾 Base de Datos

La base de datos SQLite (`flights.db`) se crea automáticamente en la carpeta `backend` al iniciar el servidor.

### Esquema de Base de Datos

**Tabla `Flights`:**
- `Id` (INTEGER, PK, AUTOINCREMENT)
- `Origin` (TEXT, NOT NULL)
- `Destination` (TEXT, NOT NULL)
- `Date` (TEXT, NOT NULL)
- `CreatedAt` (TEXT, NOT NULL)

**Tabla `Passengers`:**
- `Id` (INTEGER, PK, AUTOINCREMENT)
- `FirstName` (TEXT, NOT NULL)
- `LastName` (TEXT, NOT NULL)
- `Email` (TEXT, NOT NULL)
- `PhoneNumber` (TEXT, NOT NULL)
- `FlightId` (INTEGER, FK → Flights.Id, NOT NULL)
- `CreatedAt` (TEXT, NOT NULL)

**Relación:** 1 vuelo → N pasajeros  
**Integridad Referencial:** `ON DELETE CASCADE` (al eliminar un vuelo se eliminan sus pasajeros)

## 🎨 Características de la Interfaz

- ✅ **Diseño responsivo** adaptable a móviles y escritorio
- ✅ **Formularios con validación** en tiempo real
- ✅ **Vista expandible** para mostrar/ocultar pasajeros
- ✅ **Actualización dinámica** de contadores de pasajeros
- ✅ **Confirmaciones** antes de eliminar registros
- ✅ **Feedback visual** con alertas y mensajes
- ✅ **Material Design** siguiendo las mejores prácticas de UI/UX

## 🔒 Validaciones

### Frontend
- Todos los campos son obligatorios
- Validación de formato de email
- Verificación de vuelo existente al asignar pasajeros
- Confirmación antes de eliminar registros

### Backend
- Validación de campos requeridos con Data Annotations
- Verificación de existencia de vuelo antes de crear pasajeros
- Manejo de errores con códigos HTTP apropiados
- Validación de integridad referencial

## 🧪 Guía de Pruebas

1. **Crear un vuelo:**
   - Clic en "Nuevo Vuelo"
   - Completar: Origen, Destino, Fecha
   - Clic en "Guardar"

2. **Agregar pasajeros:**
   - Clic en el ícono "+" (PersonAdd) en la tarjeta del vuelo
   - Completar datos del pasajero
   - Seleccionar el vuelo en el dropdown
   - Clic en "Guardar"

3. **Ver pasajeros:**
   - Clic en el ícono de flecha hacia abajo (ExpandMore)
   - Se expande la lista de pasajeros del vuelo

4. **Eliminar pasajero:**
   - Expandir el vuelo para ver sus pasajeros
   - Clic en el ícono de papelera junto al pasajero
   - Confirmar eliminación

5. **Eliminar vuelo:**
   - Clic en el ícono de papelera (Delete) en la tarjeta del vuelo
   - Confirmar eliminación (también eliminará todos los pasajeros asociados)

6. **Verificar persistencia:**
   - Crear datos (vuelos y pasajeros)
   - Cerrar la aplicación completamente
   - Volver a ejecutar backend y frontend
   - Los datos deben seguir presentes

## 📝 Documentación Adicional

### Swagger UI
Una vez ejecutado el backend, acceder a la documentación interactiva de la API en:
```
http://localhost:5271/swagger
```

### Vite
El proyecto usa Vite para desarrollo rápido con Hot Module Replacement (HMR). Los cambios en el código se reflejan instantáneamente sin recargar la página.

## 🛠️ Solución de Problemas

### Error: "Puerto 5271 en uso"
```bash
# Windows
netstat -ano | findstr :5271
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5271 | xargs kill -9
```

### Error: "Cannot connect to backend"
1. Verificar que el backend esté ejecutándose
2. Verificar el puerto en `vite.config.ts` coincida con el puerto del backend
3. Revisar la configuración de CORS en `Program.cs`

### Error al instalar dependencias
```bash
# Limpiar caché de npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```
