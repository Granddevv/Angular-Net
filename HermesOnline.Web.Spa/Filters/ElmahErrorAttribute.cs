using System.Net.Http;
using System.Web.Http.Filters;
using Elmah;
using HermesOnline.Core;
using HermesOnline.Service;
using HermesOnline.Web.Spa.Helpers;

public class ElmahErrorAttribute : ExceptionFilterAttribute
{
    public override void OnException(HttpActionExecutedContext actionExecutedContext)
    {
        var requestScope = actionExecutedContext.Request.GetDependencyScope();

        var tenant = requestScope.GetService(typeof(Tenant)) as Tenant;
        var userManager = requestScope.GetService(typeof(IUserManager)) as IUserManager;

        if (tenant != null && actionExecutedContext.Exception != null)
        {            
            var userId = IdentityHelper.GetUserId(actionExecutedContext.ActionContext.RequestContext);
            var errorLog = new SqlErrorLog(tenant.DatabaseConnectionString);
            var error = new Error(actionExecutedContext.Exception);
            error.User = userId.HasValue ? userManager.FindByIdAsync(userId.Value).Result.FullName : "N/A";
            errorLog.Log(error);
        }

        base.OnException(actionExecutedContext);
    }
}