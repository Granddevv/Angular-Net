using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using AutoMapper;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Domain;
using HermesOnline.Service.Interfaces;
using HermesOnline.Web.Spa.Dtos;
using HermesOnline.Service.Common;
using HermesOnline.Service.Common.Interfaces;
using System.Web;
using HermesOnline.Domain.Identity;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Filters;
using HermesOnline.Service.Model;

namespace HermesOnline.Web.Spa.Controllers
{
    [Authorize]
    [RoutePrefix("Api/Report")]
    [AuthorizationUser(Permission.ManagerViewNavigation)]
    public class ReportController : BaseController
    {
        private readonly IReportService _reportService;
        private readonly INodeService _nodeService;
        private readonly IFileService _fileService;
        private readonly IMapper _mapper;

        public ReportController(IReportService reportService,
            INodeService nodeService,
            IFileService fileService,
            IMapper mapper)
        {
            _reportService = reportService;
            _nodeService = nodeService;
            _fileService = fileService;
            _mapper = mapper;
        }

        [HttpPost]
        [Route("")]
        public ReportTableDto GetReports(ReportDataTableFilterModelDto reportDataTableFilter)
        {
            var filterCriteria = _mapper.Map<ReportQuery>(reportDataTableFilter);

            var reports = _reportService.GetReportsForNode(reportDataTableFilter.Id, filterCriteria);

            List<ReportTableRowDto> reportRows = _mapper.Map<List<ReportTableRowDto>>(reports).ToList();
            foreach (ReportTableRowDto row in reportRows)
            {
                if (reportDataTableFilter.Type == NodeType.Site)
                {
                    row.SiteName = _nodeService.GetNode(reportDataTableFilter.Id, NodeType.Site).Name;
                }
                if (reportDataTableFilter.Type == NodeType.Blade)
                {
                    row.BladeName = _nodeService.GetNode(reportDataTableFilter.Id, NodeType.Blade).Name;
                }
                if (reportDataTableFilter.Type == NodeType.Turbine)
                {
                    row.TurbineName = _nodeService.GetNode(reportDataTableFilter.Id, NodeType.Turbine).Name;
                }
            }
            return new ReportTableDto()
            {
                ReportTableRows = reportRows,
                TotalDisplayedRecords = reports.TotalCount,
                TotalRecords = reports.TotalCount
            };
        }

        [HttpGet]
        [Route("Count/{id}")]
        public long GetNumOfReport(Guid id)
        {
            return _reportService.GetCountForNodeAll(id).Result;
        }

        [HttpDelete]
        [Route("DeleteReport/{id}")]
        [AuthorizationUser(Permission.DeleteReport)]
        public HttpResponseMessage DeleteReport(Guid id)
        {
            ServiceResult result = _reportService.Delete(id);
            return Request.CreateResponse(result.Succeeded ? HttpStatusCode.OK : HttpStatusCode.BadRequest);
        }

        [Route("Download/{id?}")]
        [HttpGet]
        [AuthorizationUser(Permission.DownloadReport)]
        public async Task<HttpResponseMessage> DownloadAttachment(Guid id)
        {
            Report report = _reportService.FindById(id);
            if (report == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Cannot find a file.");
            }

            FileResponse result = await _reportService.GetFile(report);
            if (result == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Cannot find a file.");
            }

            result.Name = report.Filename;
            return CreateDownloadHttpResponse(result);
        }

        [Route("Create")]
        [HttpPost]
        [AuthorizationUser(Permission.AttachReport)]
        public async Task<IHttpActionResult> Create()
        {
            HttpRequest httpRequest = HttpContext.Current.Request;
            string fileName = httpRequest.Params["fileName"];
            string nodeId = httpRequest.Params["nodeId"];

            ServiceResult result = 
                await _reportService.AddReportsAsync(
                new Guid(nodeId), fileName, httpRequest.Files[0].InputStream, CurrentUserId.Value);

            result.ResultObject = null;

            return CreateHttpActionResult(result);
        }
    }
}
