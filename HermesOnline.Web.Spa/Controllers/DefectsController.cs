using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Aether.Utils.ScreenCapture;
using AutoMapper;
using HermesOnline.Core;
using HermesOnline.Core.Extensions;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Domain;
using HermesOnline.Domain.Identity;
using Defect = HermesOnline.Domain.Defect;
using HermesOnline.Service.Dto;
using HermesOnline.Service.Interfaces;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Dtos.Annotations;
using HermesOnline.Web.Spa.Dtos.Findings;
using HermesOnline.Web.Spa.Dtos.QuickFilters.Findings;
using HermesOnline.Web.Spa.Filters;
using System.IO;
using HermesOnline.Web.Spa.Dtos.Breadcrumb;
using HermesOnline.Web.Spa.Dtos.Common;
using HermesOnline.Web.Spa.Helpers;
using HermesOnline.Service.Model;

namespace HermesOnline.Web.Spa.Controllers
{
    [RoutePrefix("Api/Defects")]
    public class DefectsController : ApiController
    {
        private readonly IDefectApiService _defectService;
        private readonly IDefectChangeLogService _defectChangeLogService;
        private readonly IMapper _mapper;
        private readonly IImageApiService _imageService;
        private readonly IFilterService _filterService;
        private readonly IImportDefectService _importDefectService;
        private readonly IFileUploadApiService _fileUploadService;
        private readonly ICustomFilterService _customFilterService;

        public DefectsController(
            IDefectApiService defectService,
            IMapper mapper,
            IImageApiService imageService,
            IFilterService filterService,
            IImportDefectService importDefectService,
            IFileUploadApiService fileUploadService,
            ICustomFilterService customFilterService,
            IDefectChangeLogService defectChangeLogService)

        {
            _defectService = defectService;
            _mapper = mapper;
            _imageService = imageService;
            _filterService = filterService;
            _importDefectService = importDefectService;
            _fileUploadService = fileUploadService;
            _defectChangeLogService = defectChangeLogService;
            _customFilterService = customFilterService;
        }

        [HttpPost]
        [Route("")]
        [AuthorizationUser(Permission.ManagerViewNavigation)]
        public FindingsTableDto<FindingsTableRowDto> GetDefects(FindingsDataTableFilterModelDto findingsDataTableFilter)
        {
            FindingsQuery findingsQuery = _mapper.Map<FindingsQuery>(findingsDataTableFilter);
            if (findingsDataTableFilter.CustomFilterId != Guid.Empty)
            {
                findingsQuery.CustomFilterValues =
                    _customFilterService.GetById(findingsDataTableFilter.CustomFilterId).Values;
            }
            IPagedList<DefectRowDto> findings = _defectService.GetDefectsForNodePaged(findingsQuery.Type, findingsQuery.Id, findingsQuery);
            List<FindingsTableRowDto> findingsTableRowDtos = _mapper.Map<IEnumerable<DefectRowDto>, IEnumerable<FindingsTableRowDto>>(findings).ToList();

            return new FindingsTableDto<FindingsTableRowDto>
            {
                FindingsTableRows = findingsTableRowDtos,
                TotalRecords = findings.TotalCount
            };
        }

        [HttpPost]
        [Route("DeepZoomLink")]
        [AuthorizationUser(Permission.ManagerViewNavigation)]
        public FindingsTableDto<FindingsForDeepZoomLinkTableRowDto> GetDefectsForDeepZoomLink(FindingsForDeepZoomLinkDataTableFilterModelDto findingsDataTableFilter)
        {
            var findingsQuery = _mapper.Map<FindingsQuery>(findingsDataTableFilter);
            var findings = _defectService.GetDefectsForBladePaged(findingsDataTableFilter.Id, findingsDataTableFilter.Surface, findingsDataTableFilter.InspectionId, findingsQuery);
            var findingsTableRowDtos = _mapper.Map<IEnumerable<DefectRowDto>, IEnumerable<FindingsForDeepZoomLinkTableRowDto>>(findings).ToList();

            return new FindingsTableDto<FindingsForDeepZoomLinkTableRowDto>
            {
                FindingsTableRows = findingsTableRowDtos,
                TotalRecords = findings.TotalCount
            };
        }

        [HttpPost]
        [Route("GetDefectIds")]
        [AuthorizationUser(Permission.ManagerViewNavigation)]
        public IEnumerable<Guid> GetDefectIds(FindingsDataTableFilterModelDto findingsDataTableFilter)
        {
            FindingsQuery findingsQuery = _mapper.Map<FindingsQuery>(findingsDataTableFilter);
            return _defectService.GetDefectsIds(findingsQuery.Type, findingsQuery.Id, findingsQuery);
        }

        [Route("QuickFilter")]
        [HttpPost]
        [AuthorizationUser(Permission.ManagerViewNavigation)]
        public FindingsDataTableQuickFilterListDto GetQuickFilters(FindingsDataTableFilterModelDto filter)
        {
            FindingsQuery filterCriteria = _mapper.Map<FindingsQuery>(filter);
            filterCriteria.CustomFilterValues = filter.CustomFilterId == Guid.Empty ? string.Empty : _customFilterService.GetById(filter.CustomFilterId).Values;
            return _mapper.Map<FindingsDataTableQuickFilterListDto>(_filterService.GetFindingsDataTableQuickFilters(filter.Id, filter.Type, filterCriteria.Filter));
        }

        [Route("{defectId?}")]
        [HttpGet]
        [AuthorizationUser(Permission.ManagerViewNavigation)]
        public DefectDto GetDefect(Guid defectId)
        {
            return _mapper.Map<DefectDto>(_defectService.FindById(defectId));
        }

        [Route("Count/{nodeType}/{id}")]
        [HttpGet]
        [AuthorizationUser(Permission.ManagerViewNavigation)]
        public long GetNumOfDefect(NodeType nodeType, Guid id)
        {
            return _defectService.GetCountForNode(nodeType, id).Result;
        }

        [Route("Annotations/{defectId?}")]
        [HttpGet]
        [AuthorizationUser(Permission.ManagerViewNavigation)]
        public DefectAnnotationsDto GetAnnotations(Guid defectId)
        {
            DefectAnnotationsDto result = new DefectAnnotationsDto
            {
                Images = _mapper.Map<IEnumerable<ImageDto>>(_defectService.GetImagesByDefectId(defectId)),
                AnnotationData = _mapper.Map<AnnotationsDto>(_defectService.FindById(defectId))
            };

            return result;
        }

        [HttpPost]
        [Route("ChangeDataQualityForSelectedFinding")]
        [AuthorizationUser(Permission.ValidateDataQuality)]
        public List<DefectChangedQuality> ChangeDataQualityForSelectedFinding(List<Guid> selectedFindingIds)
        {
            return _mapper.Map<List<DefectChangedQuality>>(_defectService.ChangeDataQualityForSelectedFinding(selectedFindingIds));
        }

        [HttpGet]
        [Route("changeDataQualityForFindingsOfTheInspection/{defectId?}")]
        [AuthorizationUser(Permission.ValidateDataQuality)]
        public List<DefectChangedQuality> ChangeDataQualityForFindingsOfTheInspection(Guid defectId)
        {
            return _mapper.Map<List<DefectChangedQuality>>(_defectService.ChangeDataQualityForInspection(defectId));
        }

        [Route("Thumbnailresized/{imageId?}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<HttpResponseMessage> ThumbnailResized(Guid imageId)
        {
            FileResponse image = await _imageService.GetDownsizedThumbnail(imageId);

            if (image == null)
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }

            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StreamContent(image.File)
            };

            return response;
        }

        [Route("ImagePreview/{imageId}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<HttpResponseMessage> GetImage(Guid imageId)
        {
            FileResponse image = await _imageService.GetImageFile(imageId);

            if (image == null)
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }

            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StreamContent(image.File)
            };

            return response;
        }

        [HttpGet]
        [Route("Breadcrumb/{findingId}")]
        [AuthorizationUser(Permission.ManagerViewNavigation)]
        public BreadcrumbInfoDto GetBreadcrumb(Guid findingId)
        {
            var finding = _defectService.FindById(findingId);

            var breadcrumbInfoDto = new BreadcrumbInfoDto
            {
                Surface = finding.Surface.ToString(),
                Blade = finding.Sequence.Blade.SerialNumber,
                Turbine = finding.Sequence.Blade.Turbine.Name,
                Site = finding.Sequence.Blade.Turbine.Site.Name,
                Country = finding.Sequence.Blade.Turbine.Site.Country.Name,
                Region = finding.Sequence.Blade.Turbine.Site.Country.Region.Name,
                Finding = finding.SerialNumber
            };
            return breadcrumbInfoDto;
        }

        [HttpGet]
        [Route("getDefectCategory")]
        [AuthorizationUser(Permission.ManagerViewNavigation)]
        public IEnumerable<IdText> GetDefectCategory()
        {
            List<IdText> result = new List<IdText>();
            foreach (Domain.Defects.DefectType Type in Enum.GetValues(typeof(Domain.Defects.DefectType)))
            {
                var type = new IdText
                {
                    Id = ((int)Type).ToString(),
                    Text = Type.GetDescription(),
                };
                result.Add(type);
            }
            return result;
        }

        [HttpGet]
        [Route("getLayer/{category}")]
        [AuthorizationUser(Permission.ManagerViewNavigation)]
        public IEnumerable<IdText> GetLayer(int category)
        {
            List<IdText> result = new List<IdText>();
            List<DefectTypeLayerSeverity> relations = _defectService.GetAllRelations().Where(x => (int)x.Type == category).ToList();

            foreach (DefectTypeLayerSeverity defectTypeLayerSeverity in relations)
            {
                var layer = new IdText
                {
                    Id = ((int)defectTypeLayerSeverity.Layer).ToString(),
                    Text = defectTypeLayerSeverity.Layer.GetDescription(),
                };
                result.Add(layer);
            }
            return result;
        }

        [HttpGet]
        [Route("getSeverity/{layer}/{category}")]
        [AuthorizationUser(Permission.ManagerViewNavigation)]
        public IEnumerable<string> GetSeverity(int layer, int category)
        {
            List<string> result = new List<string>();
            List<DefectTypeLayerSeverity> relations = _defectService.GetAllRelations().Where(x => (int)x.Layer == layer && (int)x.Type == category).ToList();

            foreach (DefectTypeLayerSeverity defectTypeLayerSeverity in relations)
            {
                result.Add(((int)defectTypeLayerSeverity.Severity).ToString());
            }
            return result;
        }

        [Route("editFinding")]
        [HttpPost]
        [AuthorizationUser(Permission.EditFinding)]
        public HttpResponseMessage EditFinding(DefectChangeLog finding)
        {
            Defect defect = _defectService.FindById(finding.Id);
            List<Guid> defectIds = new List<Guid>();
            defectIds.Add(defect.Id);
            if (defect != null)
            {

                defect.Severity = finding.NewSeverity.HasValue ? finding.NewSeverity : finding.OriginalSeverity;
                defect.Name = finding.NewType.HasValue ? finding.NewType.GetDescription() : finding.OriginalType.GetDescription();
                defect.Layer = finding.NewLayer.HasValue ? finding.NewLayer.Value : finding.OriginalLayer;

                var result = _defectService.Update(defect);
                _defectService.ChangeDataQualityForSelectedFinding(defectIds);

                if (result.Succeeded)
                {
                    finding.DefectId = defect.Id;
                    finding.NewLayer = finding.NewLayer.HasValue ? finding.NewLayer : null;
                    finding.NewSeverity = finding.NewSeverity.HasValue ? finding.NewSeverity : null;
                    finding.NewType = finding.NewType.HasValue ? finding.NewType : null;

                    var url = LocalUrlHelper.GenerateUrlEditedFinding(defect);
                    if (_defectChangeLogService.AddDefectChangeLog(finding).Succeeded)
                    {
                        _defectChangeLogService.Notify(finding, url);
                    }
                }

                return result.Succeeded
                    ? Request.CreateResponse(HttpStatusCode.OK)
                    : Request.CreateErrorResponse(HttpStatusCode.BadRequest, result.Message);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, "Cannot find finding");
        }

        [HttpPost]
        [Route("Delete/{id}")]
        [AuthorizationUser(Permission.DeleteFinding)]
        public ServiceResult DeleteFinding(Guid id)
        {
            var result = _defectService.DeleteDefect(id);

            if (result.Succeeded)
            {
                _defectService.GenerateDefectChangeLog(id);
            }
            return result;
        }

        [Route("UploadChunk/{totalParts}/{partCount}")]
        [HttpPost]
        [AuthorizationUser(Permission.ImportFindings)]
        public async Task<bool> UploadChunk(int totalParts, int partCount)
        {
            HttpRequest httpRequest = HttpContext.Current.Request;

            if (httpRequest.Files.Count == 0 || httpRequest.Files[0] == null || httpRequest.Files[0].ContentLength == 0)
            {
                throw new Exception("File is not defined");
            }

            var file = httpRequest.Files[0];
            var fileName = Path.GetFileName(file.FileName);
            var chunkStream = file.InputStream;
            return await _fileUploadService.UploadChunk(fileName, chunkStream, totalParts, partCount);
        }

        [HttpPost]
        [Route("Import")]
        [AuthorizationUser(Permission.ImportFindings)]
        public async Task<HttpResponseMessage> Import(TextDto fileName)
        {
            var fileStream = _fileUploadService.GetFile(fileName.Text);
            var result = await _importDefectService.ImportDefectsAsync(fileStream);
            await _fileUploadService.DeleteFileAsync(fileName.Text);

            return result.Succeeded
                ? Request.CreateResponse(HttpStatusCode.OK, $"Number of imported findings for turbine {result.ResultObject}")
                : Request.CreateErrorResponse(HttpStatusCode.BadRequest, result.Message);
        }


        [Route("GetFinding/{findingId}")]
        [HttpGet]
        public FindingsTableRowDto GetFinding(Guid findingId)
        {
            Defect defect = _defectService.FindById(findingId);

            return _mapper.Map<FindingsTableRowDto>(defect);
        }
    }
}
