using AddressManagementSystem.Infrashtructure.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Repositories;
using ntucoderbe.Infrashtructure.Services;

namespace ntucoderbe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavouriteController : ControllerBase
    {
        private readonly FavouriteRepository _favouriteRepository;
        private readonly AuthService _authService;

        public FavouriteController(FavouriteRepository favouriteRepository, AuthService authService)
        {
            _favouriteRepository = favouriteRepository;
            _authService = authService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllFavourites([FromQuery] QueryObject query, string? sortField = null, bool ascending = true)
        {
            var categories = await _favouriteRepository.GetAllFavouritesAsync(query, sortField, ascending);
            return Ok(categories);
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateFavourite([FromBody] FavouriteDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }
            try
            {
                dto.CoderID = _authService.GetUserIdFromToken();
                var created = await _favouriteRepository.CreateFavouriteAsync(dto);
                return Ok(dto);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Errors = new List<string> { ex.Message } });
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFavouritedByCoderId(int id)
        {
            try
            {
                var category = await _favouriteRepository.GetFavouriteByCoderIdAsync(id);
                return Ok(category);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFavourite(int coderID, int problemID)
        {
            try
            {
                var isDeleted = await _favouriteRepository.DeleteFavouriteAsync(coderID, problemID);

                if (isDeleted)
                {
                    return Ok(new
                    {
                        Message = "Xóa thành công."
                    });
                }
                else
                {
                    return NotFound(new
                    {
                        Message = "Không tìm thấy."
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "Có lỗi xảy ra.",
                    Error = ex.Message
                });
            }
        }
    }
}
