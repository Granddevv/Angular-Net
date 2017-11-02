using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Http;
using System.Xml.Linq;
using AutoMapper;
using HermesOnline.Core;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Data.Interface.Query.Model;
using HermesOnline.Domain;
using HermesOnline.Domain.Identity;
using HermesOnline.Service.Common.Interfaces;
using HermesOnline.Service.Dto;
using HermesOnline.Service.Interfaces;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Dtos;
using HermesOnline.Web.Spa.Dtos.Annotations;
using HermesOnline.Web.Spa.Dtos.DeepZoomLink;
using HermesOnline.Web.Spa.Dtos.QuickFilters.DeepZoomLink;
using HermesOnline.Web.Spa.Filters;
using HermesOnline.Web.Spa.Helpers;
using HermesOnline.Service.Common;
using HermesOnline.Web.Spa.Dtos.Breadcrumb;

namespace HermesOnline.Web.Spa.Controllers
{
    [Authorize]
    [RoutePrefix("Api/DeepZoomLink")]
    public class DeepZoomLinkController : BaseController
    {
        private readonly IDeepZoomLinkService _deepZoomLinkService;
        private readonly IFilterService _filterService;
        private readonly IMapper _mapper;
        private readonly IDeepZoomFileService _deepZoomFileService;
        private readonly IDefectApiService _defectService;
        private readonly IImageApiService _imageApiService;

        public DeepZoomLinkController(IDeepZoomLinkService deepZoomLinkService,
            IFilterService filterService,
            IDeepZoomFileService deepZoomFileService,
            IMapper mapper, 
            IDefectApiService defectService, IImageApiService imageApiService)
        {
            _deepZoomLinkService = deepZoomLinkService;
            _filterService = filterService;
            _deepZoomFileService = deepZoomFileService;
            _defectService = defectService;
            _imageApiService = imageApiService;
            _mapper = mapper;
            _defectService = defectService;
        }

        [HttpPost]
        [Route("")]
        public DeepZoomLinkTableDto GetDeepZoomLinks(DeepZoomLinkDataTableFilterModelDto deepZoomLinkDataTableFilter)
        {
            var filterCriteria = _mapper.Map<DeepZoomLinkQuery>(deepZoomLinkDataTableFilter);

            IPagedList<DeepZoomRowDto> deepZoomLinks = _deepZoomLinkService.GetForNodePaged(
                        filterCriteria.Id,
                        filterCriteria.Type,
                        filterCriteria,
                        deepZoomLinkDataTableFilter.ExcludeDeepZoomLinkId,
                        deepZoomLinkDataTableFilter.IsCompareToSameBlade);

            List<DeepZoomLinkTableRowDto> deepZoomLinkTableRows =
                _mapper.Map<IEnumerable<DeepZoomLinkTableRowDto>>(deepZoomLinks).ToList();

            deepZoomLinkTableRows.ForEach(row =>
            {
                row.Url = LocalUrlHelper.GenerateUrlForApi(
                    row.Country,
                    row.Site,
                    row.TurbineSerialNumber,
                    row.Blade, row.Surface, row.Inspection);
            });

            return new DeepZoomLinkTableDto
            {
                DeepZoomLinkTableRows = deepZoomLinkTableRows,
                TotalDisplayedRecords = deepZoomLinks.TotalCount,
                TotalRecords = deepZoomLinks.TotalCount,
            };
        }

        [HttpGet]
        [Route("Info/{deepZoomLinkId}")]
        [AuthorizationUser(Permission.DeepZoomLinkPreviewNavigation, Permission.CompareDeepZoomLinkNavigation)]
        public async Task<IHttpActionResult> GetDeepZoomLinkInfo(Guid deepZoomLinkId)
        {
            var deepZoomLink = _deepZoomLinkService.GetById(deepZoomLinkId);

            var existsPath = await _deepZoomFileService.ExistPath(deepZoomLink.RelativePath);

            if (existsPath)
            {
                var deepZoomLinkDefects = _defectService.GetFindingsForBlade(deepZoomLink.BladeId, deepZoomLink.Surface, deepZoomLink.InspectionId);
                var deepZoomLinkAnnotations = _mapper.Map<IEnumerable<Defect>, IEnumerable<DeepZoomLinkAnnotationsDto>>(deepZoomLinkDefects);

                var xmlStream = _deepZoomFileService.GetCaptureXml(deepZoomLink.RelativePath);
                var xdoc = XDocument.Load(xmlStream);
                var firstNode = (XElement)xdoc.FirstNode;
                var tileSize = firstNode?.Attribute("TileSize")?.Value;
                var overlap = firstNode?.Attribute("Overlap")?.Value;
                var firstChildNode = (XElement)firstNode?.FirstNode;
                var width = firstChildNode?.Attribute("Width")?.Value;
                var height = firstChildNode?.Attribute("Height")?.Value;

                var deepZoomLinkInfo = new DeepZoomLinkInfoDto
                {
                    Height = height,
                    Overlap = overlap,
                    TileSize = tileSize,
                    Width = width,
                    DeepZoomLinkId = deepZoomLink.Id,
                    BladeId = deepZoomLink.BladeId,
                    Surface = deepZoomLink.Surface,
                    InspectionId = deepZoomLink.InspectionId,
                    Annotations = deepZoomLinkAnnotations.ToList()
                };

                return Ok(deepZoomLinkInfo);
            }

            return BadRequest($"Path doesn't exist {deepZoomLink.RelativePath}");
        }

        [HttpGet]
        [Route("Images/{deepZoomLinkId}")]
        [AuthorizationUser(Permission.DeepZoomLinkPreviewNavigation, Permission.CompareDeepZoomLinkNavigation)]
        public async Task<IHttpActionResult> GetDeepZoomLinkImages(Guid deepZoomLinkId)
        {
            var deepZoomLink = _deepZoomLinkService.GetById(deepZoomLinkId);

            var existsPath = await _deepZoomFileService.ExistPath(deepZoomLink.RelativePath);

            if (existsPath)
            {
                var images = _imageApiService.GetForDeepZoom(deepZoomLink.BladeId, deepZoomLink.Surface);
                return Ok(images);
            }

            return BadRequest($"Path doesn't exist {deepZoomLink.RelativePath}");
        }

        [HttpGet]
        [Route("Breadcrumb/{deepZoomLinkId}")]
        [AuthorizationUser(Permission.DeepZoomLinkPreviewNavigation, Permission.CompareDeepZoomLinkNavigation)]
        public BreadcrumbInfoDto GetBreadcrumb(Guid deepZoomLinkId)
        {
            var deepZoomLink = _deepZoomLinkService.GetById(deepZoomLinkId);

            var breadcrumbInfoDto = new BreadcrumbInfoDto
            {
                Surface = deepZoomLink.Surface.ToString(),
                Blade = deepZoomLink.Blade.SerialNumber,
                Turbine = deepZoomLink.Blade.Turbine.Name,
                Site = deepZoomLink.Blade.Turbine.Site.Name,
                Country = deepZoomLink.Blade.Turbine.Site.Country.Name,
                Region = deepZoomLink.Blade.Turbine.Site.Country.Region.Name
            };

            return breadcrumbInfoDto;
        }

        [Route("Count/{nodeType}/{id}")]
        [HttpGet]
        [AuthorizationUser(Permission.ManagerViewNavigation)]
        public long GetNumOfDefect(NodeType nodeType, Guid id)
        {
            return _deepZoomLinkService.GetCountForNode(id, nodeType).Result;
        }

        [Route("QuickFilter/{nodeType}/{nodeId}/{excludeDeepZoomLinkId?}/{isCompareToSameBlade?}")]
        [HttpPost]
        [AuthorizationUser(Permission.ManagerViewNavigation)]
        public DeepZoomLinkDataTableQuickFilterListDto GetQuickFilters(NodeType nodeType, Guid nodeId, DeepZoomLinkQuickFilterModel quickFilter, Guid? excludeDeepZoomLinkId, bool? isCompareToSameBlade)
        {
            var filterCriteria = _mapper.Map<DeepZoomLinkQuery>(
                new DeepZoomLinkDataTableFilterModelDto
                {
                    Id = nodeId,
                    Type = nodeType,
                    QuickFilters = quickFilter
                });

            return _mapper.Map<DeepZoomLinkDataTableQuickFilterListDto>(_filterService.GetDeepZoomLinkDataTableQuickFilters(nodeId, nodeType, filterCriteria.Filter, excludeDeepZoomLinkId, isCompareToSameBlade.GetValueOrDefault()));
        }

        [Route("GetDeepZoomLinkIdByFindingId/{findingId}")]
        [HttpGet]
        [AuthorizationUser(Permission.ImagePreviewNavigation, Permission.CompareFindingsNavigation)]
        public string GetDeepZoomLinkIdByFindingId(Guid findingId)
        {
            var defect = _defectService.FindById(findingId);

            if (defect == null)
            {
                return String.Empty;
            }

            var deepZoomLink = _deepZoomLinkService.GetByUniqueKeys(defect.Sequence.BladeId, defect.Sequence.InspectionId, defect.Surface);

            if (deepZoomLink == null)
            {
                return String.Empty;
            }

            return deepZoomLink.Id.ToString();
        }

        [AllowAnonymous]
        [Route("Tiles")]
        [HttpGet]
        public HttpResponseMessage GetImageTiles(Guid deepZoomLinkId, string tile)
        {
            if (ValidatePath(tile))
            {
                var deepZoomLink = _deepZoomLinkService.GetById(deepZoomLinkId);
                var file = _deepZoomFileService.GetTile(deepZoomLink.RelativePath, tile);

                var response = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ByteArrayContent(file)
                };
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("image/png");

                return response;
            }

            return Request.CreateResponse(HttpStatusCode.BadRequest, $"Path is not valid! ({tile})");
        }

        private static bool ValidatePath(string path)
        {
            var pattern = @"^\d+\/\d+_\d+\.(jpg|png)$";
            var match = Regex.Match(path, pattern, RegexOptions.IgnoreCase);

            return match.Success;
        }

        [HttpDelete]
        [Route("Delete/{id}")]
        [AuthorizationUser(Permission.DeleteDeepZoomLinks)]
        public async Task<IHttpActionResult> DeleteDeepZoomLink(Guid id)
        {
            var deepZoomLink = _deepZoomLinkService.GetById(id);
            var result = await _deepZoomLinkService.Delete(deepZoomLink);

            return CreateHttpActionResult(result);
        }
    }
}

