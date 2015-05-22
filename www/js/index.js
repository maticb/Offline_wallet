function wallet() {
    this.uname = "";
    this.pass = "";
    this.coini = [];
}

var denarnica = new wallet();
var izpis = "matic";

//LOCAL STORAGE
//document.querySelector("#output1").innerHTML = window.localStorage.getItem("ls_test");
// window.localStorage.setItem("ls_test", document.getElementById('input').value);


document.addEventListener("deviceready", init, false);
function init() {


    //document.getElementById('input').addEventListener("input", update_localstorage, false);
    document.getElementById('qr_koda').addEventListener("touchend", qr_create, false);
    document.getElementById('startScan').addEventListener("touchend", startScan, false);

    var ustvarjen = window.localStorage.getItem("ls_test");
    alert("-" + ustvarjen + "-");


}

//---------------------------------
// retrieves root file system entry

function EXPORT_FILE() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}

function gotFS(fileSystem) {
    fileSystem.root.getFile("readme.txt", {create: true, exclusive: false}, gotFileEntry, fail);
}

function gotFileEntry(fileEntry) {
    fileEntry.createWriter(gotFileWriter, fail);
}

function gotFileWriter(writer) {
    /*writer.onwriteend = function (evt) {
     console.log("contents of file now 'some sample text'");
     writer.truncate(11);
     writer.onwriteend = function (evt) {
     console.log("contents of file now 'some sample'");
     writer.seek(4);
     writer.write(" different text");
     writer.onwriteend = function (evt) {
     console.log("contents of file now 'some different text'");
     }
     };
     };*/
    writer.write(izpis);

}

function fail(error) {
    alert(error.code);
}

//---------------------------------
function startScan() {

    cordova.plugins.barcodeScanner.scan(
            function (result) {
                var s = "Result: " + result.text + "<br/>" +
                        "Format: " + result.format + "<br/>" +
                        "Cancelled: " + result.cancelled;
                document.querySelector("#output").innerHTML = s;
            },
            function (error) {
                alert("Scanning failed: " + error);
            }
    );


}


function qr_create()
{
    var qrcode = new QRCode("output2");

    function makeCode() {

        qrcode.makeCode(url);
    }

    makeCode();
}