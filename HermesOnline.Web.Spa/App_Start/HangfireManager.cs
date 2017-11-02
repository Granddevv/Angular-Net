using System;
using System.Configuration;
using System.Reflection;
using System.Web.Hosting;
using Hangfire;
using Hangfire.SqlServer;
using HermesOnline.Web.Framework.DI;
using System.Web.Http;
using HermesOnline.Service.Identity.Interfaces;
using HermesOnline.Web.Framework.Jobs;

namespace HermesOnline.Web.Spa
{
    public class HangfireManager : IRegisteredObject
    {
        public static readonly HangfireManager Instance = new HangfireManager();

        private readonly object _lockObject = new object();
        private bool _started;

        private BackgroundJobServer _backgroundJobServer;

        private HangfireManager()
        {}

        public void Start()
        {
            lock (_lockObject)
            {
                if (_started)
                {
                    return;
                }
                _started = true;

                HostingEnvironment.RegisterObject(this);

                var connectionString = ConfigurationManager.ConnectionStrings["license"].ConnectionString;
                Hangfire.GlobalConfiguration.Configuration.UseAutofacActivator(
                    DependencyResolverInitializer.ResolveHangfireDependencies(Assembly.GetExecutingAssembly(), connectionString));

                Hangfire.GlobalConfiguration.Configuration.UseSqlServerStorage("hangfire",
                    new SqlServerStorageOptions { QueuePollInterval = TimeSpan.FromSeconds(1) });                

                var options = new BackgroundJobServerOptions
                {
                    Queues = new[] { "critical", "default" },
                    WorkerCount = 1
                };

                _backgroundJobServer = new BackgroundJobServer(options);
            }
        }

        public void SetupBackgroundJobs(HttpConfiguration config)
        {
            var identityServiceFactory =
                (IIdentityServiceFactory)config.DependencyResolver.GetService(typeof(IIdentityServiceFactory));

            var identityManager = identityServiceFactory.CreateServiceManager();

            var companies = identityManager.CachingCompanyService.GetAll();

            const string jobPrefix = "DefectUploaderJob_";

            foreach (var tenant in companies)
            {
                RecurringJob.RemoveIfExists(jobPrefix + tenant.Name);

                RecurringJob.AddOrUpdate<DefectUploaderJob>(jobPrefix + tenant.Name, a => a.Start(tenant.Name), "*/7 * * * *");

                RecurringJob.Trigger(jobPrefix + tenant.Name);
            }
        }

        public void Stop()
        {
            lock (_lockObject)
            {
                _backgroundJobServer?.Dispose();

                HostingEnvironment.UnregisterObject(this);
            }
        }

        void IRegisteredObject.Stop(bool immediate)
        {
            Stop();
        }
    }
}