using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using AutoMapper;
using HermesOnline.Domain;
using HermesOnline.Domain.Identity;
using HermesOnline.Service.Common.Interfaces;
using HermesOnline.Service.Interfaces;
using HermesOnline.Web.Spa.Dtos.DeepZoomLink;
using HermesOnline.Web.Spa.Filters;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Dtos.Common;

namespace HermesOnline.Web.Spa.Controllers
{
    [Authorize]
    [RoutePrefix("Api/AddDeepZoomLink")]
    [AuthorizationUser(Permission.AdminNavigation)]
    public class AddDeepZoomLinkController : BaseController
    {
        private readonly IFleetService _fleetService;
        private readonly ISiteService _siteService;
        private readonly IInspectionService _inspectionService;
        private readonly IDeepZoomFileService _deepZoomFileService;
        private readonly IDeepZoomLinkService _deepZoomLinkService;
        private readonly IMapper _mapper;

        public AddDeepZoomLinkController(IFleetService fleetService, ISiteService siteService, IInspectionService inspectionService, IMapper mapper, IDeepZoomFileService deepZoomFileService, IDeepZoomLinkService deepZoomLinkService)
        {
            _fleetService = fleetService;
            _siteService = siteService;
            _inspectionService = inspectionService;
            _mapper = mapper;
            _deepZoomFileService = deepZoomFileService;
            _deepZoomLinkService = deepZoomLinkService;
        }
        [HttpGet]
        [Route("Inspections/{siteId?}")]
        public IEnumerable<IdText> GetInspections(Guid siteId)
        {
            var result = _mapper.Map<IEnumerable<IdText>>(_inspectionService.GetInspectionsForNode(siteId, NodeType.Site));

            return result.OrderBy(x => x.Text);
        }

        [HttpGet]
        [Route("GetRootFolders")]
        public IEnumerable<FolderStructureDto> GetRootFolders()
        {
            var rootFolder = _deepZoomFileService.GetTreeViewRootDirectories();
            if (rootFolder == null)
            {
                return null;
            }
            var result = _mapper.Map<IEnumerable<FolderStructureDto>>(rootFolder);
            return result;
        }

        [HttpPost]
        [Route("GetChildFolders")]
        public IEnumerable<FolderStructureDto> GetChildFolders(FullPathDto fullPath)
        {
            var result = _deepZoomFileService.GetTreeViewChildDirectories(fullPath.Value);
            return _mapper.Map<IEnumerable<FolderStructureDto>>(result.OrderBy(x => x.Text));
        }

        [HttpPost]
        [Route("Create")]
        public async Task<HttpResponseMessage> AddNewDeepZoomLink(AddNewDeepZoomLinkDto addDeepZoomLinkModel)
        {
            var numberOfChangedRecords = await _deepZoomLinkService
                .AddMultipleFromSiteAsync(addDeepZoomLinkModel.FolderPath.TrimStart('\\'), addDeepZoomLinkModel.SiteId, addDeepZoomLinkModel.InspectionId);

            if (numberOfChangedRecords > 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK,
                    $"Number of created deep zoom link is: {numberOfChangedRecords}.");
            }

            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Something went wrong, nothing is saved.");
        }
    }
}