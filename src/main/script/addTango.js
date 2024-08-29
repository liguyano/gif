$(function () {
    $("#need_input").innerHTML="";
$("#submitTango").click(function () {
   // alert($("#need_input").val());
    $(".loadingImg").show();
    $.ajaxSettings.timeout='3000';
    $("#need_input").hide();
    $.post("/tango/add-tango","words="+$("#need_input").val()+"&database=\"netAdd\"",function (dat,sta) {
        alert("succed.");
        $("#need_input").innerHTML="";
    }).fail(function (xhr, status, info) {
        console.log(status);
        console.log(info);
        alert("time out at 3s. may be you can try again.");
        $(".loadingImg").hide();
    }).always(function (jqXHR, textStatus) {
        $(".loadingImg").hide();
        $("#need_input").show();
    });

});
})