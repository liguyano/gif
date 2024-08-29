$(function () {
    console.log("succed")
    // 创建一个新的URLSearchParams对象
    var searchParams = new URLSearchParams(window.location.search);

    let wr=0;
    let all=10;
// 或者遍历所有参数
    for (var [key, value] of searchParams.entries()) {
        console.log(key + ": " + value);
        if (key==="type")
        {
            if (value==="spell")
            {
                $("#backLink").attr("href","/tango/spell.html")
            }else
            {
                $("#backLink").attr("href","/tango/tango.html")
            }

        }
        if (key==="wrongNum")
        {
            wr=value;
        }
        if (key==="allNum")
        {
            all=value;
        }
    }
    $("#quiz_result").text(wr +" out of "+all);
})