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
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, loadDirectories, fail);

}

//-------------------------------

function displayMessage(msg)
{
    navigator.notification.alert(msg);
}

function loadDirectories(fileSystem)
{
    directoryEntry = fileSystem.root;

    var directoryReader = directoryEntry.createReader();

    directoryReader.readEntries(function (entries) {
        var sOutput = "";
        for (var i = 0; i < entries.length; i++)
        {
            if (!entries[i].isDirectory)
            {
                fileSystem.root.getFile(entries[i].name, null, gotFileEntry, fail);
            }
        }
        //displayMessage(sOutput);
    }, fail);
}
function gotFileEntry(fileEntry)
{
    fileEntry.file(function (file) {
        var reader = new FileReader();
        reader.onloadend = function (evt) {
            displayMessage(evt.target.result);
        };
        reader.readAsText(file);
    }, fail);
}
function failFile(evt)
{
    displayMessage(evt.target.error.code);
}
function fail(error)
{
    displayMessage("Failed to list directory contents: " + error.code);
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