using System;
using AutoMapper;
using HermesOnline.Web.Spa.Dtos.Tags;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Tag
{
    public class TagDtoProfile: Profile
    {
        public TagDtoProfile()
        {
            CreateMap<TagDto, Domain.Tag.Tag>()
                .ForMember(dest => dest.ModifiedDate, opt => opt.MapFrom(x => DateTime.Now));
        }
    }
}