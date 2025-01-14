using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Net;
using System.Text.Json;
#pragma warning disable CS8602 // Dereference of a possibly null reference.
namespace AddressManagementSystem.Infrashtructure.Middlewares
{
    // You may need to install the Microsoft.AspNetCore.Http.Abstractions package into your project
   
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;
        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }
        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {

            _logger.LogError(exception, "An unhandled exception occurred.");
            var statusCode = HttpStatusCode.InternalServerError;
            var error = "Internal server error. Please retry later.";
            
            if (exception is KeyNotFoundException)
            {
                statusCode = HttpStatusCode.NotFound;
                error = "Not found.";
            } 
            else if (exception is ArgumentException)
            {
                statusCode = HttpStatusCode.BadRequest;
                error = "Bad Request.";

            } 
            else if (exception is UnauthorizedAccessException)
            {
                statusCode = HttpStatusCode.Unauthorized;
                error = "Unauthorized.";
            } 

            var response = new ProblemDetails
            {
                Status = (int)statusCode,
                Title = error,
                Detail = exception.Message
            };

            // This is often very handy information for tracing the specific request
            var traceId = Activity.Current?.Id ?? context?.TraceIdentifier;
            if (traceId != null)
            {
                response.Extensions["traceId"] = traceId;
            }
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int) statusCode;
           await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class ExceptionHandlingMiddlewareExtensions
    {
        public static IApplicationBuilder UseExceptionHandlingMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ExceptionHandlingMiddleware>();
        }
    }
}
#pragma warning restore CS8602 // Dereference of a possibly null reference.