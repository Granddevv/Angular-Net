using System;
using HermesOnline.Core.Data;
using HermesOnline.Domain.General;

namespace HermesOnline.Web.Spa.Dtos.Log
{
    public class LogTableFilterModelDto
    {
        public int PageSize { get; set; }

        public int PageIndex { get; set; }
        
        public  Guid Id { get; set; }
    }
}