using AutoMapper;
using Elmah;
using HermesOnline.Web.Framework.Extensions;
using HermesOnline.Web.Spa.Dtos.Feedbacks;
using HermesOnline.Web.Spa.Dtos.Log;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Log
{
    public class LogTableRowDtoProfile : Profile
    {
        public LogTableRowDtoProfile()
        {
            CreateMap<ErrorLogEntry, LogTableRowDto>()
                .ForMember(x => x.Code, opt => opt.MapFrom(k => k.Error.StatusCode))
                .ForMember(x => x.Date, opt => opt.MapFrom(k => k.Error.Time))
                .ForMember(x => x.Error, opt => opt.MapFrom(k => k.Error.Message))
                .ForMember(x => x.Host, opt => opt.MapFrom(k => k.Error.HostName))
                .ForMember(x => x.Type, opt => opt.MapFrom(k => k.Error.Type))
                .ForMember(x => x.User, opt => opt.MapFrom(k => k.Error.User))
                .ForMember(x => x.Source, opt => opt.MapFrom(k => k.Error.Source))
                .ForMember(x => x.Detail, opt => opt.MapFrom(k => k.Error.Detail));

            CreateMap<LogTableRowDto, ErrorLogEntry>();
        }
    }
}