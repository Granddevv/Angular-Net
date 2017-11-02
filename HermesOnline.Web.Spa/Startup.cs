using System;
using System.Configuration;
using System.Net.Http;
using System.Web.Http;
using HermesOnline.Web.Framework.DI;
using HermesOnline.Web.Spa;
using HermesOnline.Web.Spa.Filters;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Owin;
using Swashbuckle.Application;
using Hangfire;

[assembly: OwinStartup(typeof(Startup))]
namespace HermesOnline.Web.Spa
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var config = new HttpConfiguration();

            config.EnableSwagger("docs/{apiVersion}", c =>
            {
                c.RootUrl(req => req.RequestUri.GetLeftPart(UriPartial.Authority) + req.GetRequestContext().VirtualPathRoot.TrimEnd('/'));
                c.SingleApiVersion("v1", "Hermes Online API");
                c.OperationFilter<AuthorizationHeaderParameterOperationFilter>();
            }).EnableSwaggerUi();
            
            var connectionString = ConfigurationManager.ConnectionStrings["license"].ConnectionString;
            DependencyResolverInitializer.ResolveWebApiSpaDependencies(GetType().Assembly, config, app, connectionString);            

            ConfigureOAuth(app);

            WebApiConfig.Register(config);            
            app.UseCors(CorsOptions.AllowAll);
            app.UseWebApi(config);
                                    
            HangfireManager.Instance.Start();
            app.UseHangfireServer();
            HangfireManager.Instance.SetupBackgroundJobs(config);           
        }
    }
}