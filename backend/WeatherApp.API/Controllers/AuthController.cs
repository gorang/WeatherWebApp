using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeatherApp.API.Data;
using WeatherApp.API.Dtos;
using WeatherApp.API.Models;
using WeatherApp.API.Services;

namespace WeatherApp.API.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly JwtTokenService _jwt;

        public AuthController(AppDbContext db, JwtTokenService jwt)
        {
            _db = db;
            _jwt = jwt;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterRequest req)
        {
            var username = req.Username.Trim();

            if (username.Length < 3 || req.Password.Length < 6)
                return BadRequest("Username must be >= 3 chars and password >= 6 chars.");

            var exists = await _db.Users.AnyAsync(u => u.Username == username);
            if (exists) return Conflict("Username already exists.");

            var user = new User
            {
                Username = username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password)
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Created("", new { user.Id, user.Username });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest req)
        {
            var username = req.Username.Trim();

            var user = await _db.Users.SingleOrDefaultAsync(u => u.Username == username);
            if (user is null) return Unauthorized("Invalid credentials.");

            var ok = BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash);
            if (!ok) return Unauthorized("Invalid credentials.");

            var token = _jwt.CreateToken(user);
            return Ok(new AuthResponse { Token = token });
        }
    }
}
