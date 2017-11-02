using System.Linq;
using AutoMapper;
using HermesOnline.Core.Extensions;
using HermesOnline.Domain;
using HermesOnline.Service.Dto;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Node
{
    public class CountryMapping : Profile
    {
        protected override void Configure()
        {
            CreateMap<Country, NodeTreeViewItemDto>()
                .ForMember(m => m.Text, opt => opt.MapFrom(src => src.Name))
                .ForMember(m => m.Children, opt => opt.MapFrom(src => src.Sites.Any()))
                .ForMember(m => m.Type, opt => opt.UseValue(NodeType.Country.GetDescription()))
                .ForMember(m => m.InActive, opt => opt.UseValue(false));
        }
    }
}