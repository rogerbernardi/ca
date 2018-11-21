var queryRest = function () {
        console.log("SID: ");
        jQuery.ajax({
                type: "POST",
                url: "http://localhost:8050/caisd-rest/rest_access",
                data: "<rest_access/>",
                dataType: "xml",
                headers: {
                        Accept: "application/xml",
                        "Content-Type": "application/xml; charset=UTF-8",
                        Authorization: "Basic YWxleF9wYXo6YWxleF9wYXo="
                },
                success: function (data) {
                        xmlstr = data.xml ? data.xml : new XMLSerializer().serializeToString(data);
                        console.log(xmlstr);
                        console.log(data);
                        jQuery(data).find("rest_access").each(function () {
                                var accessKey = jQuery(this).find("access_key").text();
                                console.log("AccessKey: " + accessKey);
                                // callToCnt(accessKey);
                        });
                },
                error: function (status, data) {
                        console.log("Fail " + status.code + " Data: " + data);
                }
        });
}();