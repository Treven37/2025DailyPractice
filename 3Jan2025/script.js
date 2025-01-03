
		//adjustable
		var movePerUnit = 1;
		var time = 150*373;
		var followers = 20;
		var realFollowers = 20;
		var square = 7;
		var row = square+2;
		var column = square;

		var boardHeight = 100*row/column;
		document.getElementById("board").style.height=`${boardHeight}vw`;
		var content='';
		var color="black";
		var alive = followers;
		function initColumn() {
			content+=`<div class="row">`;
			if(square%2 == 0) {
				if(color=="white") {
					color="black";
				} else {
					color="white";
				}
			}
			for(let i=0; i < column; i++) {
				content += `<div class="${color}"></div>`
				if(color=="white") {
					color="black";
				} else {
					color="white";
				}
			}
			content += `</div>`;
		}
		function initBoard() {
			for(let i=0; i < row; i++) {
				initColumn();
			}
			document.getElementById("board").innerHTML = content;
		}
		initBoard();
		var entropy = Math.floor(((row*column))/followers);
		var guy = new Array();
		for(let i=0; i < followers; i+=1) {
			guy.push(i*entropy);
			if(i<realFollowers) {
				document.querySelectorAll('.white, .black')[i*entropy].innerHTML = `<img class="char" src="${i}.jpg"/><h5 id="${i*entropy}">z</h5>`;
			} else {
				document.querySelectorAll('.white, .black')[i*entropy].innerHTML = `<img class="char" src="bot.jpeg"/><h5 id="${i*entropy}">z</h5>`;
			}
		}
		function findx(pos) {
			return ((pos+column)%column+1);
		}
		function findy(pos) {
			return (Math.ceil((pos+0.1)/column));
		}
		function findpos(x, y) {
			return (x-1) + (y-1)*column;
		}
		function randomGuy() {
			let random = Math.floor(Math.random() * guy.length);
			let x = guy[random];
			move(x, x, random);
		}
		function move(pos, z, random) {
			let x = findx(pos);
			let y = findy(pos);
			let choice = Math.round(1+Math.random()*7);
			if(choice==1) {
				x-=1;
				y+=1
			} else if(choice==2) {
				y+=1
			} else if(choice==3) {
				x+=1;
				y+=1
			} else if(choice==4) {
				x-=1;
			} else if(choice==5) {
				x+=1;
			} else if(choice==6) {
				x-=1;
				y-=1;
			} else if(choice==7) {
				y-=1;
			} else if(choice==8) {
				x+=1;
				y-=1;
			}
			if(x < 1 || x > column || y < 1 || y > row ) {
				move(z, z, random);
			} else {
				let newpos = findpos(x, y);
				if(guy.includes(newpos)) {			
					guy[guy.indexOf(newpos)]="dead";
					alive-=1;
					guy.push(newpos);
				}
				let check = guy[random];
				while (guy.includes(check)) {
					guy[guy.indexOf(check)] = newpos;
				}
				document.querySelectorAll('.white, .black')[newpos].innerHTML = document.querySelectorAll('.white, .black')[z].innerHTML;
				document.querySelectorAll('.white, .black')[z].innerHTML = "";
				if(guy.includes("dead")) {			
					guy.splice(guy.indexOf("dead"), 1);
				}
				changeColor(z, newpos)
			}
		}
		function changeColor(z, newpos) {
				let level = (guy.filter((val) => val === newpos ).length);
				document.getElementById(z).id = newpos;
				document.getElementById(newpos).innerHTML = level;
				let color = level * 255/(followers - 6*followers/7);
				if(level <= followers - 6*followers/7) {
					document.getElementById(newpos).style.background = `rgb(${color/3}, ${color/3}, ${color/3})`;
				} else if(level <= followers - 5*followers/7) {
					document.getElementById(newpos).style.background = `rgb(${color}, 0, 0)`;
				} else if(level <= followers - 4*followers/7) {
					document.getElementById(newpos).style.background = `rgb(0, ${color}, 0)`;
				} else if(level <= followers - 3*followers/7) {
					document.getElementById(newpos).style.background = `rgb(0, 0, ${color})`;
				} else if(level <= followers - 2*followers/7) {
					document.getElementById(newpos).style.background = `rgb(${color}, ${color}, 0)`;
					document.getElementById(newpos).style.color = `black`;
				} else if(level <= followers - 1*followers/7) {
					document.getElementById(newpos).style.background = `rgb(0, ${color}, ${color})`;
					document.getElementById(newpos).style.color = `black`;
				} else if(level <= followers) {
					document.getElementById(newpos).style.background = `rgb(${color}, 0, ${color})`;
					document.getElementById(newpos).style.color = `black`;
				}
		}
		let onetime = true;
		function start() {
			var refreshIntervalId = setInterval(function() {
				if(alive == 2) {
					
					if(onetime) {
						for(let i=0; i < row*column; i++) {
							if(document.querySelectorAll('.white, .black')[i].innerHTML == "") {
								document.querySelectorAll('.white, .black')[i].style.height = "0vw";
							} 
						}
						onetime = false;
						write("Follow to join");
					}
					
					setTimeout(()=> {
						for(let i=0; i < row*column; i++) {
							if(document.querySelectorAll('.white, .black')[i].innerHTML == "") {
								document.querySelectorAll('.white, .black')[i].style.height = "auto";
							}
						}
						write("");
						alive-=1;
					}, 3000);
				} else if(guy.filter((val) => val === guy[0]).length != guy.length) {
					for(let i=0; i < movePerUnit; i++){ 
						randomGuy();
					}
					if (time != 373) {
						time -= 373;
					}
				} else {
					setTimeout(function() {
						document.getElementById("board").style.height = '100vw';
						document.getElementById("board").innerHTML = `<img src=${document.getElementsByClassName("char")[0].src}/>`;
						write("Winner");
					}, 373);
					clearInterval(refreshIntervalId);
				}
			}, time/373);
		}
		
		var i=0;
		function write(content) {
			setTimeout(function() {
				if(i < content.length) {
					document.getElementById("winText").innerHTML += content[i];
					i++;
					write(content);
				} else {
					i=0;
					setTimeout(()=> {
						document.getElementById("winText").innerHTML = "";
					}, 1000);
				}
			}, 111);
		}
