
const pool = require('multiprocessing');
const sjcl = require("sjcl-all");
const crypto = require("crypto");
const fs = require("fs");
 
const p = new pool.Pool(10);  // spawns 4 child processes to complete your jobs
 


//https://www.buriedone.com/hashrates.html
const MILLION = 1000000;
const HR = 2 * MILLION;



//sjcl.random.startCollectors();
function hash(hashRate){

	function dblHash(v){
	  return sjcl.hash.sha256.hash(sjcl.hash.sha256.hash(v));
	}

	var sjcl = require("sjcl");
	var crypto = require("crypto");
	var buf = crypto.randomBytes(1024 / 8) // 128 bytes
	buf = new Uint32Array(new Uint8Array(buf).buffer);

	sjcl.random.addEntropy(buf, 1024, "crypto.randomBytes")
	var r = sjcl.random.randomWords(8, 10); //256 bit random
	var h = r;

	
	console.log(sjcl.codec.hex.fromBits(r));
	for(var i=0; i< hashRate; i++){
		h = dblHash(h);
	}
	return {"seed":r,"hash":h, "hashRate":hashRate};
}

var start = new Date();
var end = null;
console.log(start);
var finalResult = [];
p.map([HR,HR,HR,HR,HR,HR,HR,HR,HR,HR], hash)
  .then(result => {
  	end = new Date();
  	console.log("MS:"+(end-start));

  	console.log(sjcl.codec.hex.fromBits(result[0].seed));
  	console.log(sjcl.codec.hex.fromBits(result[0].hash));
  	finalResult.push(sjcl.codec.hex.fromBits(result[0].seed));
  	var curve = sjcl.ecc.curves.k256;
  	for(var i=0; i < result.length-1; i++){
  		var n = { pub: new sjcl.ecc["elGamal"].publicKey(curve, curve.G.mult(result[i].hash)),
             sec: new sjcl.ecc["elGamal"].secretKey(curve, result[i].hash) };
        
        var ct = sjcl.encrypt(n.pub,sjcl.codec.hex.fromBits(result[i+1].seed));
        finalResult.push(ct);
        //console.log(ct);
		var pt = sjcl.decrypt(n.sec, ct);

		console.log(pt);
  // 		console.log(pt);
  	}

  	fs.appendFileSync("./test/timelock.json", JSON.stringify(finalResult));
  	console.log(finalResult);
  	p.close();
  });


// var pair = sjcl.ecc.elGamal.generateKeys(256)

// var ct = sjcl.encrypt(pair.pub, "Hello World!")
// console.log(ct);
// var pt = sjcl.decrypt(pair.sec, ct)
// console.log(pt);

// console.log(sjcl.codec.hex.fromBits(t));
// for(var i=0; i< hashRate*2; i++){
// 	t = dblHash(t);
// }
// console.log(sjcl.codec.hex.fromBits(t));

