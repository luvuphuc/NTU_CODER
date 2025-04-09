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
        [HttpPost("toggle")]
        public async Task<IActionResult> ToggleFavourite([FromBody] FavouriteDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }

            try
            {
                dto.CoderID = _authService.GetUserIdFromToken();

                var existed = await _favouriteRepository.IsFavouriteExistAsync(dto.CoderID, dto.ProblemID);

                if (existed)
                {
                    var isDeleted = await _favouriteRepository.DeleteFavouriteAsync(dto.CoderID, dto.ProblemID);
                    return Ok(new
                    {
                        IsFavourite = false,
                        Message = "Đã xóa khỏi danh sách yêu thích."
                    });
                }
                else
                {
                    var created = await _favouriteRepository.CreateFavouriteAsync(dto);
                    return Ok(new
                    {
                        IsFavourite = true,
                        Message = "Đã thêm vào danh sách yêu thích."
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

        [HttpGet("list")]
        public async Task<IActionResult> GetFavouritedByCoderId()
        {
            try
            {
                var id = _authService.GetUserIdFromToken();
                var favourite = await _favouriteRepository.GetFavouriteByCoderIdAsync(id);
                return Ok(favourite);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
