using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using HermesOnline.Domain.Identity;
using HermesOnline.Service.Interfaces;
using HermesOnline.Web.Framework.DI;

namespace HermesOnline.Web.Spa.Filters
{
    public class AuthorizationUserAttribute: AuthorizationFilterAttribute
    {
        public Permission[] Permissions { get; set; }

        public AuthorizationUserAttribute(params Permission[] values)
        {
            Permissions = values;
        }

        public override Task OnAuthorizationAsync(HttpActionContext actionContext, CancellationToken cancellationToken)
        {
            ClaimsPrincipal claimsPrincipal = actionContext.RequestContext.Principal as ClaimsPrincipal;
            if (claimsPrincipal.Identity.IsAuthenticated && claimsPrincipal.HasClaim(x=> x.Type == "permissions"))
            {
                string[] permissions = claimsPrincipal.Claims.First(x => x.Type == "permissions").Value.Split(',');

                foreach (string permission in permissions)
                {
                    if (Permissions.ToList().Contains((Permission)Enum.Parse(typeof(Permission), permission)))
                    {
                        return Task.FromResult<object>(null);
                    }
                }
            }

            actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Forbidden);
            return Task.FromResult<object>(null);
          
        }
    }
}