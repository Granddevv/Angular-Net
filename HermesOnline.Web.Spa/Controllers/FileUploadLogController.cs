using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using HermesOnline.Core;
using HermesOnline.Domain;
using HermesOnline.Domain.Identity;
using HermesOnline.Service.Interfaces;
using HermesOnline.Web.Spa.Dtos.FileUploadLog;
using HermesOnline.Web.Spa.Filters;

namespace HermesOnline.Web.Spa.Controllers
{
    [Authorize]
    [RoutePrefix("Api/FileUploadLog")]
    [AuthorizationUser(Permission.AdminNavigation)]
    public class FileUploadLogController : BaseController
    {
        #region Fields

        private readonly IFileUploadLogService _fileUploadLogService;
        private readonly IMapper _mapper;
        #endregion

        #region C'tor

        public FileUploadLogController(IFileUploadLogService fileUploadLogService, IMapper mapper)
        {
            _fileUploadLogService = fileUploadLogService;
            _mapper = mapper;
        }
        #endregion

        #region Api

        [Route("{pageIndex}/{pageSize}")]
        [HttpGet]
        public FileUploadLogTableDto GetAll(int pageIndex, int pageSize)
        {
            IPagedList<FileUploadLog> fileUploadLogs = _fileUploadLogService.Get(pageIndex, pageSize);

            List<FileUpladLogTableRowDto> fileUploadLogTableDtos = _mapper.Map<IEnumerable<FileUploadLog>, IEnumerable<FileUpladLogTableRowDto>>(fileUploadLogs).ToList();

            return new FileUploadLogTableDto
            {
                FileUploadLogTableRows = fileUploadLogTableDtos,
                TotalDisplayedRecords = fileUploadLogs.TotalCount,
                TotalRecords = fileUploadLogs.TotalCount
            };
        } 
        #endregion
    }
}
