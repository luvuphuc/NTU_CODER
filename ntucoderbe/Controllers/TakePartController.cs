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
    public class TakePartController : ControllerBase
    {
        private readonly TakePartsRepository _takepartrepository;
        private readonly AuthService _authservice;
        private readonly ParticipationRepository _participationrepository;

        public TakePartController(TakePartsRepository takepartrepository, AuthService authservice, ParticipationRepository participationrepository)
        {
            _takepartrepository = takepartrepository;
            _authservice = authservice;
            _participationrepository = participationrepository;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllTakeParts([FromQuery] QueryObject query, string? sortField = null, bool ascending = true)
        {
            try
            {
                var result = await _takepartrepository.GetAllTakePartsAsync(query, sortField, ascending);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateTakePart([FromBody] TakePartDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }

            try
            {
                var result = await _takepartrepository.CreateTakePartAsync(dto);
                return CreatedAtAction(nameof(GetTakePartById), new { id = result.TakePartID }, result);

            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Errors = new List<string> { ex.Message } });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        // Get problem by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTakePartById(int id)
        {
            try
            {
                var problem = await _takepartrepository.GetTakePartByIdAsync(id);

                if (problem == null)
                {
                    return NotFound(new { Message = "Không tìm thấy vấn đề với ID được cung cấp." });
                }

                return Ok(problem);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTakePart(int id)
        {
            try
            {
                var result = await _takepartrepository.UpdateTakePartAsync(id);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Errors = new List<string> { ex.Message } });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Lỗi server: " + ex.Message });
            }
        }

        // Delete a problem by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTakePart(int id)
        {
            try
            {
                var isDeleted = await _takepartrepository.DeleteTakePartAsync(id);

                if (isDeleted)
                {
                    return Ok();
                }
                else
                {
                    return NotFound();
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
