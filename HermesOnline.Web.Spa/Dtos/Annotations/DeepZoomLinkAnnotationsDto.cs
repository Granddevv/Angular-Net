using System.Collections.Generic;
using System.Linq;
using Aether.Utils.DeepZoom;
using HermesOnline.Domain;
using HermesOnline.Web.Spa.Dtos.Common;

namespace HermesOnline.Web.Spa.Dtos.Annotations
{
    public class DeepZoomLinkAnnotationsDto : AnnotationsDto
    {
        public void TransformShapeForDeepZoomLink(Defect defect)
        {
            var image = defect.MainImage;
            if (image != null)
            {
                Shape = TransformShape(image, ParseShapePoints(defect.Shape).ToArray());
                SetAnnotationView();
            }
        }

        private PointDto[] TransformShape(Image image, IEnumerable<PointDto> ps)
        {
            PixelsPerMM = (decimal)((double)PixelsPerMM * image.Scale);
            var shape = ps.Select(p => new System.Drawing.PointF(p.X, p.Y));
            var imginfo = new ImageInfo
            {
                Id = image.Id.ToString(),
                Height = image.Height,
                Rotation = (float)image.Rotation,
                Scale = (float)image.Scale,
                Width = image.Width,
                XOffset = image.XOffset,
                YOffset = image.YOffset
            };
            return imginfo.TranslatePoints(shape)
                          .Select(p => new PointDto { X = (int)p.X, Y = (int)p.Y })
                          .ToArray();
        }
    }
}