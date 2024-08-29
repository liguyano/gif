let quesnow=0;
let words;
let nedd_add="";
let rstart=0,rsize=0;
let wrongList=[];
let wrongTangoList=[];
let gettted=false;
let password=""
function retry() {
    $.post("/tango/add-wrong","type=Mean&wrong="+wrongList.toString()+"&wrongTango="+wrongTangoList.toString(),function (dat) {
        console.log(dat);
        alert(dat);
        $("input[value='retry']").hide();
    }).fail(function (xhr, status, info) {
        alert("add wrong tango failed time out at 10s");
        $("input[value='retry']").show();
    });
}
function genTimeBtn(dat) {
    dat=dat.replaceAll("[",'')
    dat=dat.replaceAll("]",'')
    let times=dat.split(',');

    console.log(times);
    let se=$("#time_select");
    for (let i = 0; i < times.length; i++) {
        se.append("<option value='"+times.at(i)+"'"+">"+times.at(i)+"</option>");
    }
}
function rorw(btn) {

    if (btn===1)
    {
        //do right thing
    }else
    {
        //do wrong thing
        wrongList[wrongList.length]=words[quesnow].id;
        wrongTangoList[wrongTangoList.length]=words[quesnow].spell;

    }
    if (quesnow===size-1)
    {
        console.log("all tango end");
        let tempList=wrongTangoList.toString();
        console.log("question: ",quesnow);
        //console.log("question: "+quesnow);
        if (wrongList.length>0)
        {    $.post("/tango/add-tango","words="+tempList+"&database=\"wrongMean\"",function (dat,sta) {
            alert("succed.");
        }).fail(function (xhr, status, info) {
            console.log(status);
            console.log(info);
            alert("time out at 3s. may be you can try again.");
        });
            $.ajaxSettings.timeout='10000';

            $.post("/tango/add-wrong","type=Mean&wrong="+wrongList.toString()+"&wrongTango="+wrongTangoList.toString(),function (dat) {
                console.log(dat);
            }).fail(function (xhr, status, info) {
                alert("add wrong tango failed time out at 10s");
                $("input[value='retry']").show();
            });
        }
        // $("#showMean").attr("src","/tango/tangoEnd.html?type=mean&wrongNum="+wrongList.length+"&allNum="+size);$("input[name=size]").val(rsize)
        $("input[name=start]").val(eval(rstart)+eval(rsize))
        document.cookie=$("#pre_ques_form").serialize()+";";
        window.location.href ="/tango/tangoEnd.html?type=mean&wrongNum="+wrongList.length+"&allNum="+size;
    }
    else
    {
        quesnow++;
        console.log(words[quesnow].spell)
        $("#showWord").html(words[quesnow].spell);
        $(".confir_btn").hide();
        $("#showMean").html("");
        $("#answer_btn").show();
    }
}
function get_time_list()
{
    let typeInput = $('#type');
    if ($("#datCheck").is(':checked'))
    {
        typeInput.val("date");
        $(".sheInput").hide();
        $(".datInput").show();
        if (gettted)
        {}
        else
        {
            $.get("/tango/spell-question","",function (dat,statues) {
                genTimeBtn(dat);gettted=true;
            }).fail(function (dat,xr,st) {
                alert("get time failed");
            });
        }


    }
    else
    {
        typeInput.val("id");
        $(".sheInput").show();
        $(".datInput").hide();
    }
}
function getDatabaseList() {
    $.get("/tango/database","",function (dat) {
        datbases=jQuery.parseJSON(dat);
        for (const datKey in datbases) {
            $("#tangoDatabase").append(new Option(datbases[datKey].dataBase,datbases[datKey].dataBase));
        }
    })
}
$(function () {

        get_time_list();
        getDatabaseList();
        $("#search-term").click(function () {
            console.log($("#search-inputw").val())
            $("#showMean").attr("src","/tangos/"+$("#search-inputw").val().toLowerCase().trim()+".html");

        })
        let cook=document.cookie.split("&")
        for (const string of cook) {
            console.log(string);
            let kv=string.split("=");
            if (kv[0]==="size"){
                $("input[name=size]").val(kv[1]);
                rsize=kv[1];
            }
            if (kv[0]==="start"){
                $("input[name=start]").val(kv[1])
                rstart=kv[1];
            }
        }
        $("#datCheck").change(function () {
            get_time_list();
        })
        $("input[value='retry']").hide();
        $(".confir_btn").hide();

        let isInt=true;
        $(".loadingImg").hide();
        $("#question_div").hide();
        $(".sheInput").focus(function () {
            if (isInt)
            {$(".sheInput").val("");
                isInt=false;}

        });
        $("#submit_btn").click(function ()
        {
            $(".loadingImg").show();
            document.cookie=$("#pre_ques_form").serialize()+";";
            $.ajaxSettings.timeout='10000';
            $.post("/tango/spell-question",$("#pre_ques_form").serialize(),function (dat,sat) {
                    console.log(dat);
                    words=jQuery.parseJSON(dat);
                    for (const d in words) {
                        let ww= words[d].spell.toLowerCase()
                        $.get("/tangos/"+ww+".html","",function (dats) {
                            words[d].meaning=dats;
                        })
                    }
                    size=words.length;
                    console.log(size);
                    console.log(words[quesnow]);
                    $("#showWord").html(words[quesnow].spell);

                    $("#spell_area").val("");
                    $("#question_div").show();
                    $("#pre_ques_form").hide();
                    $(".loadingImg").hide();
                }
            ).fail(function (xhr, status, info) {
                console.log(status);
                console.log(info);
                alert("time out at 10s. may be you can try again.\n"+info);
                $(".loadingImg").hide();
            });
        });
        $("#answer_btn").click(function () {
            let tem=quesnow;
            $("#answer_btn").hide();
            $(".confir_btn").show();
            $("#showMean").attr("src","/tangos/"+words[quesnow].spell.toLowerCase()+".html");
        })
//$("#tango_table").append("<tr class='word_tr'><td class='word_td'><input type='text' value='hello'></td></tr>");

        $("#delete-btn").click(function () {
            if (password.length<1)
            {
                password= prompt("password pls");
            }
            let tangoId= words[quesnow].id;
            $.post("/tango/del-tango","password="+password+"&tangoId="+tangoId,function (dat) {
                console.log(dat)
            })
        });
        $("#add_btn").click(function () {
            $.post("/tango/add-tango","words="+$("#search-inputw").val()+"&database=\"netAdd\"",function (dat,sta) {
                alert("succed.");
            })
        })
    }
)