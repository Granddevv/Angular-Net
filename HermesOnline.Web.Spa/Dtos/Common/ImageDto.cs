using System;

namespace HermesOnline.Web.Spa.Dtos.Common
{
    public class ImageDto
    {
        public Guid Id { get; set; }

        public int Height { get; set; }

        public int Width { get; set; }

        public int PixelsPerMM { get; set; }

        public bool IsRef { get; set; }
    }
}