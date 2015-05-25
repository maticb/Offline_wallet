function wallet() {
    this.uname = "";
    this.pass = "";
    this.coini = [];
}




var denarnica = new wallet();
var izpis = "matic";
var qr_input = "";
var branje_file = "";

function denarnicaOnChangeManual()
{
    window.localStorage.setItem("denarnica", JSON.stringify(denarnica));
    var s = "";
    for (var i = 0; i < denarnica.coini.length; i++)
        s += denarnica.coini[i] + "<br/>";
    $("#output_coini").html(s);

}

//LOCAL STORAGE
//document.querySelector("#output1").innerHTML = window.localStorage.getItem("ls_test");
// window.localStorage.setItem("ls_test", document.getElementById('input').value);


document.addEventListener("deviceready", init, false);
function init() {
    document.getElementById('qr_koda').addEventListener("touchend", qr_create, false);
    document.getElementById('startScan').addEventListener("touchend", startScan, false);
    document.getElementById('saveWallet').addEventListener("touchend", saveWallet, false);


    //PC DEBUGGING/TEMP
    //document.getElementById('saveWallet').addEventListener("click", saveWallet, false);
    document.getElementById('nov_wallet_temp_btn').addEventListener("touchend", createNewWallet, false);
    document.getElementById('dodaj_coin_temp_btn').addEventListener("touchend", dodaj_coin_temp, false);
    document.getElementById('uvozi_wallet_temp_btn').addEventListener("touchend", importWallet, false);
    //--

    var ustvarjen = window.localStorage.getItem("ustvarjen");
    if (ustvarjen !== "da")//wallet ni ustvarjen
    {
        wallet_ustvari_uvozi();
    }
    else
    {
        // alert(window.localStorage.getItem("denarnica"));
        denarnica = JSON.parse(window.localStorage.getItem("denarnica"));
        //alert(denarnica.uname + " ;");
    }
    denarnicaOnChangeManual();
}
function wallet_ustvari_uvozi()
{
    hide_popup();
    var s = "<div id=\"create_wallet\"><h4>  Za uporabo aplikacije morate ustvariti novo denarnico, ali pa uvoziti obstoječo! </h4><button class=\"gumb\" id=\"nov_wallet_btn\">Ustvari novo</button><button class=\"gumb\" id=\"uvozi_wallet_btn\">Uvozi obstoječo</button></div>"
    show_popup(s, false, false);
    document.getElementById('nov_wallet_btn').addEventListener("touchend", createNewWallet, false);
    document.getElementById('uvozi_wallet_btn').addEventListener("touchend", importWallet, false);
}

//---------------------------------
//WRITE TO FILE
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
    writer.write(izpis);
    alert("Denarnica uspešno shranjena!");
}

//---------------------------------
//READ FILE

function readFile()
{
    window.resolveLocalFileSystemURL(branje_file, gotFile, fail);
}

function gotFile(fileEntry) {
    fileEntry.file(function (file) {
        var reader = new FileReader;
        reader.onloadend = function (e) {
            //console.log("Text is: " + this.result);
            // document.querySelector("#output").innerHTML = this.result;
            var json = this.result;
            var dekodirano = dekodiraj(json, "danes je lep dan");
            if (dekodirano !== false)
            {
                denarnica = JSON.parse(dekodirano);
                window.localStorage.setItem("denarnica", dekodirano);
                window.localStorage.setItem("ustvarjen", "da");
                denarnicaOnChangeManual();

                $("#container").css("display", "none");
                $("#container").css("z-index", "-10");
            }
            else
                alert("Napaka pri dekodiranju, poskusite ponovno!");
        };
        reader.readAsText(file);
    });
}

//---------------------------------
function fail(error) {
    alert(error.code);
}
//---------------------------------
//SCAN QR

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
//---------------------------------
// CREATE QR


function qr_create()
{

    var qrcode = new QRCode("output2");

    function makeCode() {

        qrcode.makeCode(qr_input);
    }

    makeCode();
}
//---------------------------------

function saveWallet()
{
    //denarnica.uname = "moj usernam";
    var s = JSON.stringify(denarnica);
    s = kodiraj(s, "danes je lep dan");
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

function hide_popup()
{
    document.getElementById('popup_general').style.display = "none";
}

function importWallet()
{
    hide_popup();

    var path = localStorage['lastPath'] || 'file:///storage/';
    // Constructor takes FileSelector(elem, path, masks, success, fail, cancel, menu, pathChanged, openFile)
    // Only elem is really required, but you'll have to provide the path sooner or later anyway.
    // If you don't provide a mask *.* will be used
    var fileSelector = new FileSelector(document.getElementById('container'), path, 'All files|*.*'); //Documents (html, txt)|*.htm;*.html;*.txt|

    $("#container").css("display", "block");

    $("#container").css("z-index", "10");

    // Mask can be changed later using setMasks method.
    fileSelector.onCancel = function (e) // Fires on the back button
    {
        // Add code for closing the file selector, going one folder back (like below) or something else
        $(fileSelector.elem).find('.file-container .item.back').click();
        e.stop(); // prevent other backbutton event listners from firing
    };
    fileSelector.onSuccess = function (path)
    {
        // If you click on a file, this function will be called with the name of the file

        var r = confirm("Izbrana denarnica:" + path);
        if (r === true) {
            branje_file = path;
            readFile();
        }



    };
    fileSelector.onPathChanged = function (path)
    {
        // Each time you change directory this callback will be launched (here we're saving lastpath in local storage)
        localStorage['lastPath'] = path;
    };
    fileSelector.onFail = function (error)
    {
        // If something goes wrong this code will be executed
        alert(error.message);
    };
    // There are also onMenu() and onOpenFile(fileEntry, path) callbacks.
    // First is called when you press menu button, the other when path leads to a file and not a directory.

    // Make the selector load file\directory list from a path (if no path is provided, component will try using previous path)
    fileSelector.open(path);
    // Directories and files will be alphabetically ordered and directories will be listed before the files.
}

function createNewWallet()
{
    hide_popup();

    var s = "<div id=\"new_wallet\"> <h4>Ustvari novo denarnico:</h4> <p>Uporabniško ime:</p><input type=\"text\" id=\"uname\" /><p>Geslo:</p><input type=\"password\" id=\"pass\" /><p>Ponovi geslo:</p><input type=\"password\" id=\"pass1\" /><br/><button class=\"gumb\" id=\"nov_confirm\">Potrdi</button><button class=\"gumb\" id=\"nazaj_create_new_wallet\">Nazaj</button><div id=\"new_wallet_error\"></div> </div>";
    show_popup(s, false, false);
    document.getElementById('nov_confirm').addEventListener("touchend", confirmNewWallet, false);
    document.getElementById('nazaj_create_new_wallet').addEventListener("touchend", nazajNewWallet, false);
    document.addEventListener("backbutton", nazajNewWallet, false);
}

function  nazajNewWallet() {
    document.removeEventListener("backbutton", nazajNewWallet, false);
    wallet_ustvari_uvozi();
}

function confirmNewWallet() {
    var uname = $("#uname").val();
    var pass = $("#pass").val();
    var pass1 = $("#pass1").val();
    var p = true;

    if (pass !== pass1)
    {
        p = false;
        $("#new_wallet_error").html("<p style=\"font-color:red;\">Gesli se ne ujemata!</p>");
    }
    if (uname === null || uname === "")
    {
        p = false;
        $("#new_wallet_error").html($("#new_wallet_error").html() + "<p style=\"font-color:red;\">Uporabniško ime ne sme biti prazno!</p>");
    }
    if (pass === "" || pass === null || pass1 === "" || pass1 === null)
    {
        p = false;
        $("#new_wallet_error").html($("#new_wallet_error").html() + "<p style=\"font-color:red;\">Geslo ne sme biti prazno!</p>");
    }
    if (p === true)
    {
        denarnica.uname = uname;
        denarnica.pass = md5(pass);
        window.localStorage.setItem("denarnica", JSON.stringify(denarnica));
        window.localStorage.setItem("ustvarjen", "da");
        denarnicaOnChangeManual();
        hide_popup();
    }

}


function dodaj_coin_temp()
{
    var s = "coin" + Math.random() + ":";
    denarnica.coini.push(s);
    window.localStorage.setItem("denarnica", JSON.stringify(denarnica));
    denarnicaOnChangeManual();

}