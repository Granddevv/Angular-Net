using AutoMapper;
using HermesOnline.Core.Extensions;
using HermesOnline.Domain;
using HermesOnline.Service.Dto;
using HermesOnline.Web.Spa.Dtos.Blades;
using HermesOnline.Web.Spa.Dtos.Inspections;
using System.Linq;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Node
{
    public class BladeMapping : Profile
    {
        protected override void Configure()
        {
            CreateMap<Blade, NodeTreeViewItemDto>()
                .ForMember(m => m.Text, opt => opt.MapFrom(src => src.Name))
                .ForMember(m => m.Children, opt => opt.UseValue(false))
                .ForMember(m => m.Type, opt => opt.UseValue(NodeType.Blade.GetDescription()))
                .ForMember(m => m.InActive, opt => opt.MapFrom(src => !src.IsActive));

            CreateMap<Blade, BladeInfoDto>()
                .ForMember(dest => dest.FleetName, opt => opt.MapFrom(src => src.Turbine.Site.Country.Region.Fleet.Name))
                .ForMember(dest => dest.SiteName, opt => opt.MapFrom(src => src.Turbine.Site.Name))
                .ForMember(dest => dest.TurbineName,
                    opt => opt.MapFrom(src => src.Turbine.Name + "_" + src.Turbine.SerialNumber))
                .ForMember(dest => dest.BladeName, opt => opt.MapFrom(src => src.Position + "_" + src.SerialNumber))
                .ForMember(dest => dest.Inspections, opt => opt.MapFrom(src => src.Sequences.Select(s => s.Inspection).Distinct()));

            CreateMap<Inspection, InspectionInfoDto>();
        }
    }
}
