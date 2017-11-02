using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using AutoMapper;
using HermesOnline.Core;
using HermesOnline.Core.Extensions;
using HermesOnline.Domain.General;
using HermesOnline.Domain.Identity;
using HermesOnline.Service.Common;
using HermesOnline.Service.Common.Interfaces;
using HermesOnline.Service.Interfaces;
using HermesOnline.Web.Spa.Dtos.Announcements;
using HermesOnline.Web.Spa.Filters;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Service.Model;
using HermesOnline.Service.InterfacesApi;

namespace HermesOnline.Web.Spa.Controllers
{
    [RoutePrefix("Api/Announcement")]
    public class AnnouncementController : BaseController
    {
        #region Fields

        private readonly IAnnouncementService _announcementService;
        private readonly IMapper _mapper;

        #endregion

        #region C'tor

        public AnnouncementController(IAnnouncementService announcementService, IMapper mapper)
        {
            _announcementService = announcementService;
            _mapper = mapper;
        }

        #endregion

        #region Api

        [Route("")]
        [HttpPost]
        [AuthorizationUser(Permission.AnnouncementsNavigation)]
        public AnnouncementsTableDto GetAll(AnnouncementsTableFilterModelDto announcementsTableFilter)
        {
            AnnouncementQuery announcementQuery = _mapper.Map<AnnouncementQuery>(announcementsTableFilter);

            IPagedList<Announcement> announcements = _announcementService.GetAnnouncements(announcementQuery);
            List<AnnouncementsTableRowDto> announcementsTableRowDtos =
                _mapper.Map<IEnumerable<Announcement>, IEnumerable<AnnouncementsTableRowDto>>(announcements).ToList();

            return new AnnouncementsTableDto
            {
                AnnouncementsTableRows = announcementsTableRowDtos,
                TotalDisplayedRecords = announcements.TotalCount,
                TotalRecords = announcements.TotalCount
            };
        }

        [Route("Create")]
        [HttpPost]
        [AuthorizationUser(Permission.AnnouncementsNavigation)]
        public async Task<HttpResponseMessage> Create()
        {
            HttpRequest httpRequest = HttpContext.Current.Request;
            string id = httpRequest.Params["id"];
            string title = httpRequest.Params["title"];
            string description = httpRequest.Params["description"];
            string fileName = httpRequest.Params["fileName"];

            if (title == null || description == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Not all params are defined");
            }

            Announcement announcement = new Announcement
            {
                Id = id.HasValue() ? new Guid(id) : Guid.Empty,
                Title = title,
                Description = description,
                FileName = fileName.HasValue() ? fileName : null
            };

            ServiceResult result =
                await _announcementService.AddNewAnnouncement(
                    announcement, httpRequest.Files.Count > 0 ? httpRequest.Files[0].InputStream : null);

            return result.Succeeded
                ? Request.CreateResponse(HttpStatusCode.OK)
                : Request.CreateErrorResponse(HttpStatusCode.BadRequest, result.Message);
        }

        [Route("Delete/{id?}")]
        [HttpDelete]
        [AuthorizationUser(Permission.AnnouncementsNavigation)]
        public HttpResponseMessage Delete(Guid id)
        {
            _announcementService.Delete(id);
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [Route("GetLatest")]
        [HttpGet]
        [AuthorizationUser(Permission.AnnouncementsNavigation)]
        public IEnumerable<AnnouncementsTableRowDto> GetLatestAnnouncements()
        {
            IEnumerable<Announcement> announcements = _announcementService.GetLastAnnouncements(3);
            return _mapper.Map<IEnumerable<Announcement>, IEnumerable<AnnouncementsTableRowDto>>(announcements);
        }

        [Route("Download/{id?}")]
        [HttpGet]
        [AuthorizationUser(Permission.AnnouncementsNavigation)]
        public async Task<HttpResponseMessage> DownloadAttachment(Guid id)
        {
            FileResponse result = await _announcementService.GetFile(id);
            if (result == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Cannot find a file.");
            }

            result.Name = _announcementService.FindById(id).FileName;
            return CreateDownloadHttpResponse(result);
        }

        [AllowAnonymous]
        [Route("Preview/{id}")]
        [HttpGet]
        public async Task<HttpResponseMessage> PreviewAttachment(Guid id)
        {
            FileResponse fileResponse = await _announcementService.GetFile(id);

            if (fileResponse == null)
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }

            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StreamContent(fileResponse.File)
            };

            return response;
        }
        #endregion
    }
}
