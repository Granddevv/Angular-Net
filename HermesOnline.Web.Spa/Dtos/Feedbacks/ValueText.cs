namespace HermesOnline.Web.Framework.DataTables
{
    public class ValueText
    {
        public ValueText()
        {

        }

        public ValueText(string value, string text)
        {
            Text = text;
            Value = value;
        }

        public string Text { get; set; }
        public string Value { get; set; }
    }
}
