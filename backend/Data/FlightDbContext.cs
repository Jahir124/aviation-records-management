using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class FlightDbContext : DbContext
    {
        public FlightDbContext(DbContextOptions<FlightDbContext> options)
            : base(options)
        {
        }

        public DbSet<Flight> Flights { get; set; }
        public DbSet<Passenger> Passengers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Flight>()
                .HasMany(f => f.Passengers)
                .WithOne(p => p.Flight)
                .HasForeignKey(p => p.FlightId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Passenger>()
                .HasIndex(p => p.FlightId);

            modelBuilder.Entity<Passenger>()
                .HasIndex(p => p.Email);
        }
    }
}