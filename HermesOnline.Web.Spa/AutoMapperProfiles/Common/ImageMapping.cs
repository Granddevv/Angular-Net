using System;
using Aether.Utils.JSON;
using AutoMapper;
using HermesOnline.Domain;
using HermesOnline.Service.Dto;
using HermesOnline.Web.Framework.Extensions;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Common
{
    public class ImageMapping : Profile
    {
        protected override void Configure()
        {
            CreateMap<Image, ImageJsonData>()
                .Ignore(x => x.ImageId)
                .ForMember(dest => dest.SequenceRef, opt => opt.MapFrom(src => src.SequenceId))
                .AfterMap((image, imageJsonData) =>
                {
                    imageJsonData.ImageId = image.Id.ToString();
                    imageJsonData.IsImageForRepair = image.Type > 0;
                });

            CreateMap<ImageJsonData, Image>()
                .Ignore(im => im.Id)
                .Ignore(im => im.Type)
                .AfterMap((imageJsonData, image) =>
                {
                    image.Id = Guid.NewGuid();
                    image.Type = imageJsonData.IsImageForRepair ? ImageType.Repair : ImageType.Defect;
                    if (!(image.Scale > 0))
                    {
                        image.Scale = 1;
                    }
                });

            CreateMap<Image, ImageSearchDto>()
                .ForMember(dest => dest.BladeId, opt => opt.MapFrom(src => src.Sequence.BladeId));

            CreateMap<Image, ImageInfoForDeepZoomDto>();
        }
    }
}
