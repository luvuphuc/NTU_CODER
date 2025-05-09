using Firebase.Auth;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Repositories;
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
        private readonly CoderRepository _coderRepository;

        public AuthController(AuthService authService, CoderRepository coderRepository)
        {
            _authService = authService;
            _coderRepository = coderRepository;
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
            var coder = await _coderRepository.GetCoderByIdAsync(user.AccountID);
            if (coder == null)
            {
                return BadRequest("Không tìm thấy.");
            }
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true, 
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddMinutes(60)
            };
            Response.Cookies.Append("token", token, cookieOptions);

            return Ok(new { token, AccountID = user.AccountID, RoleID = user.RoleID, CoderName = coder.CoderName });

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
        public async Task<IActionResult> Me()
        {
            try
            {
                var coderID = _authService.GetUserIdFromToken();
                if (coderID == -1)
                {
                    return Unauthorized();
                }
                var coder = await _coderRepository.GetCoderByIdAsync(coderID);

                if (coder == null)
                {
                    return NotFound(new { message = "Coder không tồn tại." });
                }
                return Ok(new
                {
                    CoderID = coderID,
                    CoderName = coder.CoderName,
                    RoleID = coder.RoleID
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Đã xảy ra lỗi." });
            }
        }

    }
}
