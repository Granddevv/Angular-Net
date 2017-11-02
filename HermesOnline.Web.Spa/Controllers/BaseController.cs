using HermesOnline.Core.Helpers;
using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using HermesOnline.Service.Common;
using HermesOnline.Web.Spa.Helpers;
using HermesOnline.Service.Model;
using HermesOnline.Service.InterfacesApi;

namespace HermesOnline.Web.Spa.Controllers
{
    public class BaseController : ApiController
    {
        public BaseController()
        { }

        public Guid? CurrentUserId
        {
            get
            {
                return IdentityHelper.GetUserId(RequestContext);
            }
        }

        public IHttpActionResult CreateHttpActionResult(ServiceResult result)
        {
            return result.Succeeded ?
                (IHttpActionResult)Ok(result.ResultObject) :
                BadRequest(result.Message);
        }

        public IHttpActionResult CreateHttpActionResult(IGenericServiceResult result)
        {
            return result.Succeeded ?
                (IHttpActionResult)Ok(result.ResultObject) :
                BadRequest(result.Message);
        }

        protected static HttpResponseMessage CreateDownloadHttpResponse(
            string filePath,
            string downloadFileName,
            bool appendDateToFileName = false)
        {
            var fileExtension = Path.GetExtension(filePath);
            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return CreateDownloadHttpResponse(fileStream, fileExtension, downloadFileName, appendDateToFileName);
        }

        protected static HttpResponseMessage CreateDownloadHttpResponse(FileResponse fileResponse)
        {
            return CreateDownloadHttpResponse(
                fileResponse.File,
                Path.GetExtension(fileResponse.Name),
                Path.GetFileNameWithoutExtension(fileResponse.Name));
        }

        protected static HttpResponseMessage CreateDownloadHttpResponse(
           Stream fileStream,
           string fileExtension,
           string downloadFileName,
           bool appendDateToFileName = false)
        {
            string contentType = FileHelper.GetMimeType(fileExtension);

            HttpResponseMessage response = new HttpResponseMessage();
            response.StatusCode = HttpStatusCode.OK;
            response.Content = new StreamContent(fileStream);
            response.Content.Headers.ContentType = new MediaTypeHeaderValue(contentType);
            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");

            var datePart = appendDateToFileName ? DateTime.Now.ToString("yyyyMMdd") : string.Empty;
            var fileName = $"{downloadFileName}{datePart}{fileExtension}";

            response.Content.Headers.ContentDisposition.FileName = fileName;
            response.Content.Headers.ContentLength = fileStream.Length;

            return response;
        }
    }
}
