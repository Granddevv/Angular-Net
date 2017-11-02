using System;

namespace HermesOnline.Web.Spa.Dtos.Common
{
    public class IdValue
    {
        public IdValue()
        {
            
        }

        public IdValue(string id, string value)
        {
            Id = id;
            Value = value;
        }

        public IdValue(Guid id, string value)
        {
            Id = id.ToString();
            Value = value;
        }

        public string Id { get; set; }
        public string Value { get; set; }
    }
}
