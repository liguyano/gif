let loadImg= {}
let all_tango=[];

function genTimeBtn(dat) {
 let times=dat.split(',');
 console.log(times);
 let se=$("#time_select");
    for (let i = 0; i < times.length; i++) {
        se.append("<option value='"+times.at(i)+"'"+">"+times.at(i)+"</option>");
    }
}
function hidemean() {
    $("#showMean").hide();
}
function show_meaning(which) {
    $("#hide_btn").show();
    $("#showMean").show();
$("#showMean").html(all_tango[which]);
}
function getTangoByTime() {
    $.ajaxSettings.timeout='10000';
    $(".loadingImg").show();
    let main_table=$("#wrong_table");
    $.post("/tango/WrongList",$("#time_form").serialize(),function (dat) {
        console.log(dat);
        let tangos=jQuery.parseJSON(dat)
        for (let i = 0; i <tangos.length ; i++) {
            let id=tangos.at(i).id;
            let meaning=tangos.at(i).meaning;
            all_tango[id]=meaning
            main_table.append("<tr><td>"+tangos.at(i).id+"</td>"+"<td>"+tangos.at(i).spell+"</td>"+"<td>"+"<input type='button" +
                "' value='show mean' onclick='show_meaning(" +id+
                ")'/>"+"</td>"+"</tr>");
        }
        let timeSe=$("#time_select");
        $("option[value='"+timeSe.val()+"']").remove();
        //timeSe.val(timeSe.children()[0].val());
       // $(".loadingImg").hide();
    }).fail(function (xhr, status, info) {
        console.log(info);
        console.log(status);
    }).always(function () {
        $(".loadingImg").hide();
    })

}
function getTimeList() {
    $.ajaxSettings.timeout='10000';
    $(".loadingImg").show();
    $.get("/tango/WrongList","",function (dat) {
        dat=dat.replaceAll('[','');
        dat=dat.replaceAll(']','');
        genTimeBtn(dat)
        $("#re_get_list_button").hide();
        $("#start").show();
    }).fail(function (xhr, status, info) {
        console.log(info);
        console.log(status);
        $("#re_get_list_button").show();
    }).always(function () {
        $(".loadingImg").hide();
    })
}
$(function () {
    $("#start").hide();
    $(".loadingImg").hide();
    $("#re_get_list_button").hide()
    getTimeList();
})