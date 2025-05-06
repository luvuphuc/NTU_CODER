using AddressManagementSystem.Infrashtructure.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Repositories;
using ntucoderbe.Infrashtructure.Services;
using System.Collections.Generic;

namespace ntucoderbe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContestController : ControllerBase
    {
        private readonly ContestRepository _contestRepository;
        private readonly AuthService _authService;

        public ContestController(ContestRepository contestRepository, AuthService authService)
        {
            _contestRepository = contestRepository;
            _authService = authService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllContests([FromQuery] QueryObject query, string? sortField = null, bool ascending = true, bool published = false, int? status = null, string? searchString = null)
        {
            try
            {
                var result = await _contestRepository.GetAllContestsAsync(query, sortField, ascending, published,status,searchString);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        [HttpGet("upcoming")]
        public async Task<IActionResult> GetUpcomingContests()
        {
            try
            {
                var result = await _contestRepository.GetUpcomingContest();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        [HttpGet("ongoing")]
        public async Task<IActionResult> GetOnGoingContests()
        {
            try
            {
                var result = await _contestRepository.GetOnGoingContest();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateContest([FromBody] ContestDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }

            try
            {
                int coderID = _authService.GetUserIdFromToken();
                dto.CoderID = coderID;
                var result = await _contestRepository.CreateContestAsync(dto);
                return CreatedAtAction(nameof(GetContestById), new { id = result.ContestID }, result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Errors = new List<string> { ex.Message } });
            }
        }

        // Get Contest by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetContestById(int id)
        {
            try
            {
                var Contest = await _contestRepository.GetContestByIdAsync(id);

                if (Contest == null)
                {
                    return NotFound(new { Message = "Không tìm thấy vấn đề với ID được cung cấp." });
                }

                return Ok(Contest);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        // Update a Contest by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateContest(int id, [FromBody] ContestDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }

            try
            {
                var result = await _contestRepository.UpdateContestAsync(id, dto);
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

        // Delete a Contest by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContest(int id)
        {
            try
            {
                var isDeleted = await _contestRepository.DeleteContestAsync(id);

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
        [HttpGet("ranking-contest")]
        public async Task<IActionResult> GetListRankingByContestId(int contestID)
        {
            try
            {
                List<RankingDTO> list = await _contestRepository.GetListRankingByContestIdAsync(contestID);
                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }
        [HttpGet("ranking-highest")]
        public async Task<IActionResult> GetListRankingHighest()
        {
            try
            {
                List<RankingDTO> list = await _contestRepository.GetHighestRankedCoderInAllContestsAsync();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }
    }
}
