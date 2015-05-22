function wallet() {
    this.uname = "";
    this.pass = "";
    this.coini = [];
}

var denarnica = new wallet();
var izpis = "matic";
var url = ""; //TODO ??

//LOCAL STORAGE
//document.querySelector("#output1").innerHTML = window.localStorage.getItem("ls_test");
// window.localStorage.setItem("ls_test", document.getElementById('input').value);


document.addEventListener("deviceready", init, false);
function init() {
    document.getElementById('qr_koda').addEventListener("touchend", qr_create, false);
    document.getElementById('startScan').addEventListener("touchend", startScan, false);
    document.getElementById('saveWallet').addEventListener("touchend", saveWallet, false);

    //PC DEBUGGING
    document.getElementById('saveWallet').addEventListener("click", saveWallet, false);
    //--

    var ustvarjen = window.localStorage.getItem("ustvarjen");
    if (ustvarjen === null)//wallet ni ustvarjen
    {
        var s = "<div id=\"create_wallet\"><h4>  Za uporabo aplikacije morate ustvariti novo denarnico, ali pa uvoziti obstoječo! </h4><button class=\"gumb\" id=\"nov_wallet_btn\">Ustvari novo</button><button class=\"gumb\" id=\"uvozi_wallet_btn\">Uvozi obstoječo</button></div>"
        show_popup(s, false, false);
    }


}

//---------------------------------
// retrieves root file system entry

function EXPORT_FILE() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}

function gotFS(fileSystem) {
    fileSystem.root.getFile("wallet.txt", {create: true, exclusive: false}, gotFileEntry, fail);
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

function saveWallet()
{
    var s = JSON.stringify(denarnica);
    izpis = s;
    EXPORT_FILE();
}

function show_popup(noter, height, width)
{
    if (height !== false)
        document.getElementById('popup_general').style.height = height;
    if (width !== false)
        document.getElementById('popup_general').style.width = width;

    document.getElementById('popup_general').innerHTML = noter;
    document.getElementById('popup_general').style.display = "block";
}

function hide_popup(noter, height, width)
{
    document.getElementById('popup_general').style.display = "none";
}