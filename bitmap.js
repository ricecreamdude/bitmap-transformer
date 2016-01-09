const fs = require('fs');

var bitmap = fs.readFileSync(process.argv[2]);

console.log(`type: ${bitmap.toString('utf-8', 0, 2)}`);
console.log(`size: ${bitmap.readUInt32LE(2)}`);
console.log(`start of pixel data: ${bitmap.readUInt32LE(10)}`)
console.log(`width: ${bitmap.readUInt32LE(18)}`)
console.log(`height: ${bitmap.readUInt32LE(22)}`);
console.log(`number of colors: ${bitmap.readUInt32LE(46)}`);


//
var colorArray = (function() {

  var toReturn = [];

  for (var i = 0; i < bitmap.length; i++) {
    if (i > 54) {
      toReturn.push(bitmap[i]);
    }
  }
  return toReturn;

})();

//Begin loading image data into Javascript arrays, starting at byte 54 (because headers and stuff)
//We have verified that byte 54 is indeed where the image starts - this image does NOT have a color pallete.

var colorPalette = createRgb(colorArray); //array

for(var i = 0; i < bitmap.length; i++){
	if(i > 54){
		bitmap[i] = colorPalette.pop();
	}

  //Writes bitmap to greyscale.bmp (All data is done processing by here)
	if(i === bitmap.length-1) {
		console.log('written');
		writeFile(bitmap, {fileToCreate: 'greyscale.bmp'});
	}
}

//Calls image data from coloArray 
//Returns an array
function createRgb(array) {
  var colorPallete = [];
  for (var i = 0; i < array.length; i = i + 3) {
  	var greyScaleReturn = grayScale(array[i + 2], array[i + 1], array[i]);
    colorPallete.push(greyScaleReturn);
    console.log(greyScaleReturn);
  }
  return colorPallete;  //Array
}

//Converts an RGB set into grayscale via averaging
//Returns a gray color
function grayScale(r,g,b){
	var toReturn = (r+b+g)/3;
	toReturn = Math.floor(toReturn);
	return toReturn; //int
}

// Buffer is the buffer that will be written to file
// Options are the write options
//CLEAR

function writeFile(buffer, options) {
  var writeStream = fs.createWriteStream(options.fileToCreate);
  writeStream.write(buffer);
  writeStream.end();
}