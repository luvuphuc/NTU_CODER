using AddressManagementSystem.Infrashtructure.Helpers;
using FluentValidation;
using Humanizer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Repositories;
using ntucoderbe.Infrashtructure.Services;

namespace ntucoderbe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompilerController : ControllerBase
    {
        private readonly CompilerRepository _compilerRepository;

        public CompilerController(CompilerRepository compilerRepository)
        {
            _compilerRepository = compilerRepository;
        }

        [HttpGet("all")]

        public async Task<IActionResult> GetAllCompilers([FromQuery] QueryObject query, string? sortField = null, bool ascending = true)
        {
            try
            {
                var result = await _compilerRepository.GetAllCompilersAsync(query, sortField, ascending);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCompilerById(int id)
        {
            var compiler = await _compilerRepository.GetCompilerByIdAsync(id);
            if (compiler == null) return NotFound();
            return Ok(compiler);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCompiler([FromBody] CompilerDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }
            try
            {
                var result = await _compilerRepository.CreateCompilerAsync(dto);
                return CreatedAtAction(nameof(CreateCompiler), new { id = result.CompilerID }, result);
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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCompiler(int id, CompilerDTO compilerDto)
        {
            if (compilerDto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }

            try
            {
                var result = await _compilerRepository.UpdateCompilerAsync(id, compilerDto);
                return Ok(result);
            }
            catch (ValidationException ex)
            {
                return BadRequest(new { Errors = ex.Errors.Select(e => e.ErrorMessage).ToList() });
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCompiler(int id)
        {
            try
            {
                var isDeleted = await _compilerRepository.DeleteCompilerAsync(id);

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
                    Error = ex.Message
                });
            }
        }
    }
}
