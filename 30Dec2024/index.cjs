const express = require('express');
const app = express();
const port = process.env | 8080
const path = require('path');

const fs = require('fs');

var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

var allyData;
var enemyData;



app.get('/', (req, res) => {
	res.status(201).sendFile(path.join(__dirname, 'main.html'));
});

app.post('/battle', async (req, res) => {
	const a = req.body.a; //You
	//Teammates
	const a2 = req.body.a2.toLowerCase()+a;
	const a3 = req.body.a3.toLowerCase()+a;
	const a4 = req.body.a4.toLowerCase()+a;
	const a5 = req.body.a5.toLowerCase()+a;
	//Enemy
	const b = req.body.b.toLowerCase()+a;
	const b2 = req.body.b2.toLowerCase()+a;
	const b3 = req.body.b3.toLowerCase()+a;
	const b4 = req.body.b4.toLowerCase()+a;
	const b5 = req.body.b5.toLowerCase()+a;
	var game;
	
	await fs.readFile(path.join(__dirname, '/allyVal.txt'), 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		allyData = data.split('\n');
	});
	await fs.readFile(path.join(__dirname, '/enemyVal.txt'), 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		enemyData = data.split('\n');
	});
	
	if(req.body.game != null) {
		game = "win";
	} else {
		game = "lose";
	}
	const ally = `${a2}\n${a3}\n${a4}\n${a5}\n`;
	const enemy = `${b}\n${b2}\n${b3}\n${b4}\n${b5}\n`;
	await fs.writeFile(path.join(__dirname, '/ally.txt'), ally, err => {
		if (err) {
			console.error(err);
		}
	});
	await fs.writeFile(path.join(__dirname, '/enemy.txt'), enemy, err => {
		if (err) {
			console.error(err);
		}
	});
	
	await fs.readFile(path.join(__dirname, '/ally.txt'), 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		let hero = data.split('\n');
		hero.pop();
		let uniqueHero = allyData;
		for(let i=0; i<hero.length; i++) {
			if(!uniqueHero.includes(hero[i])) {
				uniqueHero.push(hero[i]);
			}
			if(uniqueHero.includes(hero[i])) {
				for(let j=0; j<uniqueHero.length; j++) {
					if(uniqueHero[j] == hero[i]) {
						if(!isNaN(uniqueHero[j+1])) {
							if(game == "win") {
								uniqueHero[j+1] = parseInt(uniqueHero[j+1])+1;
							} else {
								uniqueHero[j+1] = parseInt(uniqueHero[j+1])-1;
							}
						} else {
							if(game == "win") {
								uniqueHero.splice(j+1, 0, 1);
							} else {
								uniqueHero.splice(j+1, 0, -1);
							}
						}
					}
				}
			}
		}
		allyData = uniqueHero;
		fs.writeFile(path.join(__dirname, '/allyVal.txt'), allyData.join('\n'), err => {
		if (err) {
			console.error(err);
		}
		});
	});
	
	await fs.readFile(path.join(__dirname, '/enemy.txt'), 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		let hero = data.split('\n');
		hero.pop();
		let uniqueHero = enemyData;
		for(let i=0; i<hero.length; i++) {
			if(!uniqueHero.includes(hero[i])) {
				uniqueHero.push(hero[i]);
			}
			if(uniqueHero.includes(hero[i])) {
				for(let j=0; j<uniqueHero.length; j++) {
					if(uniqueHero[j] == hero[i]) {
						if(!isNaN(uniqueHero[j+1])) {
							if(game == "win") {
								uniqueHero[j+1] = parseInt(uniqueHero[j+1])+1;
							} else {
								uniqueHero[j+1] = parseInt(uniqueHero[j+1])-1;
							}
						} else {
							if(game == "win") {
								uniqueHero.splice(j+1, 0, 1);
							} else {
								uniqueHero.splice(j+1, 0, -1);
							}
						}
					}
				}
			}
		}
		enemyData = uniqueHero;
		fs.writeFile(path.join(__dirname, '/enemyVal.txt'), enemyData.join('\n'), err => {
		if (err) {
			console.error(err);
		}
		});
	});
	setTimeout(()=>{
			res.send(`
				<!DOCTYPE html>
				<html>
				<head>
					<style>
						body {
							font-size: 11vw;
						}
					</style>
				</head>
				<body>
					Sucessfully Trained AI
				</body>
				</html>
			`);
	}, 373);
});

app.get('/analyse', async (req, res) => {
	const a = req.query.a.toLowerCase(); //You
	//Teammates
	const a2 = req.query.a2.toLowerCase()+a;
	const a3 = req.query.a3.toLowerCase()+a;
	const a4 = req.query.a4.toLowerCase()+a;
	const a5 = req.query.a5.toLowerCase()+a;
	//Enemy
	const b = req.query.b.toLowerCase()+a;
	const b2 = req.query.b2.toLowerCase()+a;
	const b3 = req.query.b3.toLowerCase()+a;
	const b4 = req.query.b4.toLowerCase()+a;
	const b5 = req.query.b5.toLowerCase()+a;
	
	fs.readFile(path.join(__dirname, '/allyVal.txt'), 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		allyData = data.split('\n');
	});
	fs.readFile(path.join(__dirname, '/enemyVal.txt'), 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		enemyData = data.split('\n');
	});
	
	var allyCompat;
	var enemyCompat;
	var aVal = 0;
	var eVal = 0;
	var allyDataN = new Array();
	var enemyDataN = new Array();
	var atotal;
	var etotal;
	var total;
	setTimeout(() => {
	allyCompat = new Array();
	if(!allyData.includes(a2)) {
		allyCompat.push(a2);
		allyCompat.push(0);
	}
	if(!allyData.includes(a3)) {
		allyCompat.push(a3);
		allyCompat.push(0);
	}
	if(!allyData.includes(a4)) {
		allyCompat.push(a4);
		allyCompat.push(0);
	}
	if(!allyData.includes(a5)) {
		allyCompat.push(a5);
		allyCompat.push(0);
	}
	for(let i=0; i<allyData.length; i++) {
		if (allyData[i] == a2) {
			allyCompat.push(a2);
			allyCompat.push(allyData[i+1]);
		}
		if (allyData[i] == a3) {
			allyCompat.push(a3);
			allyCompat.push(allyData[i+1]);
		}
		if (allyData[i] == a4) {
			allyCompat.push(a4);
			allyCompat.push(allyData[i+1]);
		}
		if (allyData[i] == a5) {
			allyCompat.push(a5);
			allyCompat.push(allyData[i+1]);
		}
	}
	enemyCompat = new Array();
	if(!enemyData.includes(b)) {
		enemyCompat.push(b);
		enemyCompat.push(0);
	}
	if(!enemyData.includes(b2)) {
		enemyCompat.push(b2);
		enemyCompat.push(0);
	}
	if(!enemyData.includes(b3)) {
		enemyCompat.push(b3);
		enemyCompat.push(0);
	}
	if(!enemyData.includes(b4)) {
		enemyCompat.push(b4);
		enemyCompat.push(0);
	}
	if(!enemyData.includes(b5)) {
		enemyCompat.push(b5);
		enemyCompat.push(0);
	}
	for(let i=0; i<enemyData.length; i++) {
		if (enemyData[i] == b) {
			enemyCompat.push(b);
			enemyCompat.push(enemyData[i+1]);
		}
		if (enemyData[i] == b2) {
			enemyCompat.push(b2);
			enemyCompat.push(enemyData[i+1]);
		}
		if (enemyData[i] == b3) {
			enemyCompat.push(b3);
			enemyCompat.push(enemyData[i+1]);
		}
		if (enemyData[i] == b4) {
			enemyCompat.push(b4);
			enemyCompat.push(enemyData[i+1]);
		}
		if (enemyData[i] == b5) {
			enemyCompat.push(b5);
			enemyCompat.push(enemyData[i+1]);
		}
	}
	for(let i=0; i<allyCompat.length; i++) {
		if(!isNaN(allyCompat[i])) {
			aVal += parseInt(allyCompat[i]);
		}
	}
	for(let i=0; i<enemyCompat.length; i++) {
		if(!isNaN(enemyCompat[i])) {
			eVal += parseInt(enemyCompat[i]);
		}
	}
	
	for(let i=0; i<allyData.length; i++) {
		if(!isNaN(allyData[i])) {
			allyDataN.push(parseInt(allyData[i]));
		}
	}
	allyDataN = allyDataN.sort(function (a, b) {  return a - b; });
	allyDataN = allyDataN.slice(Math.max(allyDataN.length - 4, 0))
	
	for(let i=0; i<enemyData.length; i++) {
		if(!isNaN(enemyData[i])) {
			enemyDataN.push(parseInt(enemyData[i]));
		}
	}
	enemyDataN = enemyDataN.sort(function (a, b) {  return a - b; });
	enemyDataN = enemyDataN.slice(Math.max(enemyDataN.length - 5, 0));
	atotal = allyDataN[0] + allyDataN[1] + allyDataN[2] + allyDataN[3];
	etotal = enemyDataN[0] + enemyDataN[1] + enemyDataN[2] + enemyDataN[3] + enemyDataN[4];
	total =  atotal + etotal;
	}, 373);
	
	
	setTimeout(()=>{
			res.send(`
				<!DOCTYPE html>
				<html>
				<head>
					<style>
						body {
							font-size: 6vw;
						}
					</style>
				</head>
				<body>
					Analysis:<br/><br/>
					${a.toUpperCase()} synergy to Ally:<br/> ${(((aVal)/atotal)+1)*100/2}%<br/>
					${a.toUpperCase()} countered Enemy :<br/> ${(((eVal)/etotal)+1)*100/2}%<br/><br/>
					Winning Chance:<br/> ${(((aVal+eVal)/total)+1)*100/2}%<br/> 
					<br/><br/><br/>
					
				</body>
				</html>
			`);
	}, 737);
});

app.listen(port, () => {
	console.log(`Server running at port ${port}`);
});