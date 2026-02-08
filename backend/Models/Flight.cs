using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Flight
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Origin { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Destination { get; set; } = string.Empty;

        [Required]
        public DateTime Date { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Passenger> Passengers { get; set; } = new List<Passenger>();
    }
}