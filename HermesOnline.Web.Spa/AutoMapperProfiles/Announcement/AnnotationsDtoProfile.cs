using System.Web;
using AutoMapper;
using HermesOnline.Domain;
using HermesOnline.Service.Helper;
using HermesOnline.Web.Framework.Extensions;
using HermesOnline.Web.Spa.Dtos.Annotations;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Announcement
{
    public class AnnotationsDtoProfile: Profile
    {
        public AnnotationsDtoProfile()
        {
            CreateMap<Defect, AnnotationsDto>()
               .ForMember(dest => dest.Url, opt => opt.MapFrom(src => 
               $"{HttpContext.Current.Request.Url.Scheme}://{HttpContext.Current.Request.Url.Host}:{HttpContext.Current.Request.Url.Port}/{src.Sequence.Blade.Turbine.Site.Country.Name}/{src.Sequence.Blade.Turbine.Site.Name}/{src.Sequence.Blade.Turbine.SerialNumber}/{src.Sequence.Blade.SerialNumber}/{src.SerialNumber}"))
               .ForMember(dest => dest.Color, opt => opt.MapFrom(src => DefectHelper.GetColorForDefect(src.Name)))
               .Ignore(x => x.XCenter)  
               .Ignore(x => x.YCenter)
               .Ignore(x => x.Height)
               .Ignore(x => x.Width)
               .Ignore(x => x.Shape)
               .AfterMap((defect, dest) =>
               {
                   dest.SetShapeFromDefect(defect.Shape);
               });
        }
    }
}