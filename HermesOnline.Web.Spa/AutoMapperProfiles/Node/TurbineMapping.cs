using System.Linq;
using AutoMapper;
using HermesOnline.Core.Extensions;
using HermesOnline.Domain;
using HermesOnline.Service.Dto;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Node
{
    public class TurbineMapping : Profile
    {
        protected override void Configure()
        {
            CreateMap<Domain.Turbine, NodeTreeViewItemDto>()
                .ForMember(m => m.Text, opt => opt.MapFrom(src => src.Name))
                .ForMember(m => m.Children, opt => opt.MapFrom(src => src.Blades.Any()))
                .ForMember(m => m.Type, opt => opt.UseValue(NodeType.Turbine.GetDescription()))
                .ForMember(m => m.InActive, opt => opt.UseValue(false));
        }
    }
}