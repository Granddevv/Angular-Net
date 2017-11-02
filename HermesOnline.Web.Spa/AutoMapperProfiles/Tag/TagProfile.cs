using AutoMapper;
using HermesOnline.Web.Spa.Dtos.Tags;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Tag
{
    public class TagProfile: Profile
    {
        public TagProfile()
        {
            CreateMap<Domain.Tag.Tag, TagDto>();
        }
    }
}