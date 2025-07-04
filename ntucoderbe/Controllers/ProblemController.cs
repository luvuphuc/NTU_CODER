﻿using AddressManagementSystem.Infrashtructure.Helpers;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Repositories;
using ntucoderbe.Infrashtructure.Services;
using ntucoderbe.Models.ERD;

namespace ntucoderbe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProblemController : ControllerBase
    {
        private readonly ProblemRepository _problemRepository;
        private readonly AuthService _authService;

        public ProblemController(ProblemRepository problemRepository, AuthService authService)
        {
            _problemRepository = problemRepository;
            _authService = authService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllProblems([FromQuery] QueryObject query, [FromQuery] string? sortField = null, [FromQuery] bool ascending = true, [FromQuery] bool published = false, [FromQuery] int[]? catList = null, bool? isSolved = null)
        {
            try
            {
                int? coderID = null;

                if (User.Identity?.IsAuthenticated == true)
                {
                    coderID = _authService.GetUserIdFromToken(); 
                    if(coderID == -1)
                    {
                        return Unauthorized();
                    }
                }
                var result = await _problemRepository.GetAllProblemsAsync(query, sortField, ascending, published, catList,isSolved,coderID);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateProblem([FromBody] ProblemDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }

            try
            {
                var coderID = _authService.GetUserIdFromToken();
                dto.CoderID = coderID;
                var result = await _problemRepository.CreateProblemAsync(dto);
                return CreatedAtAction(nameof(GetProblemById), new { id = result.ProblemID }, result);
            }
            catch (ValidationException ex)
            {
                return BadRequest(new { Errors = ex.Errors.Select(e => e.ErrorMessage).ToList() });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Errors = new List<string> { ex.Message } });
            }
        }

        // Get problem by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProblemById(int id)
        {
            try
            {
                var problem = await _problemRepository.GetProblemByIdAsync(id);

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

        // Update a problem by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProblem(int id, [FromBody] ProblemDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }

            try
            {
                var result = await _problemRepository.UpdateProblemAsync(id, dto);
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
        public async Task<IActionResult> DeleteProblem(int id)
        {
            try
            {
                var isDeleted = await _problemRepository.DeleteProblemAsync(id);

                if (isDeleted)
                {
                    return Ok(new
                    {
                        Message = "Xóa bài tập thành công."
                    });
                }
                else
                {
                    return NotFound(new
                    {
                        Message = "Không tìm thấy bài tập với ID được cung cấp."
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "Có lỗi xảy ra khi xóa bài tập.",
                    Error = ex.Message
                });
            }
        }
        [HttpGet("solved/{id}")]
        public async Task<IActionResult> CountSolvedProblem(int id)
        {
            try
            {

                var count = await _problemRepository.CountSolvedProblemAsync(id);

                if (count < 0)
                {
                    return Ok(new { count = 0 });
                }

                return Ok(new { count = count });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }
        [HttpGet("count")]
        public async Task<IActionResult> GetCountAllProblem()
        {
            try
            {
                int count = await _problemRepository.CountAllProblemAsync();
                return Ok(count);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi server: " + ex.Message);
            }
        }
        [HttpGet("ranking-problem")]
        public async Task<IActionResult> GetRankingListByProblemId(int problemId, int? contestId = null)
        {
            try
            {
                return Ok(await _problemRepository.GetRankingListByProblemIdAsync(problemId, contestId));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }
    }
}
