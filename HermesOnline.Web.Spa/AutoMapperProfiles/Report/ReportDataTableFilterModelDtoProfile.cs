using AutoMapper;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Web.Spa.Dtos;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Report
{
    public class ReportDataTableFilterModelDtoProfile : Profile
    {
        public ReportDataTableFilterModelDtoProfile()
        {
            CreateMap<ReportDataTableFilterModelDto, ReportQuery>()
                 .ForMember(x => x.Sorter, opt => opt.MapFrom(y => y.GetOrderBy())); ;
        }
    }
}