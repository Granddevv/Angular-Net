using Aether.Utils.ScreenCapture;

namespace HermesOnline.Web.Spa.Dtos.SummaryView
{
    public class SummaryViewItemFilterModelDto
    {
        public Surface Surface { get; set; }
        public int[] SelectedMeters { get; set; }
    }
}