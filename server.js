const app = require('./app');

let port = 3000;

if (process.env.PORT) {
	port = process.env.PORT;
}

app.listen(port, () => {
	console.log(`Server running on port ${port}!`);
});
