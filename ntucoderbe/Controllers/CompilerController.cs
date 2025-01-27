using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Services;

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
            var createdCompiler = await _compilerService.CreateCompilerAsync(compilerDto);
            return CreatedAtAction(nameof(GetCompilerById), new { id = createdCompiler.CompilerID }, createdCompiler);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCompiler(int id, CompilerDTO compilerDto)
        {
            var updatedCompiler = await _compilerService.UpdateCompilerAsync(id, compilerDto);
            if (updatedCompiler == null) return NotFound();
            return Ok(updatedCompiler);
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
