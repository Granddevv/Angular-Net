using AutoMapper;
using HermesOnline.Web.Framework.Extensions;
using HermesOnline.Web.Spa.Dtos.Feedbacks;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Feedback
{
    public class FeedbacksTableRowDtoProfile : Profile
    {
        public FeedbacksTableRowDtoProfile()
        {
            CreateMap<Domain.Feedbacks.Feedback, FeedbacksTableRowDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Date.GetFormattedDate(false)))
                .ForMember(dest => dest.Comment, opt => opt.MapFrom(src => src.Comment))
                .ForMember(dest => dest.FileName, opt => opt.MapFrom(src => src.FileName))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type))
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.Url, opt => opt.MapFrom(src => src.Url));
        }
    }
}