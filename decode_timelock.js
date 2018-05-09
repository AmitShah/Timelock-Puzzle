
const pool = require('multiprocessing');
const sjcl = require("sjcl-all");
const crypto = require("crypto");
const fs = require("fs");



//https://www.buriedone.com/hashrates.html
const MILLION = 1000000;
const HR = 2 * MILLION;

function dblHash(v){
	  return sjcl.hash.sha256.hash(sjcl.hash.sha256.hash(v));
	}
//sjcl.random.startCollectors();
// function hash(hashRate){

// 	function dblHash(v){
// 	  return sjcl.hash.sha256.hash(sjcl.hash.sha256.hash(v));
// 	}

// 	var sjcl = require("sjcl");
// 	var crypto = require("crypto");
// 	var buf = crypto.randomBytes(1024 / 8) // 128 bytes
// 	buf = new Uint32Array(new Uint8Array(buf).buffer);

// 	sjcl.random.addEntropy(buf, 1024, "crypto.randomBytes")
// 	var r = sjcl.random.randomWords(8, 10); //256 bit random
// 	var h = r;

	
// 	console.log(sjcl.codec.hex.fromBits(r));
// 	for(var i=0; i< hashRate; i++){
// 		h = dblHash(h);
// 	}
// 	return {"seed":r,"hash":h, "hashRate":hashRate};
// }

var timelock = JSON.parse(fs.readFileSync('./test/timelock.json', 'utf8'));

var seed = sjcl.codec.hex.toBits(timelock[0]);
console.log(seed);

var start = new Date();
for(var i =0; i < HR; i++){
	seed = dblHash(seed);
}

console.log(sjcl.codec.hex.fromBits(seed));

var curve = sjcl.ecc.curves.k256;


for(var i =1; i < timelock.length; i++){

	var n = { pub: new sjcl.ecc["elGamal"].publicKey(curve, curve.G.mult(seed)),
             sec: new sjcl.ecc["elGamal"].secretKey(curve, seed) };

	var next = sjcl.codec.hex.toBits(sjcl.decrypt(n.sec, timelock[i]));
	console.log(sjcl.codec.hex.fromBits(next));
	for(var j =0; j < HR;j++){
		next = dblHash(next);
	}
	
	seed = next;
}
var end = new Date();
console.log("MS:"+(end-start));




// for(var i =0; i < timelock.length; i++){
// 	console.log(timelock[i]);
// }