using HermesOnline.Web.Spa.Dtos.Common;
using System.Collections.Generic;

namespace HermesOnline.Web.Spa.Dtos.Annotations
{
    public class DefectAnnotationsDto
    {
        public IEnumerable<ImageDto> Images { get; set; }
        public AnnotationsDto AnnotationData { get; set; }
    }
}