using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using HermesOnline.Core;
using HermesOnline.Service.Interfaces;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Dtos.ChangeLog;
using HermesOnline.Domain;
using HermesOnline.Data.Interface.Query.Model;
using HermesOnline.Web.Spa.Dtos.QuickFilters;
using System.Net.Http;
using System;
using Aether.Utils.ScreenCapture;
using Defect = HermesOnline.Domain.Defect;
using HermesOnline.Domain.Defects;
using System.Net;

namespace HermesOnline.Web.Spa.Controllers
{
    [RoutePrefix("Api/DefectChangeLog")]
    public class DefectChangeLogController : BaseController
    {
        private readonly IDefectChangeLogService _defectChangeLogService;
        private readonly IMapper _mapper;
        private readonly IFilterService _filterService;
        private readonly IDefectApiService _defectService;

        public DefectChangeLogController(IDefectChangeLogService defectChangeLogService, IMapper mapper, IFilterService filterService, IDefectApiService defectService)
        {
            _defectChangeLogService = defectChangeLogService;
            _mapper = mapper;
            _filterService = filterService;
            _defectService = defectService;
        }

        [Route("")]
        [HttpPost]
        public DefectChangeLogsTableDto GetAll(DefectChangeLogsTableFilterModelDto defecetChangeLogsTableFilter)
        {
            DefectChangeLogQuery defectChangeLogQuery = _mapper.Map<DefectChangeLogQuery>(defecetChangeLogsTableFilter);

            IPagedList<DefectChangeLog> defectChangeLog = _defectChangeLogService.GetDefectChangeLogs(defectChangeLogQuery);

            var groupedDefects = defectChangeLog.GroupBy(def => def.DefectId)
                .Select(deg => deg.OrderBy(def => def.DateModified).LastOrDefault());

            List<DefectChangeLogsTableRowDto> defectChangeLogsTableRowDtos =
                _mapper.Map<IEnumerable<DefectChangeLog>, IEnumerable<DefectChangeLogsTableRowDto>>(groupedDefects).ToList();

            return new DefectChangeLogsTableDto
            {
                DefectChangeLogsTableRows = defectChangeLogsTableRowDtos,
                TotalDisplayedRecords = groupedDefects.Count(),
                TotalRecords = groupedDefects.Count()
            };
        }

        [Route("QuickFilter")]
        [HttpPost]
        public DefectChangeLogsDataTableQuickFilterListDto GetQuickFilters(DefectChangeLogQuickFilterModel quickFilter)
        {
            var filterCriteria = _mapper.Map<DefectChangeLogQuery>(
                           new DefectChangeLogsTableFilterModelDto
                           {
                               QuickFilters = quickFilter
                           });

            return _mapper.Map<DefectChangeLogsDataTableQuickFilterListDto>(_filterService.GetDefectChangeLogDataTableQuickFilters(filterCriteria.Filter));
        }

        [Route("CancelFinding")]
        [HttpPost]
        public HttpResponseMessage CancelFinding(DefectChangeLogsTableRowDto defectChangeLog)
        {
            Defect defect = _defectService.FindById(new Guid(defectChangeLog.DefectId));

            if (defect != null)
            {
                if(defect.IsDeleted  == true)
                {
                    defect.IsDeleted = false;
                }

                else
                { 
                defect.Severity = (Severity)Int32.Parse(defectChangeLog.OriginalSeverity);
                defect.Name = defectChangeLog.OriginalType;
                defect.Layer = (DefectLayer)Enum.Parse(typeof(DefectLayer), defectChangeLog.OriginalLayer, true);
                }

                var result = _defectService.Update(defect);

                return result.Succeeded
                               ? Request.CreateResponse(HttpStatusCode.OK)
                               : Request.CreateErrorResponse(HttpStatusCode.BadRequest, result.Message);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, "Cannot find finding");
        }
    }
}
