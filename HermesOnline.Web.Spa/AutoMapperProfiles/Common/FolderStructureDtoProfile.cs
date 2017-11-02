using AutoMapper;
using HermesOnline.Service.Dto;
using HermesOnline.Web.Spa.Dtos.Common;

namespace HermesOnline.Web.Spa.AutoMapperProfiles.Common
{
    public class FolderStructureDtoProfile : Profile
    {
        public FolderStructureDtoProfile()
        {
            CreateMap<TreeViewItemDto, FolderStructureDto>()
                .ForMember(x => x.Value, opt => opt.MapFrom(src => src.Text))
                .ForMember(x => x.FullPath, opt => opt.MapFrom(src => src.Path))
                .ForMember(x => x.HasChildren, opt => opt.MapFrom(src => src.Children));
        }
    }
}