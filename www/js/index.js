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
    onDeviceReady();

}

//---------------------------------
// retrieves root file system entry

function onDeviceReady() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}

function gotFS(fileSystem) {
    fileSystem.root.getFile("readme.txt", {create: true, exclusive: false}, gotFileEntry, fail);
    alert("GOTFS: " + fileSystem.root);
}

function gotFileEntry(fileEntry) {
    fileEntry.createWriter(gotFileWriter, fail);
    alert("gotFileEntry");
}

function gotFileWriter(writer) {
    alert("gotFileWriter");
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
    writer.write("matic je car");
    alert("gotFileWriter1");
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
                resultDiv.innerHTML = s;
            },
            function (error) {
                alert("Scanning failed: " + error);
            }
    );


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