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
    document.getElementById('validate_queue').addEventListener("touchend", validateLocalQueue, false);
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
    if (window.localStorage.getItem("queueCoinov") === null)
    {
        var arr = [];
        window.localStorage.setItem("queueCoinov", JSON.stringify(arr));
    }
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
            json = this.result;

            var s = '<div id="login_wallet"> ' +
                    '<h4>Geslo denarnice:</h4>' +
                    '<input type="password" id="login_wallet_pass" /><br/>' +
                    '<button class="gumb" id="login_wallet_cancel">Prekliči</button>' +
                    '<button class="gumb" id="login_wallet_confirm">Potrdi</button>' +
                    '</div>"';
            show_popup(s, false, false);
            document.getElementById('login_wallet_confirm').addEventListener("touchend", preveriDekodiranje, false);
            document.getElementById('login_wallet_cancel').addEventListener("touchend", hide_popup, false);

        };
        reader.readAsText(file);
    });
}

function preveriDekodiranje()
{
    var pass = $("#login_wallet_pass").val();
    hide_popup();
    var dekodirano = dekodiraj(json, md5(pass));
    if (dekodirano !== false)
    {
        denarnica = JSON.parse(dekodirano);
        window.localStorage.setItem("denarnica", dekodirano);
        window.localStorage.setItem("ustvarjen", "da");
        denarnicaOnChangeManual();

        $("#container").css("display", "none");
        $("#container").css("z-index", "-10");
        alert("Uspešno uvožena denarnica: " + denarnica.uname);

    }
    else
        alert("Napaka pri dekodiranju, poskusite ponovno!");
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

                //document.querySelector("#output").innerHTML = s;
                /*if (result.text.substr(0, 4).toUpperCase() === "COIN")
                 {
                 denarnica.coini.push(result.text);
                 denarnicaOnChangeManual();
                 }*/
                alert(s);
                var coins = [];
                var coin = result.text.toString();

                coins.push(coin);
                //coins = "data=" + JSON.stringify(coins);
                coins = "data=" + coins;

                var url = 'http://picoin-gm94.rhcloud.com/validateCoin';
                $.ajax({
                    type: "POST",
                    url: url,
                    timeout: 60 * 1000,
                    data: coins
                }).done(function (data) {
                    //alert(data.status + " - " + data.message + " - " + data.coins[0]);
                    if (data.status === "ok")
                    {
                        denarnica.coini.push(coin);
                        window.localStorage.setItem("denarnica", JSON.stringify(denarnica));
                        alert("Uspešno dodan coin!");
                        denarnicaOnChangeManual();
                    }
                    else
                    {
                        alert(data.message);
                    }
                }).fail(function (a, b, c) {

                    saveToLocalQueue(coin);
                    alert("Napaka pri povezavi na strežnik: " + b + '|' + c);
                });


            },
            function (error) {
                alert("Scanning failed: " + error);
            }
    );


}
//---------------------------------
//
function saveToLocalQueue(coin)
{
    alert("save " + coin);
    var arr = [];
    alert(window.localStorage.getItem("queueCoinov"));
    arr = JSON.parse(window.localStorage.getItem("queueCoinov"));
    arr.push(coin);
    alert(arr.length + " save");
    window.localStorage.setItem("queueCoinov", JSON.stringify(arr));

}

function validateLocalQueue()
{

    var coins = window.localStorage.getItem("queueCoinov");
    alert(coins);
    var temp_arr = JSON.parse(coins);

    coins = "data=" + coins;

    var url = 'http://picoin-gm94.rhcloud.com/validateCoin';
    $.ajax({
        type: "POST",
        url: url,
        timeout: 60 * 1000,
        data: coins
    }).done(function (data) {
        // alert(data.status + " - " + data.message + " - " + data.coins[0]);
        if (data.status === "ok")
        {

            for (var i = 0; i < temp_arr.length; i++)
            {
                denarnica.coini.push(temp_arr[i]);
            }
            denarnicaOnChangeManual();
            //window.localStorage.setItem("denarnica", JSON.stringify(denarnica));
            var arr = [];
            window.localStorage.setItem("queueCoinov", JSON.stringify(arr));
            alert("Uspešno dodan/i coin!");

        }
    }).fail(function (a, b, c) {
        alert("Napaka pri povezavi na strežnik: " + b + '|' + c);

    });
}
// CREATE QR


function qr_create()
{
    if (denarnica.coini.length > 0)
    {
        qr_input = denarnica.coini[0];
        denarnica.coini.splice(0, 1);
        denarnicaOnChangeManual();
        //alert(qr_input);

        var qrcode = new QRCode("output2");
        function makeCode() {
            qrcode.makeCode(qr_input.toString());
        }
        makeCode();
    }
    else
        alert("Za pošiljanje morate imeti vsaj 1 coin!");
}
//---------------------------------

function saveWallet()
{
    //denarnica.uname = "moj usernam";
    var s = JSON.stringify(denarnica);
    s = kodiraj(s, denarnica.pass);
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
    document.getElementById('popup_overlay_hidden').style.display = "block";
    $("#popup_general").css("z-index", "15");
    $("#popup_overlay_hidden").css("z-index", "14");
}

function hide_popup()
{
    document.getElementById('popup_general').style.display = "none";
    document.getElementById('popup_overlay_hidden').style.display = "none";
    $("#popup_overlay_hidden").css("z-index", "-14");
    $("#popup_general").css("z-index", "-15");
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
    $.support.cors = true;
    var url = 'http://picoin-gm94.rhcloud.com/generateCoin/asdas/1';
    $.ajax({
        type: "GET",
        url: url,
        timeout: 60 * 1000
    }).done(function (data) {
        // alert(data.status + " - " + data.message + " - " + data.coins[0]);
        if (data.status === "ok")
        {
            var s = data.coins[0];
            denarnica.coini.push(s);
            window.localStorage.setItem("denarnica", JSON.stringify(denarnica));
            denarnicaOnChangeManual();
        }
    }).fail(function (a, b, c) {
        alert("Napaka pri povezavi na strežnik: " + b + '|' + c);
    });

    /*var s = "coin" + Math.random() + ":";
     denarnica.coini.push(s);
     window.localStorage.setItem("denarnica", JSON.stringify(denarnica));
     denarnicaOnChangeManual();*/

}