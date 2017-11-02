using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using HermesOnline.Core;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Domain;
using HermesOnline.Domain.Identity;
using HermesOnline.Service.Common;
using HermesOnline.Service.Dto;
using HermesOnline.Service.Interfaces;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Dtos;
using HermesOnline.Web.Spa.Dtos.Findings;
using HermesOnline.Web.Spa.Dtos.QuickFilters.Findings;
using HermesOnline.Web.Spa.Filters;
using HermesOnline.Service.Model;

namespace HermesOnline.Web.Spa.Controllers
{
    [Authorize]
    [RoutePrefix("Api/DefectGroupActions")]
    [AuthorizationUser(Permission.LinkFinding)]
    public class DefectGroupActionsController : BaseController
    {
        private readonly IDefectApiService _defectService;
        private readonly IMapper _mapper;
        private readonly IFilterService _filterService;

        public DefectGroupActionsController(
            IDefectApiService defectService,
            IMapper mapper,
            IFilterService filterService)

        {
            _defectService = defectService;
            _mapper = mapper;
            _filterService = filterService;
        }

        [HttpPost]
        [Route("")]
        public FindingsTableDto<FindingsTableRowDto> GetDefectsForGroupAction(FindingsActionsDataTableFilterModelDto findingsDataTableFilter)
        {
            Defect defect = _defectService.FindById(findingsDataTableFilter.Id);
            FindingsActionsQuery findingsQuery = _mapper.Map<FindingsActionsQuery>(findingsDataTableFilter);
            findingsQuery.RootDefect = defect;

            IPagedList<DefectRowDto> findings = _defectService.GetDefectsForNodePaged(NodeType.Blade, defect.Sequence.BladeId, findingsQuery);
            List<FindingsTableRowDto> findingsTableRowDtos = _mapper.Map<IEnumerable<DefectRowDto>, IEnumerable<FindingsTableRowDto>>(findings).ToList();

            return new FindingsTableDto<FindingsTableRowDto>
            {
                FindingsTableRows = findingsTableRowDtos,
                TotalRecords = findings.TotalCount
            };
        }

        [Route("QuickFilter")]
        [HttpPost]
        public FindingsDataTableQuickFilterListDto GetQuickFiltersForActino(FindingsActionsDataTableFilterModelDto filter)
        {
            Defect defect = _defectService.FindById(filter.Id);
            FindingsActionsQuery findingsQuery = _mapper.Map<FindingsActionsQuery>(filter);
            findingsQuery.RootDefect = defect;

            return _mapper.Map<FindingsDataTableQuickFilterListDto>(
                _filterService.GetFindingsDataTableQuickFilters(defect.Sequence.BladeId, NodeType.Blade, findingsQuery.Filter));
        }

        [Route("Link/{defectId?}/{defectToGroupIds?}/{defectGroupType?}")]
        [HttpGet]
        public IHttpActionResult Link(Guid defectId,Guid defectToGroupIds, DefectGroupType defectGroupType)
        {
            ServiceResult result = _defectService.GroupDefects(defectId, new List<Guid> { defectToGroupIds}, defectGroupType);
            return CreateHttpActionResult(result);
        }
    }
}
