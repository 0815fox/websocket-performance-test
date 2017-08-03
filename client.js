//Adapt these settings for different tests:
if (typeof(WebSocket) === 'undefined') WebSocket = require('ws');
if (typeof(performance) === 'undefined') performance = {now:require('performance-now')};

const MessagesPerInterval = 1000000;
let Intervals = 1;

const OverallMessages = MessagesPerInterval * Intervals;

let wsUri = "ws://localhost:9090/";

let MessageIndex = 1;
let StartTimes = [];

let SendTimeSum = 0;

function run() {
	console.log('start');
	console.time('overall time');
	const Interval = setInterval(() => {
		const Start = performance.now();
		// const A = "SEND: " + MessageIndex + " TO " + (MessageIndex + MessagesPerInterval - 1);
		// console.time(A);
		for (let i = 0; i < MessagesPerInterval; ++i) {
			websocket.send(MessageIndex);
		}
		StartTimes[MessageIndex.toString()] = performance.now();
		MessageIndex += 1;
		// console.timeEnd(A);
		SendTimeSum += (performance.now() - Start);
		Intervals -= 1;
		if (Intervals === 0) {
			clearInterval(Interval);
		}
	}, 1);
}

let TimeSum = 0;
let Count = 0;

function message(evt) {
	const i = evt.data;
	const Time = performance.now() - StartTimes[i];
	TimeSum += Time;
	Count += 1;
	if (Count === OverallMessages) websocket.close();
	// delete StartTimes[i];
	// console.log(i + ' after ' + Time + 'ms');
}

function finish() {
	console.log(Count, 'messages sent, average response latency:', (TimeSum / Count) + 'ms', 'sending took', (SendTimeSum) + 'ms');
	console.timeEnd('overall time');
}

console.log('Sending', Intervals, 'times', MessagesPerInterval, 'messgages each.');
websocket = new WebSocket(wsUri);
websocket.onopen = function (evt) {
	run();
};
websocket.onclose = function (evt) {
	finish();
};
websocket.onmessage = message;
websocket.onerror = function (evt) {
	console.error(evt.data);
};
