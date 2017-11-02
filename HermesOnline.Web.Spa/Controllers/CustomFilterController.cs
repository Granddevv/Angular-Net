using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using HermesOnline.Core;
using HermesOnline.Domain.CustomFilters;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Dtos.Filters;
using System.Net.Http;
using HermesOnline.Service.Model;
using System.Net;
using System;

namespace HermesOnline.Web.Spa.Controllers
{
    [RoutePrefix("Api/CustomFilter")]
    public class CustomFilterController : BaseController
    {

        private readonly ICustomFilterService _customFilterService;
        private readonly IMapper _mapper;

        public CustomFilterController(ICustomFilterService customFilterService, IMapper mapper)
        {
            _customFilterService = customFilterService;
            _mapper = mapper;
        }

        [Route("")]
        [HttpPost]
        public CustomFiltersTableDto GetAll(CustomFiltersTableFilterModelDto customFiltersTableFilter)
        {
            CustomFilterQuery customFilterQuery = _mapper.Map<CustomFilterQuery>(customFiltersTableFilter);

            IPagedList<CustomFilter> customFilter = _customFilterService.GetAll(customFilterQuery);
            List<CustomFiltersTableRowDto> customFiltersTableRowDtos =
                _mapper.Map<IEnumerable<CustomFilter>, IEnumerable<CustomFiltersTableRowDto>>(customFilter).ToList();

            return new CustomFiltersTableDto
            {
                CustomFiltersTableRows = customFiltersTableRowDtos,
                TotalDisplayedRecords = customFilter.TotalCount,
                TotalRecords = customFilter.TotalCount
            };
        }


        [HttpDelete]
        [Route("Delete/{id}")]
        public HttpResponseMessage Delete(Guid id)
        {
            ServiceResult result = _customFilterService.Delete(id);
            return Request.CreateResponse(result.Succeeded ? HttpStatusCode.OK : HttpStatusCode.BadRequest);
        }

        [HttpGet]
        [Route("Id/{id}")]
        public CustomFilterDto GetById(string id)
        {
            CustomFilter customFilter = _customFilterService.GetById(new Guid(id));
           return _mapper.Map<CustomFilterDto>(customFilter);
        }

        [HttpPost]
        [Route("Save")]
        public HttpResponseMessage Save(CustomFilterDto customFilterDto)
        {
            CustomFilter customFilter = this._mapper.Map<CustomFilter>(customFilterDto);
            customFilter.UserId = CurrentUserId.Value;
            ServiceResult result = _customFilterService.AddOrUpdate(customFilter);
            return Request.CreateResponse(result.Succeeded ? HttpStatusCode.OK : HttpStatusCode.BadRequest);
        }
    }
}
