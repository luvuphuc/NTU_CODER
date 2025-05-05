using AddressManagementSystem.Infrashtructure.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Repositories;
using ntucoderbe.Infrashtructure.Services;
using System.Net;

namespace ntucoderbe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParticipationController : ControllerBase
    {
        private readonly ParticipationRepository _repository;
        private readonly AuthService _authService;

        public ParticipationController(ParticipationRepository repository, AuthService authService)
        {
            _repository = repository;
            _authService = authService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllParticipations([FromQuery] QueryObject query, string? sortField = null, bool ascending = true)
        {
            try
            {
                var result = await _repository.GetAllParticipationsAsync(query, sortField, ascending);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateParticipation([FromBody] ParticipationDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }

            try
            {
                var coderID = _authService.GetUserIdFromToken();
                dto.CoderID = coderID;
                var result = await _repository.CreateParticipationAsync(dto);
                return CreatedAtAction(nameof(GetParticipationById), new { id = result.ParticipationID }, result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Errors = new List<string> { ex.Message } });
            }
        }

        // Get problem by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetParticipationById(int id)
        {
            try
            {
                var problem = await _repository.GetParticipationByIdAsync(id);

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
        public async Task<IActionResult> UpdateParticipation(int id, [FromBody] ParticipationDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }

            try
            {
                var result = await _repository.UpdateParticipationAsync(id, dto);
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
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        // Delete a problem by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteParticipation(int id)
        {
            try
            {
                var isDeleted = await _repository.DeleteParticipationAsync(id);

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
        [HttpGet("check")]
        public async Task<IActionResult> CheckParticipationAndPermission(int contestID)
        {
            var coderID = _authService.GetUserIdFromToken();
            try
            {
                var (participationId, onGoing) = await _repository.CheckRegisteredAndPerAsync(coderID, contestID);

                return Ok(new
                {
                    participationId,
                    onGoing
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    status = "error",
                    message = "Có lỗi xảy ra.",
                    error = ex.Message
                });
            }
        }
        [HttpGet("profile")]
        public async Task<IActionResult> GetParticipationsByCoderId(int coderID)
        {
            try
            {
                List<ParticipationDTO> list = await _repository.GetParticipationsByCoderIdAsync(coderID);
                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }

    }
}
