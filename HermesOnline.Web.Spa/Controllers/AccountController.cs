using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using AutoMapper;
using HermesOnline.Domain.Identity;
using HermesOnline.Service;
using HermesOnline.Service.Implementations;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Dtos.ChangePassword;
using HermesOnline.Web.Spa.Dtos.RequestAccess;
using HermesOnline.Web.Spa.Filters;
using HermesOnline.Web.Spa.Helpers;
using Microsoft.AspNet.Identity;
using HermesOnline.Service.Model;
using HermesOnline.Service.Dto;

namespace HermesOnline.Web.Spa.Controllers
{
    [RoutePrefix("Api/Account")]
    public class AccountController : BaseController
    {
        private readonly IUserManager _userManager;
        private readonly IEmailService _emailService;
        private readonly IUserManagementApiService _userManagementService;
        private readonly IMapper _mapper;
        private const string EmailSubject = "HermesOnline - Reset Password";

        public AccountController(IUserManager userManager, IEmailService emailService, IMapper mapper,
            IUserManagementApiService userManagementService)
        {
            _userManager = userManager;
            _emailService = emailService;
            _mapper = mapper;
            _userManagementService = userManagementService;
        }

        [Route("RequestResetPassword/{userName?}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<HttpResponseMessage> RequestResetPassword(string userName)
        {
            IdentityUser user = await _userManager.FindByNameAsync(userName);
            if (user == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "User does not exist.");
            }

            string code = await _userManager.GeneratePasswordResetTokenAsync(user.Id);
            string callbackUrl = LocalUrlHelper.GenerateResetPasswordLink(user.Id.ToString(),
                HttpUtility.UrlEncode(code));

            Email email = new Email
            {
                Subject = EmailSubject,
                Body = $"Please reset your password by clicking <a href='{callbackUrl}'>here</a>",
                IsBodyHtml = true
            };
            email.To.Add(userName);
            _emailService.SendEmail(email);

            return Request.CreateResponse(HttpStatusCode.OK);
        }


        [Route("ResetPassword/{userId?}/{code?}/{password?}")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<HttpResponseMessage> ResetPassword(ResetPasswordDto model)
        {
            IdentityResult result = await _userManager.ResetPasswordAsync(new Guid(model.UserId), model.Code,
                model.Password);
            return result.Errors.Any()
                ? Request.CreateResponse(HttpStatusCode.BadRequest, string.Join(",", result.Errors))
                : Request.CreateResponse(HttpStatusCode.OK);
        }

        [Route("UserName")]
        [HttpGet]
        [AuthorizationUser(Permission.ManagerViewNavigation)]
        public string GetUserName()
        {
            if (!CurrentUserId.HasValue)
            {
                throw new Exception("User is not logged in.");
            }

            var user = _userManagementService.GetUserById(CurrentUserId.Value);
            return user.FullName;
        }

        [Route("RequestLogin")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> RequestLoginAccess(RequestAccessDto user)
        {
            if (ModelState.IsValid)
            {
                IdentityUser applicationUser = _mapper.Map<IdentityUser>(user);
                ServiceResult result = await _userManagementService.RequestLoginAccess(applicationUser, user.Password);

                if (result.Succeeded)
                {
                    _userManagementService.SendNotificationEmail($"{user.FirstName} {user.LastName}", user.UserName,
                        LocalUrlHelper.GetApplicationUrl());
                }

                return Request.CreateResponse(HttpStatusCode.OK, result.Message);
            }

            return Request.CreateResponse(HttpStatusCode.BadRequest,
                string.Join("; ", ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage)));
        }

        [Route("CheckExistingEmail/{email?}")]
        [HttpGet]
        [AllowAnonymous]
        public bool CheckExistingEmail(string email)
        {
            User result = _userManagementService.GetUserByEmail(email);
            if(result!= null)
            {
                if(result.IsDeleted == false)
                {
                    return true;
                }
            }
            return false;
        }

        [Route("CheckExistingPassword/{password?}")]
        [HttpGet]
        [AuthorizationUser(Permission.ManagerViewNavigation)]
        public async Task<bool> CheckExistingPassword(string password)
        {
            if (!CurrentUserId.HasValue)
            {
                throw new Exception("User is not logged in.");
            }

            var currentUser = _userManagementService.GetUserById(CurrentUserId.Value);
            IdentityUser user = await _userManager.FindAsync(currentUser.Email, password);
            return user != null;
        }

        [Route("ChangePassword")]
        [HttpPost]
        [AuthorizationUser(Permission.ManagerViewNavigation)]
        public HttpResponseMessage ChangePassword(ChangePasswordDto model)
        {
            if (!CurrentUserId.HasValue)
            {
                throw new Exception("User is not logged in.");
            }

            var currentUser = _userManagementService.GetUserById(CurrentUserId.Value);

            User user = _userManagementService.GetUserByEmail(currentUser.Email);
            if (user != null)
            {
                string passwordHash = _userManager.HashPassword(model.NewPassword);
                user.PasswordHash = passwordHash;
                _userManagementService.UpdateUser(user);
                return Request.CreateResponse(HttpStatusCode.OK);
            }

            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        [Route("IdentityPermissions")]
        [HttpGet]
        [Authorize]
        public IEnumerable<Permission> GetLoggedUserPermissions()
        {
            if (CurrentUserId.HasValue)
            {
                var currentUser = _userManagementService.GetUserById(CurrentUserId.Value);

                var userGroup = currentUser.Group;
                if (userGroup != null)
                {
                    return userGroup.Permissions.Select(x => x.Permission);
                }
            }

            return Enumerable.Empty<Permission>();
        }
    }
}


