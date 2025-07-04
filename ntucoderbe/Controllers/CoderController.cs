﻿using AddressManagementSystem.Infrashtructure.Helpers;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Repositories;
using ntucoderbe.Infrashtructure.Services;
using System.Linq;

namespace ntucoderbe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoderController : ControllerBase
    {
        private readonly CoderRepository _coderRepository;
        private readonly AuthService _authService;

        public CoderController(CoderRepository coderRepository, AuthService authService)
        {
            _coderRepository = coderRepository;
            _authService = authService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllCoders([FromQuery] QueryObject query, string? sortField = null, bool ascending = true)
        {
            try
            {
                var result = await _coderRepository.GetAllCoderAsync(query, sortField, ascending);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,ex.Message);
            }
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateCoder([FromBody] CoderDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }
            try
            {
                var result = await _coderRepository.CreateCoderAsync(dto);
                return CreatedAtAction(nameof(CreateCoder), new { id = result.CoderID }, result);
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
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCoderById(int id)
        {
            try
            {
                CoderDTO coder = await _coderRepository.GetCoderByIdAsync(id);

                if (coder == null)
                {
                    return NotFound(new { Message = "Không tìm thấy coder với ID được cung cấp." });
                }

                return Ok(coder);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCoder(int id, [FromBody] CoderDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }

            try
            {
                CoderDTO result = await _coderRepository.UpdateCoderAsync(id, dto);
                return Ok(result);
            }
            catch (ValidationException ex)
            {
                return BadRequest(new { Errors = new List<string> { ex.Message } });
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
        [HttpPut("avatar/{id}")]
        public async Task<IActionResult> UpdateAvatar(int id, [FromForm] AvatarUploadDTO avatarFile)
        {
            if (avatarFile == null)
            {
                return BadRequest(new { Error = "Không tìm thấy file" });
            }

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtension = Path.GetExtension(avatarFile.AvatarFile.FileName).ToLower();

            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest(new { Error = "Chỉ nhận các file ảnh với đuôi .jpg, .jpeg, .png, .gif" });
            }

            try
            {
                var avatarUrl = await _coderRepository.UpdateAvatarAsync(id, avatarFile);
                return Ok(new { AvatarUrl = avatarUrl });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCoder(int id)
        {
            try
            {
                var isDeleted = await _coderRepository.DeleteCoderAsync(id);

                if (isDeleted)
                {
                    return Ok(new
                    {
                        Message = "Xóa coder thành công."
                    });
                }
                else
                {
                    return NotFound(new
                    {
                        Message = "Không tìm thấy coder với ID được cung cấp."
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "Có lỗi xảy ra khi xóa coder.",
                    Error = ex.Message
                });
            }
        }
        [HttpGet("profile")]
        public async Task<IActionResult> GetInformationProfile(int coderID)
        {
            if (coderID == -1) 
                return BadRequest();
            CoderWithLanguageDTO obj = await _coderRepository.GetInformationForCoderAsync(coderID);
            if (obj == null)
                return NotFound(new
                {
                    Message = "Không tìm thấy coder với ID được cung cấp."
                });

            return Ok(obj);
        }
        [Authorize]
        [HttpGet("edit-profile{id}")]
        public async Task<IActionResult> GetDetailInformationProfile(int coderID)
        {
            try
            {
                int authenId = _authService.GetUserIdFromToken();
                if (authenId == 1)
                {
                    return Unauthorized();
                }
                if (coderID == authenId)
                {
                    CoderDTO coder = await _coderRepository.GetCoderByIdAsync(coderID);

                    if (coder == null)
                    {
                        return NotFound(new { Message = "Không tìm thấy coder với ID được cung cấp." });
                    }

                    return Ok(coder);
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        
        [HttpGet("ranking-coder")]
        public async Task<IActionResult> GetRankingListByTotalSolved()
        {
            try
            {
                return Ok(await _coderRepository.GetRankingByTotalSolvedAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }

    }
}
