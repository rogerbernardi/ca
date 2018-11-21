var http = require('http');
var url = require('url');
var fs = require('fs');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
http.createServer(function (req, res) {
	res.writeHead(200, {
		'Content-Type': 'text/html'
	});

	var z_getSid = function () {
		//Definições das variáveis
		var sid;
		var i = 1;
		var host = "localhost"; //Usado pelo login() e doQuery()
		var port = "8080"; //Usado pelo login() e doQuery()
		var username = "ServiceDesk"; //Usado pelo login() e doQuery()
		var password = "ServiceDesk"; //Usado pelo login() e doQuery()
		var objectType = "crt"; //Usado pela doQuery(). Qual objeto a ser pesquisado.
		var whereClause = "delete_flag=0"; //Usado pela doQuery(). Qual o parametro da pesquisa.

		// Função que filtra o XML obtido na requisição ao serviço web. 
		var findLoginReturnXmlTag = function (xml) {
			// var xmlDoc = xml.responseXML;
			// var x = xmlDoc
			// var x = xmlDoc.getElementsByTagName('loginReturn')[0];
			// var y = x.childNodes[0];
			// return y.nodeValue;
			_xml = xml;
			inicio = _xml.responseText.indexOf("<loginReturn>") + 13;
			fim = _xml.responseText.indexOf("</loginReturn>");
			sid = xml.responseText.slice(inicio, fim);
			return sid;
		}

		// Função que aguarda e tenta novamente efetuar login em caso de erro.
		var waitAndTryAgain = function () {
			// console.log('waitAndTryAgain');
			setTimeout(function () {
				// console.log('waitAndTryAgain ' + i);
				i++;
				if (i < 6) {
					login();
				}
			}, 1500)
		}

		// Função que efetua a nova ação de login.
		var login = function () {
			// console.log('login');
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					sid = findLoginReturnXmlTag(this);
					res.end(sid);
					fs.writeFileSync('sid.txt', sid, function (err) {
						if (err) throw err;
						// console.log('Updated!');
					});
					console.log(sid);
				} else if (this.readyState == 4 && this.status !== 200) {
					waitAndTryAgain();
				}
			};

			envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://www.ca.com/UnicenterServicePlus/ServiceDesk">' +
				'< soapenv: Header/>' +
				'< soapenv: Body >' +
				'<ser: login>' +
				'<username>' + username + '</username>' +
				'<password>' + password + '</password>' +
				'</ser: login >' +
				'</soapenv: Body >' +
				'</soapenv: Envelope >'
			xhttp.open("GET", "http://" + host + ":" + port + "/axis/services/USD_R11_WebService?method=login&username=" + username + "&password=" + password + "", true);
			xhttp.send(envelope);
		};

		// Função que usa o SID que está no arquivo texto sid.txt, e valida se essa SID é valida, assim excluindo a necessidade de um novo login caso a ferramenta tem uma SID válida.
		// Essa função também dispara uma nova ação de login caso o SID foi invalido.
		var doQuery = function (sid) {
			// console.log("doQuery " + sid);
			var sid = sid;
			var thttp = new XMLHttpRequest();
			thttp.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					_xml = this;
					inicio = _xml.responseText.indexOf("<listLength>") + 12;
					fim = _xml.responseText.indexOf("</listLength>");
					listLength = _xml.responseText.slice(inicio, fim);
					res.end(sid);
				} else if (this.readyState == 4 && this.status !== 200) {
					login();
				}
			};

			envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://www.ca.com/UnicenterServicePlus/ServiceDesk">' +
				'<soapenv: Header/>' +
				'<soapenv: Body >' +
				'<ser: doQuery>' +
				'<sid>' + sid + '</username>' +
				'<objectType>' + objectType + '</objectType>' +
				'<whereClause>' + whereClause + '</whereClause>' +
				'</ser: doQuery >' +
				'</soapenv: Body >' +
				'</soapenv: Envelope >'
			thttp.open("GET", "http://" + host + ":" + port + "/axis/services/USD_R11_WebService?method=doQuery&sid=" + sid + "&objectType=" + objectType + "&whereClause=" + whereClause + "", true);
			thttp.send(envelope);
		};

		// Função que efetua a leitura do SID do arquivo sid.txt e se o arquivo estiver vazio, efetua uma nova ação de login, caso contrário realiza uma query para validar se o SID é
		// valido ainda, caso não for efetua nova ação de login através da função login.
		fs.readFile('sid.txt', function read(err, data) {
			if (err) {
				throw err;
			}
			var sid = data.toString()
			if (data.length === 0) {
				login();
			} else {
				doQuery(sid);
			}
		});
	}();

}).listen(9090);