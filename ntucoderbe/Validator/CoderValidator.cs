using FluentValidation;
using ntucoderbe.DTOs;

namespace ntucoderbe.Validator
{
    public class CoderValidator : AbstractValidator<CreateCoderDTO>
    {
        public CoderValidator()
        {
            RuleFor(coder => coder.CoderName)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Tên lập trình viên không được để trống.")
                .MaximumLength(100).WithMessage("Tên lập trình viên không được vượt quá 100 ký tự.");
            RuleFor(coder => coder.CoderEmail)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Email không được để trống.")
                .EmailAddress().WithMessage("Địa chỉ email không hợp lệ.")
                .Matches(@".+\@.+\..+").WithMessage("Địa chỉ email không hợp lệ.");
            RuleFor(coder => coder.UserName)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Tên đăng nhập không được để trống.")
                .MinimumLength(3).WithMessage("Tên đăng nhập phải có ít nhất 3 ký tự.")
                .MaximumLength(30).WithMessage("Tên đăng nhập không được vượt quá 30 ký tự.");
            RuleFor(coder => coder.Password)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Mật khẩu không được để trống.")
                .MinimumLength(6).WithMessage("Mật khẩu phải có ít nhất 6 ký tự.");
            RuleFor(coder => coder.PhoneNumber)
               .Cascade(CascadeMode.Stop)
               .Matches(@"^\d{10}$").WithMessage("Số điện thoại phải có 10 số.")
               .When(coder => !string.IsNullOrEmpty(coder.PhoneNumber));
            When(coder => coder.CoderID > 0, () =>
            {
                RuleFor(coder => coder.CoderName)
               .MaximumLength(100).WithMessage("Tên lập trình viên không được vượt quá 100 ký tự.")
               .When(coder => !string.IsNullOrEmpty(coder.CoderName));

                RuleFor(coder => coder.CoderEmail)
                .EmailAddress().WithMessage("Địa chỉ email không hợp lệ.")
                .Matches(@".+\@.+\..+").WithMessage("Địa chỉ email không hợp lệ.")
                .When(coder => !string.IsNullOrEmpty(coder.CoderEmail));

                RuleFor(coder => coder.PhoneNumber)
                    .Matches(@"^\d{10}$").WithMessage("Số điện thoại phải có 10 số.")
                    .When(coder => !string.IsNullOrEmpty(coder.PhoneNumber));
            });
        }
    }
}
