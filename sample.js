var tor = require('./tor'),
	apiKey = "YOUR API KEY",
	projectDomain = "YOUR PROJECT DOMAIN";

api = new tor.TorApi(apiKey, projectDomain);

ticket = {
	email: "your@email.address",
	from_name: "John Doe",
	subject: "lorem ipsum...",
	body: "lorem ipsum...",
	html: false,
	date: parseInt(new Date().getTime()/1000, 10),
	labels: ["label 1", "label 2"],
	attachment: "./attachment.txt"
};

api.newTicket(ticket, function(response) {
	console.log(response);
});