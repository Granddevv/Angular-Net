using System;
using System.Linq;
using Aether.Utils;
using Aether.Utils.JSON;
using AutoMapper;
using HermesOnline.Domain;
using HermesOnline.Service.Dto;
using HermesOnline.Domain.Defects;
using HermesOnline.Service.Reports.Datasets;
using DefectHelper = HermesOnline.Service.Helper.DefectHelper;
using HermesOnline.Service.Dto.QuickFilter;
using HermesOnline.Web.Spa.Dtos.Findings;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Finding
{
    public class DefectMapping : Profile
    {
        public const string UnknownType = "UNKNOWN";

        //TODO: Remove this when HD and HOL DefectLayers synchronized
        private DefectLayer ConvertImportedLayer(string layerString)
        {
            if (string.IsNullOrEmpty(layerString))
            {
                return DefectLayer.Unknown;
            }

            DefectLayer layer;
            if (Enum.TryParse<DefectLayer>(layerString, true, out layer))
            {
                return layer;
            }

            if (layerString.Equals("UNDEFINED", StringComparison.CurrentCultureIgnoreCase)
                || layerString.Equals("UNKNOWN", StringComparison.CurrentCultureIgnoreCase)
                || layerString.Equals("", StringComparison.CurrentCultureIgnoreCase))
            {
                return DefectLayer.Unknown;
            }
            else if (layerString.Equals("SURFACE", StringComparison.CurrentCultureIgnoreCase))
            {
                return DefectLayer.Surface;
            }
            else if (layerString.Equals("ADD ONS", StringComparison.CurrentCultureIgnoreCase)
                || layerString.Equals("ADD-ON", StringComparison.CurrentCultureIgnoreCase)
                || layerString.Equals("SEALANT", StringComparison.CurrentCultureIgnoreCase))
            {
                return DefectLayer.AddOn;
            }
            else if (layerString.Equals("LE PROTECTION", StringComparison.CurrentCultureIgnoreCase))
            {
                return DefectLayer.LEP;
            }
            else if (layerString.Equals("PAINT", StringComparison.CurrentCultureIgnoreCase)
                || layerString.Equals("GELCOAT", StringComparison.CurrentCultureIgnoreCase)
                || layerString.Equals("PAINT/GELCOAT", StringComparison.CurrentCultureIgnoreCase)
                || layerString.Equals("GEL", StringComparison.CurrentCultureIgnoreCase))
            {
                return DefectLayer.Paint;
            }
            else if (layerString.Equals("FIBRE", StringComparison.CurrentCultureIgnoreCase)
                || layerString.Equals("FILLER", StringComparison.CurrentCultureIgnoreCase))
            {
                return DefectLayer.Filler;
            }
            else if (layerString.Equals("LAMINAT", StringComparison.CurrentCultureIgnoreCase)
                || layerString.Equals("LAMINATE", StringComparison.CurrentCultureIgnoreCase))
            {
                return DefectLayer.Laminate;
            }
            else if (layerString.Equals("CRITICAL DEFECTS", StringComparison.CurrentCultureIgnoreCase)
                || layerString.Equals("CRITICAL", StringComparison.CurrentCultureIgnoreCase))
            {
                return DefectLayer.CriticalDefect;
            }
            else if (layerString.Equals("WOOD", StringComparison.CurrentCultureIgnoreCase))
            {
                return DefectLayer.Wood;
            }

            throw new NotSupportedException($"Imported Layer: {layerString} can't be mapped to any Defect Layer Type.");
        }

        protected override void Configure()
        {
            CreateMap<Defect, DefectRowDto>()
                .ForMember(x => x.HasHistory, opt => opt.MapFrom(k => k.RepairDefects.Any()))
                .ForMember(x => x.Blade, opt => opt.MapFrom(k => k.Sequence.Blade.Name))
                .ForMember(x => x.TurbineName, opt => opt.MapFrom(k => k.Sequence.Blade.Turbine.Name))
                .ForMember(x => x.TurbineSerialNumber, opt => opt.MapFrom(k => k.Sequence.Blade.Turbine.SerialNumber))
                .ForMember(x => x.TurbineType, opt => opt.MapFrom(k => k.Sequence.Blade.Turbine.Type))
                .ForMember(x => x.Platform, opt => opt.MapFrom(k => k.Sequence.Blade.Turbine.Platform))
                .ForMember(x => x.Country, opt => opt.MapFrom(k => k.Sequence.Blade.Turbine.Site.Country.Name))
                .ForMember(x => x.Site, opt => opt.MapFrom(k => k.Sequence.Blade.Turbine.Site.Name))
                .ForMember(x => x.InspectionDate, opt => opt.MapFrom(k => k.Sequence.Inspection.Date))
                .ForMember(x => x.BladeSerial, opt => opt.MapFrom(k => k.Sequence.Blade.SerialNumber))
                .ForMember(x => x.IsRoot, opt => opt.MapFrom(src => src.DefectGroupItem != null))
                .ForMember(x => x.InspectionCompany, opt => opt.MapFrom(src => src.Sequence.Inspection.Company))
                .ForMember(x => x.InspectionType, opt => opt.MapFrom(src => src.Sequence.Inspection.Type))
                .ForMember(x => x.GroupType, opt => opt.MapFrom(src => src.DefectGroupItem.DefectGroup.Type))
                .ForMember(x => x.SiteId, opt => opt.MapFrom(src => src.Sequence.Blade.Turbine.Site.Id));

            CreateMap<DefectJsonData, Defect>()
                .ForMember(dest => dest.Name,
                    opt => opt.ResolveUsing(src => string.IsNullOrEmpty(src.Name) ? UnknownType : src.Name))
                .ForMember(dest => dest.Layer,
                    opt => opt.ResolveUsing(src => ConvertImportedLayer(src.Layer)))
                .AfterMap((dj, d) => { d.Id = Guid.NewGuid();
                });

            CreateMap<Defect, DefectJsonData>()
                .ForMember(x => x.BladeSerial, opt => opt.MapFrom(k => k.Sequence.Blade.SerialNumber))
                .ForMember(x => x.ImageReference, opt => opt.MapFrom(k => k.MainImage.Id))
                .ForMember(x => x.Color, opt => opt.MapFrom(k => DefectHelper.GetColorForDefect(k.Name)))
                .AfterMap((d, dj) => { dj.DefectId = d.Id.ToString();});

            CreateMap<Blade, DefectTableQuickFilterNodeInfoDto>()
                .ForMember(dest => dest.CountryId, opt => opt.MapFrom(src => src.Turbine.Site.CountyId))
                .ForMember(dest => dest.CountryName, opt => opt.MapFrom(src => src.Turbine.Site.Country.Name))
                .ForMember(dest => dest.SiteId, opt => opt.MapFrom(src => src.Turbine.SiteId))
                .ForMember(dest => dest.SiteName, opt => opt.MapFrom(src => src.Turbine.Site.Name))
                .ForMember(dest => dest.BladeId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.BladeId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.BladeName, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.TurbineId, opt => opt.MapFrom(src => src.TurbineId))
                .ForMember(dest => dest.TurbineName, opt => opt.MapFrom(src => src.Turbine.Name))
                .ForMember(dest => dest.TurbineSerialNumber, opt => opt.MapFrom(src => src.Turbine.SerialNumber))
                .ForMember(dest => dest.TurbineType, opt => opt.MapFrom(src => src.Turbine.Type))
                .ForMember(dest => dest.TurbinePlatform, opt => opt.MapFrom(src => src.Turbine.Platform));

            CreateMap<Blade, InspectionComparisonDataset>()
                //.ForMember(dest => dest.BladeNumber, opt => opt.MapFrom(src => src.SerialNumber))
                .ForMember(dest => dest.Release, opt => DateTime.Now.ToString(Constants.DefaultDateFormatForUI))
                .ForMember(dest => dest.TurbineNumber, opt => opt.MapFrom(src => src.Turbine.SerialNumber));
        }
    }
}