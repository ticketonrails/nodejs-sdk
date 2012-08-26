var crypto = require("crypto"),
	_ = require("underscore"),
	needle = require("needle");

var tor = (function () {

	var module = {};

	module.md5 = function(value){
		return crypto.createHash("md5").update(value).digest("hex");
	};

	module.TorApi = function(apiKey, projectDomain){

		this.apiKey = apiKey;
		this.projectDomain = projectDomain;
		this.apiToken = module.md5(this.projectDomain + module.md5(this.apiKey));
		this.apiVersion = "1";
		this.serverUrl = "http://api.ticketonrails.com";

		this.request = function(url, method, params, attachment, callback){
			var requestCallBack = callback;
			var self = this;
			requestUrl = this.serverUrl + "/v" + this.apiVersion + url;
			params["token"] = this.apiToken;
			switch(method){
				case "POST":
					if (attachment) {
						params["attachment"] = {
							file: attachment,
							content_type: "application/octet-stream"
						};
						needle.post(
							requestUrl,
							params,
							{ multipart: true },
							function(err, resp, body){
								self.parseResponse(err, resp, body, requestCallBack);
							}
						);
					} else {
						needle.post(requestUrl, params, function(err, resp, body){
							self.parseResponse(err, resp, body, requestCallBack);
						});
					}
					break;
				case "GET":
					needle.get(requestUrl, params, function(err, resp, body){
						self.parseResponse(err, resp, body, requestCallBack);
					});
					break;
				// TODO: implement all the other methods
			}
		};

		this.parseResponse = function(err, resp, body, requestCallBack){
			response = JSON.parse(body);
			requestCallBack(response);
		};

		this.newTicket = function(ticketObj, callback){
			params = {};
			ticket = {};
			attachment = null;
			if(ticketObj){
				ticketParams = [
					"email",
					"from_name",
					"subject",
					"body",
					"html",
					"date",
					"labels"
				];
				ticket = _.pick(ticketObj, ticketParams);
				if (_.has(ticketObj, "attachment")){
					attachment = ticketObj["attachment"];
				}
				params["ticket"] = JSON.stringify(ticket);
			}
			this.request("/tickets", "POST", params, attachment, callback);
		};

	};

	return module;

}());

module.exports = tor;