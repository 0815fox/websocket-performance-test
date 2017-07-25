const WebSocket = require('ws');
const now = require('performance-now');

const wss = new WebSocket.Server({ port: 9090 });

wss.on('connection', function connection(ws) {
	let TimeSum = 0;
	let Count = 0;
	ws.on('message', function incoming(message) {
		const StartTime = now();
		ws.send(message,()=>{
			const Duration = now() - StartTime;
			TimeSum += Duration;
			Count += 1;
			console.log(message,Duration+'ms');
		});
	});
	ws.on('close',()=>{
		console.log(Count,'messages, average response time:',TimeSum/Count);
	});
});
