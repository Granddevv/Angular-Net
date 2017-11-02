using HermesOnline.Web.Spa.Dtos.Common;
using System;
using System.Collections.Generic;
using System.Linq;

namespace HermesOnline.Web.Spa.Dtos.Annotations
{
    public class AnnotationsDto
    {
        public Guid Id { get; set; }

        public string SerialNumber { get; set; }

        public string Name { get; set; }

        public string Color { get; set; }

        public int XCenter { get; set; }

        public int YCenter { get; set; }

        public int Width { get; set; }

        public int Height { get; set; }

        public PointDto[] Shape { get; set; }

        public decimal PixelsPerMM { get; set; }

        public string Url { get; set; }

        public void SetShapeFromDefect(string shape)
        {
            Shape = ParseShapePoints(shape).ToArray();
            SetAnnotationView();
        }

        protected IEnumerable<PointDto> ParseShapePoints(string shape)
        {
            var xyPoints = shape.Split(':');

            for (int i = 0; i < xyPoints.Length - 1; i++)
            {
                var xyPoint = xyPoints[i];
                var xy = xyPoint.Split(',');
                int x = int.Parse(xy[0]);
                int y = int.Parse(xy[1]);
                yield return new PointDto
                {
                    X = x,
                    Y = y
                };
            }
        }

        protected void SetAnnotationView()
        {
            var xmin = Shape.Min(pt => pt.X);
            var ymin = Shape.Min(pt => pt.Y);
            var xmax = Shape.Max(pt => pt.X);
            var ymax = Shape.Max(pt => pt.Y);
            Width = xmax - xmin;
            Height = ymax - ymin;
            XCenter = xmin;
            YCenter = ymin;
        }
    }
}