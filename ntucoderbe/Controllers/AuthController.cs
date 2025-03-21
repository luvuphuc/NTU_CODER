using Firebase.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Services;
using ntucoderbe.Models;
using ntucoderbe.Models.ERD;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ntucoderbe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AccountDTO model)
        {
            if (model == null || string.IsNullOrEmpty(model.UserName) || string.IsNullOrEmpty(model.Password))
            {
                return BadRequest();
            }

            var (token, user) = await _authService.AuthenticateAsync(model.UserName, model.Password);
            if (token == null)
            {
                return Unauthorized("Sai tên đăng nhập hoặc mật khẩu");
            }
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true, 
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddMinutes(60)
            };
            Response.Cookies.Append("token", token, cookieOptions);

            return Ok(new {token});
        }


        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("token");
            return Ok(new { message = "Đăng xuất thành công" });
        }
        [Authorize(Roles = "1")]
        [HttpGet("protected-route")]
        public IActionResult ProtectedRoute()
        {
            return Ok();
        }
        [Authorize]
        [HttpGet("me")]
        public IActionResult GetUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            if (userId == null) return Unauthorized("Token không hợp lệ");
            return Ok(new { userID = userId, roleID = role });
        }

    }
}
