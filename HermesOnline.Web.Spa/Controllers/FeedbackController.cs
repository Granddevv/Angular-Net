using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using AutoMapper;
using HermesOnline.Core;
using HermesOnline.Core.Extensions;
using HermesOnline.Service.Interfaces;
using HermesOnline.Web.Spa.Dtos.Feedbacks;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Domain.Feedbacks;
using HermesOnline.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using HermesOnline.Web.Framework.DataTables;
using HermesOnline.Data.Interface.Query.Model;
using HermesOnline.Domain.Identity;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Dtos.QuickFilters.Feedback;
using HermesOnline.Web.Spa.Filters;
using HermesOnline.Web.Spa.Helpers;
using HermesOnline.Service.Model;

namespace HermesOnline.Web.Spa.Controllers
{
    [RoutePrefix("Api/Feedback")]
    [Authorize]
    [AuthorizationUser(Permission.ManagerViewNavigation)]
    public class FeedbackController : BaseController
    {
        private readonly IFeedbackService _feedbackService;
        private readonly IMapper _mapper;
        private readonly IFilterService _filterService;

        public FeedbackController(IFeedbackService feedbackService,
            IFilterService filterService,
            IMapper mapper)
        {
            _feedbackService = feedbackService;
            _filterService = filterService;
            _mapper = mapper;
        }

        [Route("")]
        [HttpPost]
        [AuthorizationUser(Permission.FeedbackNavigation)]
        public FeedbacksTableDto GetAll(FeedbacksTableFilterModelDto feedbacksTableFilter)
        {
            FeedbackQuery feedbackQuery = _mapper.Map<FeedbackQuery>(feedbacksTableFilter);

            IPagedList<Feedback> feedback = _feedbackService.Get(feedbackQuery);
            List<FeedbacksTableRowDto> feedbacksTableRowDtos =
                _mapper.Map<IEnumerable<Feedback>, IEnumerable<FeedbacksTableRowDto>>(feedback).ToList();

            return new FeedbacksTableDto
            {
                FeedbacksTableRows = feedbacksTableRowDtos,
                TotalDisplayedRecords = feedback.TotalCount,
                TotalRecords = feedback.TotalCount
            };
        }

        [Route("AddCommentForFeedback")]
        [HttpPost]
        [AuthorizationUser(Permission.FeedbackNavigation)]
        public HttpResponseMessage AddCommentForFeedback(Feedback feedback)
        {
            Feedback model = _feedbackService.GetById(feedback.Id);
            model.Comment = feedback.Comment;
            model.Status = FeedbackStatus.Rejected;
            _feedbackService.NotifyForChangeSatus(model);
            ServiceResult result = _feedbackService.Update(model);

            return result.Succeeded
                ? Request.CreateResponse(HttpStatusCode.OK)
                : Request.CreateErrorResponse(HttpStatusCode.BadRequest, result.Message);
        }

        [Route("AddAnnouncementForFeedback/{id?}")]
        [HttpPost]
        [AuthorizationUser(Permission.FeedbackNavigation)]
        public HttpResponseMessage AddAnnouncementForFeedback(Guid id)
        {
            Feedback feedback = _feedbackService.GetById(id);
            feedback.Status = FeedbackStatus.Resolved;
            _feedbackService.NotifyForChangeSatus(feedback);
            var result = _feedbackService.Update(feedback);
            return result.Succeeded
                ? Request.CreateResponse(HttpStatusCode.OK)
                : Request.CreateErrorResponse(HttpStatusCode.BadRequest, result.Message);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<HttpResponseMessage> Create()
        {
            HttpRequest httpRequest = HttpContext.Current.Request;
            string id = httpRequest.Params["id"];
            string category = httpRequest.Params["category"];
            string type = httpRequest.Params["type"];
            string description = httpRequest.Params["description"];
            string fileName = httpRequest.Params["fileName"];
            string notificationOfStatus = httpRequest.Params["notificationOfStatus"];
            string route = httpRequest.Params["link"];
            string url = LocalUrlHelper.GetApplicationUrl() + route;

            if (description == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Not all params are defined");
            }

            Feedback feedback = new Feedback
            {
                Id = id.HasValue() ? new Guid(id) : Guid.Empty,
                Type = (FeedbackType)Enum.Parse(typeof(FeedbackType), type, true),
                Category = (FeedbackCategory)Int32.Parse(category),
                Description = description,
                FileName = fileName.HasValue() ? fileName : null,
                NotificationOfStatus = notificationOfStatus != "undefined" && bool.Parse(notificationOfStatus),
                Url = url 
            };

            ServiceResult result = await _feedbackService.AddFeedback(feedback, httpRequest.Files.Count > 0 ? httpRequest.Files[0].InputStream : null);
            if (result.Succeeded)
            {
                result = _feedbackService.Notify(feedback);
            }

            return result.Succeeded
                ? Request.CreateResponse(HttpStatusCode.OK)
                : Request.CreateErrorResponse(HttpStatusCode.BadRequest, result.Message);
        }

        [HttpGet]
        [Route("getFeedbackCategory")]
        public IEnumerable<ValueText> GetFeedbackCategory()
        {
            List<ValueText> result = new List<ValueText>();

            foreach (var category in Enum.GetValues(typeof(FeedbackCategory)))
            {
                var type = category.GetType();
                var member = type.GetMember(category.ToString());
                DisplayAttribute displayName = (DisplayAttribute)member[0].GetCustomAttributes(typeof(DisplayAttribute), false).FirstOrDefault();
                result.Add(new ValueText(((int)category).ToString(), displayName?.Name));
            }
            return result;
        }

        [HttpGet]
        [Route("getType")]
        public IEnumerable<ValueText> GetFeedbackType()
        {
            List<ValueText> result = new List<ValueText>();

            foreach (var type in Enum.GetValues(typeof(FeedbackType)))
            {
                result.Add(new ValueText(((int)type).ToString(), type.ToString()));
            }
            return result;
        }

        [Route("QuickFilter")]
        [HttpPost]
        [AuthorizationUser(Permission.FeedbackNavigation)]
        public FeedbackDataTableQuickFilterListDto GetQuickFilters(FeedbackQuickFilterModel quickFilter)
        {
            var filterCriteria = _mapper.Map<FeedbackQuery>(
                           new FeedbacksTableFilterModelDto
                           {
                               QuickFilters = quickFilter
                           });

            return _mapper.Map<FeedbackDataTableQuickFilterListDto>(_filterService.GetFeedbackDataTableQuickFilters(filterCriteria.Filter));
        }

        [Route("Download/{id?}")]
        [HttpGet]
        [AuthorizationUser(Permission.FeedbackNavigation)]
        public async Task<HttpResponseMessage> DownloadAttachment(Guid id)
        {
            FileResponse result = await _feedbackService.GetFile(id);
            if (result == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Cannot find a file.");
            }

            result.Name = _feedbackService.GetFileName(id);
            return CreateDownloadHttpResponse(result);
        }
    }
}
