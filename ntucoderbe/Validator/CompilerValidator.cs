using FluentValidation;
using ntucoderbe.DTOs;

namespace ntucoderbe.Validator
{
    public class CompilerValidator : AbstractValidator<CompilerDTO>
    {
        public CompilerValidator(bool isUpdate = false)
        {
            if (!isUpdate)
            {
                RuleFor(compiler => compiler.CompilerName)
                .NotEmpty().WithMessage("Tên trình biên dịch không được để trống.");
                RuleFor(compiler => compiler.CompilerPath)
                    .NotEmpty().WithMessage("Đường dẫn trình biên dịch không được để trống.");

                RuleFor(compiler => compiler.CompilerOption)
                    .NotNull().WithMessage("Tùy chọn trình biên dịch không được để trống.");

                RuleFor(compiler => compiler.CompilerExtension)
                    .NotEmpty().WithMessage("Phần mở rộng trình biên dịch không được để trống.");
            }
        }
    }
}
