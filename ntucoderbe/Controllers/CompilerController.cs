using FluentValidation;
using Humanizer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Services;
using ntucoderbe.Validator;

namespace ntucoderbe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompilerController : ControllerBase
    {
        private readonly ICompilerService _compilerService;

        public CompilerController(ICompilerService compilerService)
        {
            _compilerService = compilerService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCompilers()
        {
            var compilers = await _compilerService.GetAllCompilersAsync();
            return Ok(compilers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCompilerById(int id)
        {
            var compiler = await _compilerService.GetCompilerByIdAsync(id);
            if (compiler == null) return NotFound();
            return Ok(compiler);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCompiler(CompilerDTO compilerDto)
        {
            if (compilerDto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }
            try
            {
                var result = await _compilerService.CreateCompilerAsync(compilerDto);
                return CreatedAtAction(nameof(CompilerDTO), new { id = result.CompilerID }, result);
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
                var result = await _compilerService.UpdateCompilerAsync(id, compilerDto);
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
            var result = await _compilerService.DeleteCompilerAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
