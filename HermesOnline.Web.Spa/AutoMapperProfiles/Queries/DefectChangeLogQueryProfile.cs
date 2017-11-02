using AutoMapper;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Domain;
using HermesOnline.Web.Spa.Dtos.ChangeLog;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Queries
{
    public class DefectChangeLogQueryProfile : Profile
    {
        public DefectChangeLogQueryProfile()
        {
            CreateMap<DefectChangeLogsTableFilterModelDto, DefectChangeLogQuery>()
                 .ForMember(x => x.Sorter, opt => opt.MapFrom(y => y.GetOrderBy()));
        }
    }
}