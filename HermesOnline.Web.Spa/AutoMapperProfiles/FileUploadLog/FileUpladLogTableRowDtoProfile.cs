using AutoMapper;
using HermesOnline.Web.Framework.Extensions;
using HermesOnline.Web.Spa.Dtos.FileUploadLog;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.FileUploadLog
{
    public class FileUpladLogTableRowDtoProfile: Profile
    {
        public FileUpladLogTableRowDtoProfile()
        {
            CreateMap<Domain.FileUploadLog, FileUpladLogTableRowDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.FileName, opt => opt.MapFrom(src => src.FileName))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.GetDesription()))
                .ForMember(dest => dest.Time, opt => opt.MapFrom(src => src.Timestamp.GetFormattedDate(true)));
        }
    }
}