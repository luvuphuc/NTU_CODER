using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.Infrashtructure.Repositories;

namespace ntucoderbe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly SearchRepository _repository;

        public SearchController(SearchRepository repository)
        {
            _repository = repository;
        }
        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] string searchString)
        {
            var results = await _repository.SearchAsync(searchString);
            return Ok(results);
        }
    }
}
