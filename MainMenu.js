$(document).ready(function () {

    $("#btnSearch").click(function () {
        GoSearch();
    });
    $("#Searchbox").on('keyup', function (e) {
        if (e.keyCode == 13) {
            GoSearch();
        }
    });

    $.ajax({
        url: _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getbytitle('MainMenu')/Items?$select=Id,TitleEn,Title,URL,CssClass,ParentID/Id,ParentID/Title,Active&$orderby=Id&$expand=ParentID",
        type: "GET",
        headers: { "accept": "application/json;odata=verbose" },
        success: function (data) {
            if (data.d.results) {


                var Root = $.grep(data.d.results, function (e) { return e.ParentID.Title == undefined; });

                $.each(Root, function (key, parent) {
                    redirect = "";
                    var redirect = parent.URL != null ? (parent.URL) : "/";

                    $("#MainMenu2").append("<li id='" + parent.Id + "'><a class='dropdown-toggle " + (parent.CssClass != null ? parent.CssClass : "") + "' href='" + redirect + "'>" + (_spPageContextInfo.currentLanguage != 1033 ? parent.Title : parent.TitleEn) + "</a></li>");

                    BuildChild(data.d.results, parent);
                })

            }

        },
        error: function (xhr) {
            alert(xhr.status + ': ' + xhr.statusText);
        }
    });

    function BuildChild(MainArray, parent) {

        var child = $.grep(MainArray, function (e) { return e.ParentID.Id == parent.Id; });

        if (child.length > 0) {
            
            $($("#" + parent.Id + " a")[0]).attr("aria-expanded", "false")
            $($("#" + parent.Id + " a")[0]).attr("data-toggle", "dropdown")
            $("#" + parent.Id).append("<ul  class='dropdown-menu multi-level' role='menu' aria-labelledby='dropdownMenu' id='ul" + parent.Id + "'></ul>");
            $.each(child, function (key, result) {
                var redirect = result.URL != null ? result.URL : "#";
                
                $("#ul" + parent.Id).append("<li id='" + result.Id + "'><a class='" + (result.CssClass != null ? result.CssClass : "") + "' href='" + redirect + "'>" + (_spPageContextInfo.currentLanguage != 1033 ? result.Title : result.TitleEn) + "</a></li>");
                BuildChild(MainArray, result)

                
            })

        }

    }


    function GoSearch() {
        if ($("#Searchbox").val().length > 0) {
            window.location = _spPageContextInfo.webAbsoluteUrl + "/Pages/Search.aspx?K=" + $("#Searchbox").val();
        } else {
            $("#suberrormsg").text("");
            $("#suberrormsg").append('<div class="alert alert-danger fade in alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">&times;</a><strong>خطأ !</strong> فضلا ادخل كلمة البحث </div>');

        };
        return false
    }


});