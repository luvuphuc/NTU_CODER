using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.EntityFrameworkCore;
using ntucoderbe.Infrashtructure.Repositories;
using ntucoderbe.Infrashtructure.Services;
using ntucoderbe.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using ntucoderbe.Infrashtructure.Middlewares;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options=>
{
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme,
        }
    };
    options.AddSecurityDefinition("Bearer",jwtSecurityScheme);
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {jwtSecurityScheme,Array.Empty<string>() }
    });
});
builder.Services.AddScoped<RoleRepository>();
builder.Services.AddScoped<CoderRepository>();
builder.Services.AddScoped<CompilerRepository>();
builder.Services.AddScoped<CategoryRepository>();
builder.Services.AddScoped<ProblemRepository>();
builder.Services.AddScoped<TestCaseRepository>();
builder.Services.AddScoped<SubmissionRepository>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<CodeExecutionService>();
builder.Services.AddScoped<TestRunRepository>();
builder.Services.AddScoped<BlogRepository>();
builder.Services.AddScoped<ContestRepository>();
builder.Services.AddScoped<FavouriteRepository>();
var allowedOrigins = builder.Configuration["CorsSettings:AllowedOrigins"]?.Split(",") ?? new[] { "http://localhost:3000" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMyOrigin", policy =>
    {
        policy.WithOrigins(allowedOrigins) 
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
builder.Services.AddAuthentication(options =>
{ 
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    }).AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtConfig:SecretKey"]!)),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = builder.Configuration["JwtConfig:Issuer"],
            ValidAudience = builder.Configuration["JwtConfig:Audience"]
        };
});

builder.Services.AddAuthorization();

//check connectionstring
var conString = builder.Configuration.GetConnectionString("DefaultConnection") ??
     throw new InvalidOperationException("Connection string 'DefaultConnection'" +
    " not found.");
builder.Services.AddDbContextFactory<ApplicationDbContext>(options =>
    options.UseMySQL(conString));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
FirebaseApp.Create(new AppOptions
{
    Credential = GoogleCredential.FromFile("luvuphuc-firebase-790e8-firebase-adminsdk-axcoh-03ea884b0e.json") 
});
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors("AllowMyOrigin");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseSession();
app.MapControllers();

app.Run();
