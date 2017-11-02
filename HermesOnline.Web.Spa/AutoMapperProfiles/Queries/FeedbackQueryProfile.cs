using AutoMapper;
using HermesOnline.Data.Interface.Query;
using HermesOnline.Web.Spa.Dtos.Feedbacks;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Queries
{
    public class FeedbackQueryProfile : Profile
    {
        public FeedbackQueryProfile()
        {
            CreateMap<FeedbacksTableFilterModelDto, FeedbackQuery>()
                 .ForMember(x => x.Sorter, opt => opt.MapFrom(y => y.GetOrderBy()));
        }
    }
}