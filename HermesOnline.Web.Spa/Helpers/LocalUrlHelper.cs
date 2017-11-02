using HermesOnline.Domain;
using System;
using System.Web;

namespace HermesOnline.Web.Spa.Helpers
{
    public static class LocalUrlHelper
    {
        public static string GetDefectImageOverviewLink(Defect defect)
        {
            if(defect.MainImage == null)
            {
                return null;
            }
            string urlScheme = HttpContext.Current.Request.Url.Scheme;
            string host = HttpContext.Current.Request.Url.Host;
            var port = HttpContext.Current.Request.Url.Port;            
            return $"{urlScheme}://{host}:{port}/preview/image/{defect.MainImage.Id}/{defect.Id}";
        }

        public static string GetDefectDeepZoomLink(Guid deepZoomLinkId)
        {
            string urlScheme = HttpContext.Current.Request.Url.Scheme;
            string host = HttpContext.Current.Request.Url.Host;
            var port = HttpContext.Current.Request.Url.Port;            
            return $"{urlScheme}://{host}:{port}/preview/deepzoomlink/{deepZoomLinkId.ToString()}";
        }

        public static string GenerateResetPasswordLink(string userId, string code)
        {
            string urlScheme = HttpContext.Current.Request.Url.Scheme;
            string host = HttpContext.Current.Request.Url.Host;
            var port = HttpContext.Current.Request.Url.Port;
            return $"{urlScheme}://{host}:{port}/resetpassword/{userId}/{code}";
        }

        public static string GenerateUrlForApi(string countryName, string siteName, string turbineSerial, string bladeSerial, string surface, string inspection)
        {
            string urlScheme = HttpContext.Current.Request.Url.Scheme;
            string host = HttpContext.Current.Request.Url.Host;
            var port = HttpContext.Current.Request.Url.Port;
            return $"{urlScheme}://{host}:{port}/deepzoomlink?country={countryName}&site={siteName}&turbine={turbineSerial}&blade={bladeSerial}&side={surface}&inspectionName={inspection}&thickness=2&transparency=1";
        }

        public static string GetApplicationUrl()
        {
            string urlScheme = HttpContext.Current.Request.Url.Scheme;
            string host = HttpContext.Current.Request.Url.Host;
            int port = HttpContext.Current.Request.Url.Port;
            return $"{urlScheme}://{host}:{port}";
        }

        public static string GenerateUrlEditedFinding(Defect defect)
        {
            string urlScheme = HttpContext.Current.Request.Url.Scheme;
            string host = HttpContext.Current.Request.Url.Host;
            var port = HttpContext.Current.Request.Url.Port;
            return $"{urlScheme}://{host}:{port}/managerview/(filter:site/{defect.Sequence.Blade.Turbine.Site.Id}//findings:tab/0/type/3/id/{defect.Id})";
        }
    }
}