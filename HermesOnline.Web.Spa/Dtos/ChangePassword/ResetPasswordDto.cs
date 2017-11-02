namespace HermesOnline.Web.Spa.Dtos.ChangePassword
{
    public class ResetPasswordDto
    {
        public string UserId { get; set; }

        public string Code { get; set; }

        public string Password { get; set; }
    }
}