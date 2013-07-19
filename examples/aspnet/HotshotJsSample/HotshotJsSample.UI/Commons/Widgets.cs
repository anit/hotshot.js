using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.WebPages;
using System.Web.Mvc.Html;
using System.Linq.Expressions;
using System.Collections;

namespace System.Web.Mvc.Html
{
    public static class Widgets
    {

        //gridIdentifier, columnHeaders, columnFieldNames, events, 
        public static HtmlString CollectionGrid<TModel, TValue>(this HtmlHelper<TModel> html, Expression<Func<TModel,TValue>> expression, HtmlString formFields, IDictionary<string, string> columnHeaderAndFieldName, string gridUniqueIdentifier, string idFieldName)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();

            TModel model = (TModel)html.ViewContext.ViewData.ModelMetadata.Model;
            ICollection collection =  (ICollection)expression.Compile().Invoke(model); 
            
            TagBuilder grid = new TagBuilder("div");
            grid.AddCssClass("s-grid");
            grid.MergeAttribute("data-column-headers", serializer.Serialize(columnHeaderAndFieldName.Keys.ToArray()));
            grid.MergeAttribute("data-column-field-names", serializer.Serialize(columnHeaderAndFieldName.Values.ToArray()));
            grid.MergeAttribute("data-grid-unique-identifier", gridUniqueIdentifier);
            grid.MergeAttribute("data-id-field-name", idFieldName);

            foreach (var item in collection)
            {
                TagBuilder tableRow = new TagBuilder("div");
                tableRow.AddCssClass("model-data table-data-row");

                tableRow.MergeAttribute("data-all", serializer.Serialize(item));
                grid.InnerHtml += tableRow.ToString();
            }

            //create div with form
            TagBuilder form = new TagBuilder("div");
            form.AddCssClass("model-form");
            form.InnerHtml += formFields.ToHtmlString();

            grid.InnerHtml += form.ToString();
            grid.InnerHtml += html.Partial("CollectionGridLayout").ToHtmlString();
            

            //combine all of them in one div with supportive data attributes and let the client-side
            //js do its work of re-arranging these divs

            return new HtmlString(grid.ToString(TagRenderMode.Normal));
        }

        public static HtmlString Dummy(this HtmlHelper html)
        {
            return new HtmlString("hello world");
        }

    }
}