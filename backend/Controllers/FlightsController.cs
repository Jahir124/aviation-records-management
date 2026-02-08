using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FlightsController : ControllerBase
    {
        private readonly FlightDbContext _context;

        public FlightsController(FlightDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Flight>>> GetFlights()
        {
            return await _context.Flights
                .OrderByDescending(f => f.Date)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FlightWithPassengersDto>> GetFlight(int id)
        {
            var flight = await _context.Flights
                .Include(f => f.Passengers)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (flight == null)
            {
                return NotFound(new { error = "Flight not found" });
            }

            var flightDto = new FlightWithPassengersDto
            {
                Id = flight.Id,
                Origin = flight.Origin,
                Destination = flight.Destination,
                Date = flight.Date,
                CreatedAt = flight.CreatedAt,
                Passengers = flight.Passengers.Select(p => new PassengerResponseDto
                {
                    Id = p.Id,
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    Email = p.Email,
                    PhoneNumber = p.PhoneNumber,
                    FlightId = p.FlightId,
                    CreatedAt = p.CreatedAt
                }).ToList()
            };

            return flightDto;
        }

        [HttpPost]
        public async Task<ActionResult<Flight>> CreateFlight(FlightDto flightDto)
        {
            var flight = new Flight
            {
                Origin = flightDto.Origin,
                Destination = flightDto.Destination,
                Date = flightDto.Date
            };

            _context.Flights.Add(flight);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFlight), new { id = flight.Id }, flight);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFlight(int id, FlightDto flightDto)
        {
            var flight = await _context.Flights.FindAsync(id);

            if (flight == null)
            {
                return NotFound(new { error = "Flight not found" });
            }

            flight.Origin = flightDto.Origin;
            flight.Destination = flightDto.Destination;
            flight.Date = flightDto.Date;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FlightExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return Ok(flight);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFlight(int id)
        {
            var flight = await _context.Flights.FindAsync(id);
            
            if (flight == null)
            {
                return NotFound(new { error = "Flight not found" });
            }

            _context.Flights.Remove(flight);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Flight deleted successfully" });
        }

        private bool FlightExists(int id)
        {
            return _context.Flights.Any(e => e.Id == id);
        }
    }
}