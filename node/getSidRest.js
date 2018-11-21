var http = require('http');
var url = require('url');
var fs = require('fs');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var URL = "http://172.27.136.254:8050/caisd-rest/rest_access";
var urlvariable = "text";
var ItemJSON = "<rest_access/>"



exports.getSid = function () {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = callbackFunction(xmlhttp);
        xmlhttp.open("POST", URL, false);
        xmlhttp.setRequestHeader('Accept', 'application/xml');
        xmlhttp.setRequestHeader('Content-Type', 'application/xml; charset=UTF-8');
        xmlhttp.setRequestHeader('Authorization', 'Basic YWxleF9wYXo6YWxleF9wYXo=');
        xmlhttp.onreadystatechange = callbackFunction(xmlhttp);
        xmlhttp.send(ItemJSON);
        console.log(xmlhttp.responseText);


};

function callbackFunction(xmlhttp) {
        console.log(xmlhttp.responseXML);
}