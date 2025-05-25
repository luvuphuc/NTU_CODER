using Firebase.Auth;
using Google.Apis.Auth;
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
        private readonly IConfiguration _configuration;

        public AuthController(AuthService authService, CoderRepository coderRepository, IConfiguration configuration)
        {
            _authService = authService;
            _coderRepository = coderRepository;
            _configuration = configuration;
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
                //HttpOnly = true, 
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
        [Authorize(Roles = "1,3")]
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
                    RoleID = coder.RoleID,
                    Avatar = coder.Avatar,
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Đã xảy ra lỗi." });
            }
        }
        [AllowAnonymous]
        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleDTO model)
        {
            if (string.IsNullOrEmpty(model.Token))
                return BadRequest("Token không hợp lệ");

            try
            {
                var clientId = _configuration["Authentication:Google:ClientId"];
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new[] { clientId }
                };

                var payload = await GoogleJsonWebSignature.ValidateAsync(model.Token, settings);

                CoderDTO coderDTO = await _coderRepository.GetCoderByEmailAsync(payload.Email);

                Account account;

                if (coderDTO == null)
                {
                    account = await _authService.CreateGoogleUserAsync(payload.Email, payload.Name, payload.Picture);
                    coderDTO = await _coderRepository.GetCoderByIdAsync(account.AccountID);
                }
                else
                {
                    account = await _coderRepository.GetAccountByCoderIdAsync(coderDTO.CoderID);
                }
                var token = _authService.GenerateJwtToken(account);

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddMinutes(60)
                };
                Response.Cookies.Append("token", token, cookieOptions);

                return Ok(new
                {
                    token,
                    AccountID = account.AccountID,
                    RoleID = account.RoleID,
                    CoderName = coderDTO?.CoderName
                });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { message = "Xác thực Google thất bại", detail = ex.Message });
            }
        }
        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] string email)
        {
            var message = await _authService.HandleForgotPasswordAsync(email);
            if (message == null)
                return NotFound(new { message = "Không tìm thấy tài khoản với email này." });

            return Ok(message);
        }

        [AllowAnonymous]
        [HttpPost("verify-reset-code")]
        public async Task<IActionResult> VerifyResetCode([FromBody] ResetPasswordDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Code))
            return BadRequest(new { message = "Thiếu email hoặc mã xác nhận." });

            bool isValid = await _authService.VerifyResetCodeAsync(dto.Email, dto.Code);
            if (!isValid)
                return BadRequest(new { message = "Mã xác nhận không hợp lệ hoặc đã hết hạn." });
            

            return Ok();
        }
        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Code) ||
                string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                return BadRequest(new { message = "Thiếu thông tin cần thiết." });
            }
            bool isValid = await _authService.VerifyResetCodeAsync(dto.Email, dto.Code);
            if (!isValid)
               
                return BadRequest(new { message = "Mã xác nhận không hợp lệ hoặc đã hết hạn." });

            bool result = await _coderRepository.ChangePwdWhenForgotPwdAsync(dto.Email, dto.NewPassword);
            if (!result)
                
            return BadRequest(new { message = "Không thể cập nhật mật khẩu." });

            return Ok();
        }


    }
}
