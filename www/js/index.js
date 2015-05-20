var resultDiv;

function wallet() {
    this.uname = "";
    this.pass = "";
    this.coini = [];
}


document.addEventListener("deviceready", init, false);
function init() {
    document.getElementById('startScan').addEventListener("touchend", startScan, false);
    document.getElementById('input').addEventListener("input", update_localstorage, false);
    document.getElementById('qr_koda').addEventListener("touchend", qr_create, false);
    resultDiv = document.querySelector("#output");

    document.querySelector("#output1").innerHTML = window.localStorage.getItem("ls_test");

///


}

//-------------------------------
function writeLog(str) {
	if(!logOb) return;
	var log = str + " [" + (new Date()) + "]\n";
	console.log("going to log "+log);
	logOb.createWriter(function(fileWriter) {
		
		fileWriter.seek(fileWriter.length);
		
		var blob = new Blob([log], {type:'text/plain'});
		fileWriter.write(blob);
		console.log("ok, in theory i worked");
	}, fail);
}

window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dir) {
    console.log("got main dir", dir);
    dir.getFile("log.txt", {create: true}, function (file) {
        console.log("got the file", file);
        logOb = file;
        writeLog("App started");
    });
});

//---------------------------------
function startScan() {

    cordova.plugins.barcodeScanner.scan(
            function (result) {
                var s = "Result: " + result.text + "<br/>" +
                        "Format: " + result.format + "<br/>" +
                        "Cancelled: " + result.cancelled;
                resultDiv.innerHTML = s;
            },
            function (error) {
                alert("Scanning failed: " + error);
            }
    );
     writeLog("skeniranje");

}
function update_localstorage() {
    window.localStorage.setItem("ls_test", document.getElementById('input').value);
}

function qr_create()
{
    var qrcode = new QRCode("output2");

    function makeCode() {

        qrcode.makeCode("test");
    }

    makeCode();
}