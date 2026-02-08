using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PassengersController : ControllerBase
    {
        private readonly FlightDbContext _context;

        public PassengersController(FlightDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Passenger>>> GetPassengers()
        {
            return await _context.Passengers
                .OrderBy(p => p.LastName)
                .ThenBy(p => p.FirstName)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Passenger>> GetPassenger(int id)
        {
            var passenger = await _context.Passengers.FindAsync(id);

            if (passenger == null)
            {
                return NotFound(new { error = "Passenger not found" });
            }

            return passenger;
        }

        [HttpGet("flight/{flightId}")]
        public async Task<ActionResult<IEnumerable<Passenger>>> GetPassengersByFlight(int flightId)
        {
            return await _context.Passengers
                .Where(p => p.FlightId == flightId)
                .OrderBy(p => p.LastName)
                .ThenBy(p => p.FirstName)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Passenger>> CreatePassenger(PassengerDto passengerDto)
        {
            var flightExists = await _context.Flights.AnyAsync(f => f.Id == passengerDto.FlightId);
            if (!flightExists)
            {
                return NotFound(new { error = "Flight not found" });
            }

            var passenger = new Passenger
            {
                FirstName = passengerDto.FirstName,
                LastName = passengerDto.LastName,
                Email = passengerDto.Email,
                PhoneNumber = passengerDto.PhoneNumber,
                FlightId = passengerDto.FlightId
            };

            _context.Passengers.Add(passenger);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPassenger), new { id = passenger.Id }, passenger);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePassenger(int id, PassengerDto passengerDto)
        {
            var passenger = await _context.Passengers.FindAsync(id);

            if (passenger == null)
            {
                return NotFound(new { error = "Passenger not found" });
            }

            var flightExists = await _context.Flights.AnyAsync(f => f.Id == passengerDto.FlightId);
            if (!flightExists)
            {
                return NotFound(new { error = "Flight not found" });
            }

            passenger.FirstName = passengerDto.FirstName;
            passenger.LastName = passengerDto.LastName;
            passenger.Email = passengerDto.Email;
            passenger.PhoneNumber = passengerDto.PhoneNumber;
            passenger.FlightId = passengerDto.FlightId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PassengerExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return Ok(passenger);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePassenger(int id)
        {
            var passenger = await _context.Passengers.FindAsync(id);
            
            if (passenger == null)
            {
                return NotFound(new { error = "Passenger not found" });
            }

            _context.Passengers.Remove(passenger);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Passenger deleted successfully" });
        }

        private bool PassengerExists(int id)
        {
            return _context.Passengers.Any(e => e.Id == id);
        }
    }
}