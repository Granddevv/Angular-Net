using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using HermesOnline.Service.Interfaces;
using System.Net.Http;
using System.Web;
using System.Threading.Tasks;
using HermesOnline.Web.Spa.Helpers;
using HermesOnline.Domain;
using HermesOnline.Domain.Identity;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Filters;
using HermesOnline.Web.Spa.Dtos.UserManagement;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Web.Spa.Dtos.Reports;
using HermesOnline.Web.Spa.Dtos.ChangeLog;

namespace HermesOnline.Web.Spa.Controllers
{
    [Authorize]
    [RoutePrefix("Api/ReportGenerator")]
    public class ReportGeneratorController : BaseController
    {
        private readonly IReportGeneratorManagerApiService _reportGeneratorManagerService;
        private readonly IDefectApiService _defectService;
        private readonly IDeepZoomLinkService _deepZoomLinkService;
        private readonly IBladeService _bladeService;
        private readonly IMapper _mapper;

        public ReportGeneratorController(
            IReportGeneratorManagerApiService reportGeneratorManagerService,
            IDefectApiService defectService,
            IDeepZoomLinkService deepZoomLinkService,
            IMapper mapper,
            IBladeService bladeService)
        {
            _defectService = defectService;
            _deepZoomLinkService = deepZoomLinkService;
            _mapper = mapper;
            _bladeService = bladeService;
            _reportGeneratorManagerService = reportGeneratorManagerService;            
        }

        [HttpGet]
        [Route("ReportGenerationStart")]
        [AuthorizationUser(Permission.GenerateReport)]
        public string ReportGenerationStart()
        {
            var newTaskId = _reportGeneratorManagerService.CreateTask();
            return newTaskId.ToString();
        }

        [HttpGet]
        [Route("ReportGenerationCancel/{taskId}")]
        [AuthorizationUser(Permission.GenerateReport)]
        public void ReportGenerationCancel(Guid taskId)
        {
            _reportGeneratorManagerService.CancelTask(taskId);
        }

        [HttpGet]
        [Route("ReportGenerationProgress/{taskId}")]
        [AuthorizationUser(Permission.GenerateReport)]
        public IHttpActionResult GetReportGenerationProgress(Guid taskId)
        {
            var reportTask = _reportGeneratorManagerService.GetTask(taskId);
            return Ok(reportTask);
        }

        [HttpGet]
        [Route("GetReportFile/{fileName}")]
        [AllowAnonymous]
        public HttpResponseMessage GetReportFile(string fileName)
        {
            var reportData = _reportGeneratorManagerService.GetReportFilePathAndName(fileName);
            return CreateDownloadHttpResponse(reportData.Item1, reportData.Item2);
        }

        [HttpGet]
        [Route("BladeHealthReport/{nodeId}/{nodeType}/{taskId}")]
        [AuthorizationUser(Permission.GenerateReport)]
        public async Task GetBladeHealthReport(Guid nodeId, NodeType nodeType, Guid taskId)
        {
            if (nodeType != NodeType.Site && nodeType != NodeType.Turbine && nodeType != NodeType.Blade)
            {
                throw new NotSupportedException($@"Node type {nodeType} is not supported for report generation.");
            }

            if (nodeType == NodeType.Blade)
            {
                var blade = _bladeService.GetBlade(nodeId);
                if (blade != null)
                {
                    nodeId = blade.TurbineId;
                    nodeType = NodeType.Turbine;
                }
                else
                {
                    throw new Exception($@"There is no report for the selected tree nodeId: {nodeId} and nodeType: {nodeType}!");
                }
            }

            var defects = _defectService.GetDefectsForNodeLastInspection(nodeId, nodeType);

            if (!defects.Any())
            {
                throw new Exception($@"There is no report for the selected tree nodeId: {nodeId} and nodeType: {nodeType}!");
            }

            string bladeMapImagePath = HttpContext.Current.Server.MapPath("~/App_Data/blade_outline.png");
            string reportTemplate = HttpContext.Current.Server.MapPath("~/App_Data/SiemensBladeHealthReport.docx");

            await _reportGeneratorManagerService.GenerateBladeHealthReport(
                    defects.ToList(),
                    bladeMapImagePath,
                    reportTemplate,
                    taskId,
                    nodeType,
                    nodeId);
        }

        [HttpPost]
        [Route("RepairReport/{taskId}/{nodeType}/{nodeId}")]
        [AuthorizationUser(Permission.GenerateReport)]
        public async Task GetRepairReport(List<Guid> selectedFindingIds, Guid taskId, NodeType nodeType, Guid nodeId)
        {
            var findings = new List<Defect>();
            foreach (var findingId in selectedFindingIds)
            {
                var finding = _defectService.FindById(findingId);
                findings.Add(finding);
            }

            if (!findings.Any())
            {
                throw new Exception($@"There is no report for the selected findings!");
            }

            string bladeMapImagePath = HttpContext.Current.Server.MapPath("~/App_Data/blade_outline_abc.png");
            string bladeMapImageHorizontalPath = HttpContext.Current.Server.MapPath("~/App_Data/blade_outline_horizontal.png");
            string reportTemplate = HttpContext.Current.Server.MapPath("~/App_Data/RepairReport.docx");


            await _reportGeneratorManagerService.GenerateRepairReport(
                    findings.ToList(),
                    bladeMapImagePath,
                    bladeMapImageHorizontalPath,
                    reportTemplate,
                    taskId,
                    nodeType,
                    nodeId);
        }

        [HttpPost]
        [Route("DataExtractReport")]
        [AuthorizationUser(Permission.GenerateReport)]
        public async Task GetDataExtractReport(GetDataExtractReportDto extractReportDto)
        {
            var query = _mapper.Map<FindingsQuery>(extractReportDto);

            var defects = _defectService.GetDefectsForNode(extractReportDto.NodeId, extractReportDto.NodeType, query);

            var groupedDefects =
                defects.GroupBy(def => def.DefectGroupItem?.DefectGroupId ?? Guid.NewGuid())
                .SelectMany(deg => deg.OrderBy(def => def.Order).Take(1)).ToList();

            var imageLinks = new Dictionary<string, string>();
            var deepZoomLinks = new Dictionary<string, string>();

            var excelTemplate = HttpContext.Current.Server.MapPath("~/App_Data/DataExtractReportTemplate.xltx");
            await _reportGeneratorManagerService.GenerateDataExtractReport(
                extractReportDto.GenerateImages,
                groupedDefects,
                excelTemplate,
                extractReportDto.TaskId,
                LocalUrlHelper.GetDefectImageOverviewLink,
                LocalUrlHelper.GetDefectDeepZoomLink);

        }

        [HttpGet]
        [Route("InspectionYearsForComparisonReport/{nodeId}/{nodeType}")]
        [AuthorizationUser(Permission.GenerateReport)]
        public IEnumerable<int> GetInspectionYearsForComparisonReport(Guid nodeId, NodeType nodeType)
        {
            var years = _reportGeneratorManagerService.GetAvailableYearsForComparisonReport(nodeId, nodeType);
            return years;
        }

        [HttpGet]
        [Route("ComparisonReport/{nodeId}/{nodeType}/{yearFrom}/{yearTo}/{taskId}")]
        [AuthorizationUser(Permission.GenerateReport)]
        public void GetComparisonReport(Guid nodeId, NodeType nodeType, int yearFrom, int yearTo, Guid taskId)
        {
            _reportGeneratorManagerService.GenerateComparisonReport(nodeId, nodeType, yearFrom, yearTo, taskId);            
        }

        [HttpPost]
        [Route("UserListReport/{taskId}")]
        [AuthorizationUser(Permission.GenerateReport)]
        public void GetUserListReport(UserManagementTableFilterModelDto filter, Guid taskId)
        {
            if (!CurrentUserId.HasValue)
            {
                throw new Exception("User is not logged in.");
            }

            UserQuery userQuery = _mapper.Map<UserQuery>(filter);

            var excelTemplate = HttpContext.Current.Server.MapPath("~/App_Data/UserListReportTemplate.xltx");
            _reportGeneratorManagerService.GenerateUserListReport(excelTemplate, userQuery, CurrentUserId.Value, taskId);
        }
        
        [HttpPost]
        [Route("FindingListReport/{taskId}")]
        [AuthorizationUser(Permission.GenerateReport)]
        public void GenerateFindingChangeLogReport(DefectChangeLogsTableFilterModelDto filter, Guid taskId)
        {

            DefectChangeLogQuery defectChangeLogQuery = _mapper.Map<DefectChangeLogQuery>(filter);

            var excelTemplate = HttpContext.Current.Server.MapPath("~/App_Data/DefectChangeLogsListReportTemplate.xltx");
            _reportGeneratorManagerService.GenerateFindingChangeLogReport(excelTemplate, defectChangeLogQuery, taskId);
        }
    }
}
