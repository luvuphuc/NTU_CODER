using FluentValidation;
using ntucoderbe.DTOs;

namespace ntucoderbe.Validator
{
    public class CoderValidator : AbstractValidator<CoderDTO>
    {
        public CoderValidator(bool isUpdate = false)
        {
            if (!isUpdate)
            {
                RuleFor(coder => coder.UserName)
                    .Cascade(CascadeMode.Stop)
                    .NotEmpty().WithMessage("Tên đăng nhập không được để trống.")
                    .MinimumLength(3).WithMessage("Tên đăng nhập phải có ít nhất 3 ký tự.")
                    .MaximumLength(30).WithMessage("Tên đăng nhập không được vượt quá 30 ký tự.")
                    .Matches("^[a-zA-Z0-9]+$").WithMessage("Tên đăng nhập chỉ được chứa chữ và số, không bao gồm ký tự đặc biệt.");

                RuleFor(coder => coder.CoderName)
                    .Cascade(CascadeMode.Stop)
                    .NotEmpty().WithMessage("Họ và tên không được để trống.")
                    .MaximumLength(100).WithMessage("Họ và tên không được vượt quá 100 ký tự.");

                RuleFor(coder => coder.CoderEmail)
                    .Cascade(CascadeMode.Stop)
                    .NotEmpty().WithMessage("Email không được để trống.")
                    .EmailAddress().WithMessage("Địa chỉ email không hợp lệ.")
                    .Matches(@".+\@.+\..+").WithMessage("Địa chỉ email không hợp lệ.");

                RuleFor(coder => (coder as CreateCoderDTO)!.Password)
                    .Cascade(CascadeMode.Stop)
                    .NotEmpty().WithMessage("Mật khẩu không được để trống.")
                    .MinimumLength(6).WithMessage("Mật khẩu phải có ít nhất 6 ký tự.")
                    .MaximumLength(50).WithMessage("Mật khẩu không được vượt quá 50 ký tự.")
                    .When(coder => coder is CreateCoderDTO);

                RuleFor(coder => coder.PhoneNumber)
                    .Cascade(CascadeMode.Stop)
                    .NotEmpty().WithMessage("Số điện thoại không được để trống.")
                    .Matches(@"^\d{10}$").WithMessage("Số điện thoại phải có 10 số.")
                    .When(coder => coder is CreateCoderDTO);
            }
            else
            {
                // Update validation
                RuleFor(coder => coder.CoderName)
                    .Cascade(CascadeMode.Stop)
                    .MaximumLength(100).WithMessage("Họ và tên không được vượt quá 100 ký tự.")
                    .When(coder => !string.IsNullOrEmpty(coder.CoderName));

                RuleFor(coder => (coder as CoderDetailDTO)!.Description)
                    .Cascade(CascadeMode.Stop)
                    .MaximumLength(100).WithMessage("Mô tả không được vượt quá 100 ký tự.")
                    .When(coder => !string.IsNullOrEmpty((coder as CoderDetailDTO)?.Description));

                RuleFor(coder => (coder as CoderDetailDTO)!.Gender)
                    .IsInEnum().WithMessage("Giới tính không hợp lệ.")
                    .When(coder => (coder as CoderDetailDTO)!.Gender.HasValue);

                RuleFor(coder => coder.PhoneNumber)
                    .Cascade(CascadeMode.Stop)
                    .Matches(@"^\d{10}$").WithMessage("Số điện thoại phải có 10 số.")
                    .When(coder => !string.IsNullOrEmpty(coder.PhoneNumber));
            }
        }
    }
}
