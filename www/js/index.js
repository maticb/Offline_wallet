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


}

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