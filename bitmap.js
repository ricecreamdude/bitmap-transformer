const fs = require('fs');


var bitmap = fs.readFileSync(process.argv[2]);

console.log(`type: ${bitmap.toString('utf-8', 0, 2)}`);
console.log(`size: ${bitmap.readUInt32LE(2)}`);
console.log(`start of pixel data: ${bitmap.readUInt32LE(10)}`)
console.log(`width: ${bitmap.readUInt32LE(18)}`)
console.log(`height: ${bitmap.readUInt32LE(22)}`);
console.log(`number of colors: ${bitmap.readUInt32LE(46)}`);


var colorArray = (function() {

  var toReturn = [];

  for (var i = 0; i < bitmap.length; i++) {
    if (i > 54) {
      toReturn.push(bitmap[i]);
    }
  }
  return toReturn;
})();


var colorPalette = createRgb(colorArray);

for(var i = 0; i < bitmap.length; i++){
	if(i > 54){
		bitmap[i] = colorPalette[i];
	}

	if(i === bitmap.length-1) {
		console.log('written');
		writeFile(bitmap, {fileToCreate: 'greyscale.bmp'});
	}
}






// Buffer is the buffer that will be written to file
// Options are the write options
function writeFile(buffer, options) {
  var writeStream = fs.createWriteStream(options.fileToCreate);
  writeStream.write(buffer);
  writeStream.end();
}

function createRgb(array) {
  var colorPallete = [];
  for (var i = 0; i < array.length; i = i + 3) {
  	var greyScaleReturn = grayScale(array[i + 2], array[i + 1], array[i]);
    colorPallete.push(greyScaleReturn);
  }
  return colorPallete;
}

function grayScale(r,g,b){
	var toReturn = (r+b+g)/3;
	toReturn = Math.floor(toReturn);
	return toReturn;
}
