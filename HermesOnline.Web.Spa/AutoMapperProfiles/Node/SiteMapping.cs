using System.Linq;
using AutoMapper;
using HermesOnline.Core.Extensions;
using HermesOnline.Domain;
using HermesOnline.Service.Dto;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Node
{
    public class SiteMapping : Profile
    {
        protected override void Configure()
        {
            CreateMap<Site, NodeTreeViewItemDto>()
                .ForMember(m => m.Text, opt => opt.MapFrom(src => src.Name))
                .ForMember(m => m.Children, opt => opt.MapFrom(src => src.Turbines.Any()))
                .ForMember(m => m.Type, opt => opt.UseValue(NodeType.Site.GetDescription()))
                .ForMember(m => m.InActive, opt => opt.UseValue(false));
        }
    }
}