using System.Collections.Generic;
using System.Web.Http;
using AutoMapper;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Domain.Identity;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Filters;
using HermesOnline.Web.Spa.Dtos.Blades;
using HermesOnline.Web.Spa.Dtos.Node;

namespace HermesOnline.Web.Spa.Controllers
{
    [Authorize]
    [RoutePrefix("Api/DetailedView")]
    [AuthorizationUser(Permission.ManagerViewNavigation)]
    public class DetailedViewController : BaseController
    {        
        private readonly IDefectApiService _defectService;
        private readonly IMapper _mapper;
     
        public DetailedViewController(
            IDefectApiService defectService,
            IMapper mapper)
        {
            _defectService = defectService;
            _mapper = mapper;
        }

        [Route("")]
        [HttpPost]
        public IEnumerable<BladeMapDefectDto> GetData(NodeDto filter)
        {
            var defectQuery = _mapper.Map<FindingsQuery>(filter);
            defectQuery.UserId = CurrentUserId.Value;

            var defects = _defectService.GetDefectsForNode<BladeMapDefectDto>(filter.NodeId, filter.NodeType, defectQuery);
            return defects;
        }
    }
}
