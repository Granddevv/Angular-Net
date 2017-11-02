using System;
using HermesOnline.Web.Spa.Providers;
using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Owin;

namespace HermesOnline.Web.Spa
{
    public partial class Startup
    {
        public void ConfigureOAuth(IAppBuilder app)
        {
            var options = new OAuthAuthorizationServerOptions()
            {
                AllowInsecureHttp = true,
                TokenEndpointPath = new PathString("/api/token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(3650),
                Provider = new HermesOnlineAuthorizationServerProvider()
            };

            // Token Generation
            app.UseOAuthAuthorizationServer(options);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());
        }
    }
}