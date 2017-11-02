using AutoMapper;
using HermesOnline.Domain;
using HermesOnline.Service.Helper;
using HermesOnline.Web.Framework.Extensions;
using HermesOnline.Web.Spa.Dtos.Annotations;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.DeepZoom
{
    public class DeepZoomLinkAnnotationsDtoProfile : Profile
    {
        public DeepZoomLinkAnnotationsDtoProfile()
        {
            CreateMap<Defect, DeepZoomLinkAnnotationsDto>()
                .Ignore(x => x.XCenter)
                .Ignore(x => x.YCenter)
                .Ignore(x => x.Height)
                .Ignore(x => x.Width)
                .Ignore(x => x.Shape)
                .ForMember(x => x.Color, opt => opt.MapFrom(k => DefectHelper.GetColorForDefect(k.Name)))
                .AfterMap((defect, dest) => { dest.TransformShapeForDeepZoomLink(defect); });
        }
    }
}

