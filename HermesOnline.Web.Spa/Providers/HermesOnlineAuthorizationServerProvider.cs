using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Autofac;
using Autofac.Integration.Owin;
using HermesOnline.Core;
using HermesOnline.Service;
using Microsoft.Owin.Security.OAuth;

namespace HermesOnline.Web.Spa.Providers
{
    public class HermesOnlineAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            var userManager = context.OwinContext.GetAutofacLifetimeScope().Resolve<IUserManager>();
            var user = await userManager.FindAsync(context.UserName, context.Password);

            if (user == null)
            {
                context.SetError("invalid_grant", "User name or password is wrong");
                context.Rejected();
                return;
            }

            // TODO Add cases for email confirmation and lockout if needed

            var tenant = context.OwinContext.GetAutofacLifetimeScope().ResolveKeyed<Tenant>("Tenant");

            var identity = new ClaimsIdentity(context.Options.AuthenticationType);

            identity.AddClaim(new Claim(ClaimTypes.Name, user.Id.ToString()));
            identity.AddClaim(new Claim("role", "user"));
            identity.AddClaim(new Claim("tenant", tenant.Name));
            identity.AddClaim(new Claim("userName", user.UserName));
            identity.AddClaim(new Claim("permissions",
                string.Join(",", user.Group.Permissions.Select(x => x.Permission))));

            context.Validated(identity);
        }
    }
}