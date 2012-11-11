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

// new ticket
api.newTicket(ticket, function(response) {
	console.log(response);
});

// tickets list
api.getTickets(1, 20, function(response) {
	console.log(response);
	if (response.tickets.length > 0) {
		// single ticket
		api.getTicket(response.tickets[0].id, function(response) {
			console.log(response);
		});
	}
});