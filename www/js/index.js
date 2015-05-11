var resultDiv;

document.addEventListener("deviceready", init, false);
function init() {
    document.querySelector("#skeniraj_btn").addEventListener("touchend", startScan, false);
    resultDiv = document.querySelector("#ls_test_o");

    $("#ls_test_o").html(window.localStorage.getItem("ls_test"));
    $("#ls_test_i").on('input', function () {
        window.localStorage.setItem("ls_test", $("#ls_test_i").val());
    });
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