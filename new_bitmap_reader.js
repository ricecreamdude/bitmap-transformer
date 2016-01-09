const fs = require('fs');
var bitMapOG = fs.readFileSync(process.argv[2]);

console.log(`type: ${bitMapOG.toString('utf-8', 0, 2)}`);
console.log(`size: ${bitMapOG.readUInt32LE(2)}`);
console.log(`start of pixel data: ${bitMapOG.readUInt32LE(10)}`)
console.log(`width: ${bitMapOG.readUInt32LE(18)}`)
console.log(`height: ${bitMapOG.readUInt32LE(22)}`);
console.log(`number of colors: ${bitMapOG.readUInt32LE(46)}`);

//Read and store Bitmap data
//Returns raw Bitmap data
var bitMapData = function() {

	var bitMapArray = [];

	for (var i = 0; i < bitMapOG.length; i++) {
		if (i > `${bitMapOG.readUInt32LE(10)}` - 1 ) {
			bitMapArray.push(bitMapOG[i]);
		}
	}

	return bitMapArray; //Javascript Array
};

//Turn bit map black and white
//Returns gray Javascript array
function makeGrayScale(bitMapData){
	
	var greyArray = [];

	for (var i = 0; i < bitMapData.length; i = i + 3){
		var g = bitMapData[i];
		var b = bitMapData[i + 1];
		var r = bitMapData[i + 2];
		var grey = (r+b+g)/3;

		greyArray.push(grey);
		greyArray.push(grey);
		greyArray.push(grey);

	};
	return greyArray;
};
//Process data to Bitmap readble
//Returns bitmap data
function writeNewBitData (data) {

	var grayBitMapData = [];

	for (var i = 0; i < data.length; i++) {
		bitMapOG[i + 54] = data[i];
	}

	return grayBitMapData;
}

//Create new image
function writeFile(buffer, options) {
  var writeStream = fs.createWriteStream(options.fileToCreate);
  writeStream.write(buffer);
  writeStream.end();
}

writeNewBitData(makeGrayScale(bitMapData()));
writeFile(bitMapOG, {fileToCreate: 'new_greyscale.bmp'});