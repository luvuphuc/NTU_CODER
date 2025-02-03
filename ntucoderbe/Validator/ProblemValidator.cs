using FluentValidation;
using ntucoderbe.DTOs;

namespace ntucoderbe.Validator
{
    public class ProblemValidator : AbstractValidator<ProblemDTO>
    {
        public ProblemValidator(bool isUpdate = false)
        {
            if (!isUpdate)
            {
                RuleFor(x => x.ProblemName)
                    .NotEmpty().WithMessage("Tên bài tập không được để trống");

                RuleFor(x => x.ProblemCode)
                    .Cascade(CascadeMode.Stop)
                    .NotEmpty().WithMessage("Mã bài tập không được để trống")
                    .Matches("^[a-zA-Z0-9]+$").WithMessage("Mã bài tập chỉ chấp nhận chữ cái và số");

                RuleFor(x => x.TimeLimit)
                    .NotEmpty().WithMessage("Thời gian giới hạn không được để trống")
                    .GreaterThan(0).WithMessage("Thời gian giới hạn phải lớn hơn 0");

                RuleFor(x => x.MemoryLimit)
                    .NotEmpty().WithMessage("Giới hạn bộ nhớ không được để trống")
                    .GreaterThan(0).WithMessage("Giới hạn bộ nhớ phải lớn hơn 0");

                RuleFor(x => x.ProblemContent)
                    .NotEmpty().WithMessage("Nội dung không được để trống");

                RuleFor(x => x.ProblemExplanation)
                    .NotEmpty().WithMessage("Giải thích bài tập không được để trống");

                RuleFor(x => x.TestType)
                    .NotEmpty().WithMessage("Hình thức kiểm tra không được để trống");

                RuleFor(x => x.TestCode)
                    .NotEmpty().WithMessage("Mã kiểm tra không được để trống");
            }
            else
            {
                RuleFor(x => x.ProblemName)
                    .NotEmpty().WithMessage("Tên bài tập không được để trống")
                    .When(x => !string.IsNullOrEmpty(x.ProblemName));

                RuleFor(x => x.ProblemCode)
                    .Matches("^[a-zA-Z0-9]+$").WithMessage("Mã bài tập chỉ chấp nhận chữ cái và số")
                    .When(x => !string.IsNullOrEmpty(x.ProblemCode));

                RuleFor(x => x.TimeLimit)
                    .GreaterThan(0).WithMessage("Giới hạn thời gian phải lớn hơn 0")
                    .When(x => x.TimeLimit.HasValue);

                RuleFor(x => x.MemoryLimit)
                    .GreaterThan(0).WithMessage("Giới hạn bộ nhớ phải lớn hơn 0")
                    .When(x => x.MemoryLimit.HasValue);

                RuleFor(x => x.ProblemContent)
                    .NotEmpty().WithMessage("Nội dung không được để trống")
                    .When(x => !string.IsNullOrEmpty(x.ProblemContent));

                RuleFor(x => x.ProblemExplanation)
                    .NotEmpty().WithMessage("Giải thích bài tập không được để trống")
                    .When(x => !string.IsNullOrEmpty(x.ProblemExplanation));

                RuleFor(x => x.TestType)
                    .NotEmpty().WithMessage("Hình thức kiểm tra không được để trống")
                    .When(x => !string.IsNullOrEmpty(x.TestType));

                RuleFor(x => x.TestCode)
                    .NotEmpty().WithMessage("Mã kiểm tra không được để trống")
                    .When(x => !string.IsNullOrEmpty(x.TestCode));
            }
        }
    }
}
