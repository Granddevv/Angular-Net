using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using HermesOnline.Core;
using HermesOnline.Service.Interfaces;
using HermesOnline.Web.Spa.Dtos.Log;
using Elmah;
using HermesOnline.Domain.Identity;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Filters;

namespace HermesOnline.Web.Spa.Controllers
{
    [RoutePrefix("Api/Log")]
    [Authorize]
    [AuthorizationUser(Permission.AdminNavigation)]
    public class LogController : BaseController
    {
        private readonly IElmahService _elmahService;
        private readonly IMapper _mapper;
        
        public LogController(IElmahService elmahService, IMapper mapper)
        {
            _elmahService = elmahService;
            _mapper = mapper;
        }
        
        [Route("")]
        [HttpPost]
        public LogTableDto GetAll(LogTableFilterModelDto logTableFilter)
        {
            IPagedList<ErrorLogEntry> errors = _elmahService.GetErrors(logTableFilter.PageIndex, logTableFilter.PageSize);
            List<LogTableRowDto> errorsTableRowDtos =
                _mapper.Map<IEnumerable<ErrorLogEntry>, IEnumerable<LogTableRowDto>>(errors).ToList();

            return new LogTableDto
            {
                LogTableRows = errorsTableRowDtos,
                TotalDisplayedRecords = errors.TotalCount,
                TotalRecords = errors.TotalCount
            };
        }

        [HttpGet]
        [Route("GetError/{errorId}")]
        public LogTableRowDto GetError(Guid errorId)
        {
            return _mapper.Map<LogTableRowDto>(_elmahService.GetError(errorId));
        }
    }
}
