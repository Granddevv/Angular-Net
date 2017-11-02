using AutoMapper;
using HermesOnline.Web.Spa.Dtos;
using HermesOnline.Domain;
using System;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.report
{
    public class ReportTableRowDtoProfile : Profile
    {
        public ReportTableRowDtoProfile()
        {
            CreateMap<Domain.Report, ReportTableRowDto>()
                 .ForMember(x => x.Size, opt => opt.MapFrom(y => (Math.Round((Convert.ToDouble(y.Size) / 1048576), 4)).ToString())); ;
        }
    }
}