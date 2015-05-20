var resultDiv;

function wallet() {
    this.uname = "";
    this.pass = "";
    this.coini = [];
}

var fileObject;


document.addEventListener("deviceready", init, false);
function init() {
    document.getElementById('startScan').addEventListener("touchend", startScan, false);
    document.getElementById('input').addEventListener("input", update_localstorage, false);
    document.getElementById('qr_koda').addEventListener("touchend", qr_create, false);
    resultDiv = document.querySelector("#output");

    document.querySelector("#output1").innerHTML = window.localStorage.getItem("ls_test");

///

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
}

//-------------------------------

function onFileSystemSuccess(fileSystem) {
    fileSystem.root.getFile("readme.txt",
            {create: true, exclusive: false},
    gotFileEntry, fail);
}
function gotFileEntry(fileEntry) {
    fileObject = fileEntry;
    document.getElementById('saveFile_btn').addEventListener("touchend", saveFileContent, false);
}

function saveFileContent() {
    fileObject.createWriter(gotFileWriter, fail);
}

function gotFileWriter(writer) {
    var myText = "matic je car";
    writer.write(myText);
    writer.onwriteend = function (evt) {
        alert(fileObject.fullPath);
        var reader = new FileReader();
        reader.readAsText(fileObject);

    };
}


function fail(error)
{
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