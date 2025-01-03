const express = require('express');
const path = require('path');
const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/1', (req, res) => {
	res.sendFile(path.join(__dirname, '/game1.html'));
});
app.get('/2', (req, res) => {
	res.sendFile(path.join(__dirname, '/game2.html'));
});
app.listen(8002, (err) => {
	if(err) {
		
	}
	console.log('localhost:8002/1 and localhost:8002/2');
});