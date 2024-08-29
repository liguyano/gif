let quesnow=0;
let words;
let nedd_add="";
let size;
let wrongList=[];
let wrongTangoList=[];
let gettted=false;
function genTimeBtn(dat) {
    dat=dat.replaceAll("[",'')
    dat=dat.replaceAll("]",'')
   /* dat=dat.slice(1, -1);
   * 去掉第一个和最后一个元素
   * */
    let times=dat.split(',');

    console.log(times);
    let se=$("#time_select");
    for (let i = 0; i < times.length; i++) {
        se.append("<option value='"+times.at(i)+"'"+">"+times.at(i)+"</option>");
    }
}
function retry() {
    let tempList=wrongTangoList.toString();
    $.post("/tango/add-tango","words="+tempList+"&database=\"wrongSpell\"",function (dat,sta) {
        alert("succed.");
    }).fail(function (xhr, status, info) {
        console.log(status);
        console.log(info);
        alert("time out at 3s. may be you can try again.");
    });
    $.post("/tango/add-wrong","type=Spell&wrong="+wrongList.toString(),function (dat) {
        console.log(dat);
        alert(dat);
    }).fail(function (xhr, status, info) {
        alert("add wrong tango failed time out at 10s");
        $("input[value='retry']").show();
    });
}
function rorw() {

    if ($("#showWord").val().toUpperCase()===words[quesnow].spell.toUpperCase())
    {
        //do right thing
    }else
    {
        alert("you wrong right is \n "+words[quesnow].spell+"you are\n" +$("#showWord").val());
        //do wrong thing
        wrongList[wrongList.length]=words[quesnow].id;
        wrongTangoList[wrongTangoList.length]=words[quesnow].spell;
    }
    if (quesnow===size-1)
    {
        console.log("question: ",quesnow);
        //console.log("question: "+quesnow);
        if (wrongList.length>0)
        {$.ajaxSettings.timeout='10000';
            retry();
        }
        //$("#showMean").html("all over <br/>"+"<a href='/tango/tango.html'>click here to start a new one</a>");
        window.location.href ="/tango/tangoEnd.html?type=spell&wrongNum="+wrongList.length+"&allNum="+size;
    }
    else
    {
        quesnow++;
        console.log(words[quesnow].id);
      //  $("#showMean").html(words[quesnow].meaning);
        $("#showMean").attr("src","/tangos/"+words[quesnow].spell.toLowerCase()+".html?type=spell");

    }
    $("#showWord").val("");
    $("#showWord").focus();
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

    getDatabaseList()
    get_time_list()
        let cook=document.cookie.split("&")
        for (const string of cook) {
            console.log(string)
            let kv=string.split("=")
            if (kv[0]==="size"){
                $("input[name=size]").val(kv[1])
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
            $.ajaxSettings.timeout='10000';
            $.post("/tango/spell-question",$("#pre_ques_form").serialize(),function (dat,sat) {
                    console.log(dat);
                    words=jQuery.parseJSON(dat);
                   // $("#showMean").html(words[quesnow].meaning);
                    $("#showMean").attr("src","/tangos/"+words[quesnow].spell.toLowerCase()+".html?type=spell");
                    size=words.length;
                    console.log(size);
                    console.log(words[quesnow]);
                    $("#spell_area").val("");
                    $(".examples").hide();
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
            rorw();
        })
//$("#tango_table").append("<tr class='word_tr'><td class='word_td'><input type='text' value='hello'></td></tr>");

    }
)