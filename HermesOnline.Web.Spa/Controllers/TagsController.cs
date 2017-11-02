using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using HermesOnline.Core;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Domain.Identity;
using HermesOnline.Domain.Tag;
using HermesOnline.Service.Common;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Dtos.Tags;
using HermesOnline.Web.Spa.Filters;
using HermesOnline.Service.Model;

namespace HermesOnline.Web.Spa.Controllers
{
    [RoutePrefix("Api/Tags")]
    [Authorize]
    [AuthorizationUser(Permission.ManagerViewNavigation)]
    public class TagsController : BaseController
    {

        #region Fields
        
        private readonly IMapper _mapper;
        private readonly ITagApiService _tagApiService;
        private readonly IDefectApiService _defectApiService;

        #endregion

        #region C'tor

        public TagsController(IMapper mapper, ITagApiService tagApiService, IDefectApiService defectApiService)
        {
            _mapper = mapper;
            _tagApiService = tagApiService;
            _defectApiService = defectApiService;
        }

        #endregion

        #region Api

        [Route("")]
        [HttpPost]
        public TagsTableDto GetAll(TagsTableFilterModelDto tagsTableFilter)
        {
            TagQuery tagQuery = _mapper.Map<TagQuery>(tagsTableFilter);
            IPagedList<Tag> tags = _tagApiService.GetTags(tagQuery);
            List<TagsTableRowDto> tagsTableRowDtos = _mapper.Map<IEnumerable<Tag>, IEnumerable<TagsTableRowDto>>(tags).ToList();

            return new TagsTableDto
            {
                TagsTableRows = tagsTableRowDtos,
                TotalDisplayedRecords = tags.TotalCount,
                TotalRecords = tags.TotalCount
            };
        }

        [Route("Create")]
        [HttpPost]
        public HttpResponseMessage Create(TagDto tagDto)
        {
            Tag tag = _mapper.Map<Tag>(tagDto);
            ServiceResult result = _tagApiService.Save(tag);

            return Request.CreateResponse(result.Succeeded ? HttpStatusCode.OK : HttpStatusCode.BadRequest);
        }

        [Route("Delete/{tagId?}")]
        [HttpDelete]
        [AuthorizationUser(Permission.TagNavigation)]
        public HttpResponseMessage Delete(Guid tagId)
        {
            ServiceResult result = _tagApiService.Delete(tagId);
            return Request.CreateResponse(result.Succeeded ? HttpStatusCode.OK : HttpStatusCode.BadRequest);
        }

        [Route("Defect/Delete/{defectId?}/{tagId?}")]
        [HttpDelete]
        [AuthorizationUser(Permission.DeleteTag)]
        public HttpResponseMessage DeleteTagFromDefect(Guid defectId, Guid tagId)
        {
            ServiceResult result = _tagApiService.DeleteTagFromDefect(defectId, tagId);
            return Request.CreateResponse(result.Succeeded ? HttpStatusCode.OK : HttpStatusCode.BadRequest);
        }

        [Route("Defect/Add/{defectId?}/{tagId?}")]
        [HttpGet]
        [AuthorizationUser(Permission.AddTag)]
        public HttpResponseMessage AddTagToDefect(Guid defectId, Guid tagId)
        {
            ServiceResult result = _defectApiService.AddTagToDefect(defectId, tagId);
            return Request.CreateResponse(result.Succeeded ? HttpStatusCode.OK: HttpStatusCode.BadRequest);
        }

        [Route("Defect/All/{defectId?}")]
        [HttpGet]
        public IEnumerable<TagDto> GetTagsForDefect(Guid defectId)
        {
            ICollection<Tag> tags = _defectApiService.GetTags(defectId);
            IEnumerable<TagDto> tagDtos = _mapper.Map<IEnumerable<TagDto>>(tags);
            return tagDtos;
        }

        [Route("Defect/Available/{defectId?}")]
        [HttpGet]
        public IEnumerable<TagDto> GetAllTagsForAddingToDefect(Guid defectId)
        {
            IEnumerable<Tag> tags =  _tagApiService.GetAvailableTags(defectId);
            IEnumerable<TagDto> tagDtos = _mapper.Map<IEnumerable<TagDto>>(tags);
            return tagDtos;
        }

        [Route("Used/{tagId?}")]
        [HttpGet]
        public bool IsTagInUse(Guid tagId)
        {
            bool result = _defectApiService.IsTagInUse(tagId);
            return result;
        }
        #endregion
    }
}