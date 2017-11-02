using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using HermesOnline.Service.Common.Interfaces;
using System.Net;
using HermesOnline.Domain.Identity;
using HermesOnline.Service.InterfacesApi;
using HermesOnline.Web.Spa.Filters;

namespace HermesOnline.Web.Spa.Controllers
{
    [Authorize]
    [RoutePrefix("Api/Image")]
    public class ImageController : BaseController
    {
        private readonly IImageApiService _imageService;

        public ImageController(IImageApiService imageService)
        {
            _imageService = imageService;
        }

        [Route("download/{defectId}/{imageId}/{includeAnnotation?}/{includeDefectScale?}")]
        [HttpGet]
        [AuthorizationUser(Permission.ManagerViewNavigation)]
        public async Task<HttpResponseMessage> GetImage(Guid defectId, Guid imageId, bool includeAnnotation, bool includeDefectScale)
        {
            var imageResult =
                await _imageService.GetDefectImageZoom(defectId, imageId, includeDefectScale, 1, includeAnnotation)
                ?? _imageService.GetDummyDefectImageZoom("Image does not exist!");

            return CreateDownloadHttpResponse(imageResult);
        }

        [Route("Thumbnailresized/{imageId?}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<HttpResponseMessage> ThumbnailResized(Guid imageId)
        {
            FileResponse image = await _imageService.GetDownsizedThumbnail(imageId);

            if (image == null)
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }

            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StreamContent(image.File)
            };

            return response;
        }

        [Route("ThumbnailresizedForDefect/{defectId?}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<HttpResponseMessage> ThumbnailresizedForDefect(Guid defectId)
        {
            FileResponse image = await _imageService.GetDownsizedThumbnailForDefect(defectId);

            if (image == null)
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }

            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StreamContent(image.File)
            };

            return response;
        }
    }
}