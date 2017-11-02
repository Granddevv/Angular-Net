using System.Linq;
using AutoMapper;
using HermesOnline.Core.Extensions;
using HermesOnline.Domain;
using HermesOnline.Service.Dto;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Node
{
    public class RegionMapping : Profile
    {
        protected override void Configure()
        {
            CreateMap<Region, NodeTreeViewItemDto>()
                .ForMember(m => m.Text, opt => opt.MapFrom(src => src.Name))
                .ForMember(m => m.Children, opt => opt.MapFrom(src => src.Countries.Any()))
                .ForMember(m => m.Type, opt => opt.UseValue(NodeType.Region.GetDescription()))
                .ForMember(m => m.InActive, opt => opt.UseValue(false));
        }
    }
}