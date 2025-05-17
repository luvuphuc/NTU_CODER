using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ntucoderbe.DTOs;
using ntucoderbe.Infrashtructure.Repositories;

namespace ntucoderbe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticController : ControllerBase
    {
        private readonly StatisticRepository _statisticRepository;

        public StatisticController(StatisticRepository statisticRepository)
        {
            _statisticRepository = statisticRepository;
        }
        [HttpGet("card-statistic")]
        public async Task<ActionResult<CardStatisticDTO>> GetStatistics()
        {
            var stats = await _statisticRepository.GetTotalCardStatisticAsync();
            return Ok(stats);
        }
        [HttpGet("submission-status")]
        public async Task<IActionResult> GetSubmissionStatus()
        {
            var data = await _statisticRepository.GetSubmissionStatusBreakdownAsync();
            return Ok(data);
        }
        [HttpGet("user-growth")]
        public async Task<ActionResult<List<UserGrowthDTO>>> GetUserGrowth()
        {
            var data = await _statisticRepository.GetUserGrowthOverTimeAsync();
            return Ok(data);
        }
        [HttpGet("top-problems")]
        public async Task<ActionResult<List<TopProblemDTO>>> GetTopProblems([FromQuery] int top = 5)
        {
            var data = await _statisticRepository.GetTopProblemsBySubmissionAsync(top);
            return Ok(data);
        }
        [HttpGet("top-contests")]
        public async Task<ActionResult<List<TopContestParticipationDTO>>> GetTopContest([FromQuery] int top = 5)
        {
            var data = await _statisticRepository.GetTopContestsByParticipationAsync(top);
            return Ok(data);
        }
    }
}
