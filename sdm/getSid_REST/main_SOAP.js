$(function(){
        var sr = '<?xml version="1.0" encoding="utf-8"?>' +
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://www.ca.com/UnicenterServicePlus/ServiceDesk">' +
        '<soapenv:Header/>'+
        '<soapenv:Body>'+
        '<ser:login>'+
        '<username>ServiceDesk</username>'+
        '<password>ServiceDesk</password>'+
        '</ser:login>'+
        '</soapenv:Body>'+
        '</soapenv:Envelope>'+
        '</xml>;'

    $.ajax({
        type: 'POST',
        url: 'http://usd.des.sicredi.net:8080/axis/services/USD_R11_WebService/login',
        data: sr,
        dataType: 'xml',
        headers: {
        	'Accept':'application/xml',
        	'Content-Type': 'application/xml; charset=UTF-8',
        	'Authorization': 'Basic c2VydmljZWRlc2s6MjQwNTgwIUBSb2dlcg==',
        },
        success: function (data){
        	xmlstr = data.xml ? data.xml : (new XMLSerializer()).serializeToString(data);
        	//console.log(xmlstr);
        	console.log(data);
          $(data).find('rest_access').each(function(){
            var accessKey = $(this).find('access_key').text();
            $("<li></li>").html(accessKey).appendTo("#lista");
            console.log(accessKey);
            callToCnt(accessKey);
          //callToCr(accessKey);
          });
            //console.log('success '+ data);
        },
        error: function (status, data) {
            console.log('Fail '+ status.code + ' Data: ' + data );
        }
    });
 //    var callToCnt=function (accessKey) {
 //        //GET /caisd-rest/chg?size=2&EntryTitle=userid&EntrySummary=notes HTTP/1.1
 //        //Accept: application/atom+xml
 //        // /caisd-rest/cnt?size=2&EntryTitle=userid&EntrySummary=notes HTTP/1.1
 //        // 'Content-Type': 'application/xml;charset=UTF-8',
 //        console.log('Entrou na callToCnt');
 //        $.ajax({
 //            url: 'http://sdm:8050/caisd-rest/cnt/',
 //            type: 'GET',
 //            dataType: 'xml',
 //            headers: {  'X-AccessKey': accessKey,
 //                        'Accept':'application/xml',
 //                        'X-Obj-Attrs':'z_assignee'
 //            }
 //        })
 //        .done(function(data){
 //            xmlstr = data.xml ? data.xml : (new XMLSerializer()).serializeToString(data);
 //            //console.log(xmlstr);
 //            console.log(data);
 //            resultado=$(data).find("[COMMON_NAME='Sem Adm Disp Gerenciador']").find('z_assignee').map(function(){ return $(this).attr('COMMON_NAME')});
 //            console.log(resultado);
 //        })
 //        .fail(function(){
 //            console.log('Erro');
 //        })
 //        .always(function(){
 //            console.log('Complete');
 //            // callToCr(accessKey);
 //        });
 //    };
 //    var callToCr=function (accessKey) {
 //    		console.log('chamou a callToCr');
	//     	$.ajax({
	//     	url: 'http://sdm:8050/caisd-rest/cr',
	//     	type: 'GET',
	//     	dataType: 'xml',
	//     	headers: {'X-AccessKey': accessKey},
	//     })
	//     .done(function (data){
	//     	    	var xmlstr = data.xml ? data.xml : (new XMLSerializer()).serializeToString(data);
	//     	    	console.log(xmlstr);
	//     	    	console.log(data);
 //              var accessKey = $(this).find('access_key').text();
 //              $("<li></li>").html(accessKey).appendTo("#lista");
 //              console.log(accessKey);
	//     	        //console.log('success '+ data);
	//     })
	//     .fail(function() {
	//     	console.log("error");
	//     })
	//     .always(function() {
	//     	console.log("complete");
	//     });
	// };
});
