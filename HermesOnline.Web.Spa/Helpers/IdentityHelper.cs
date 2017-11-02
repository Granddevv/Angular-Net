using System;
using System.Web.Http.Controllers;

namespace HermesOnline.Web.Spa.Helpers
{
    public static class IdentityHelper
    {
        public static Guid? GetUserId(HttpRequestContext requestContext)
        {
            Guid? userId = null;
            if (requestContext.Principal != null
                   && requestContext.Principal.Identity != null
                   && !string.IsNullOrEmpty(requestContext.Principal.Identity.Name))
            {
                userId = new Guid(requestContext.Principal.Identity.Name);
            }
            return userId;
        }     
    }
}