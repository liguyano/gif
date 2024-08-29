
function playAudio(file) {
    console.log(file)
    var audio =file
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}
let audioId=0;
$(function () {
    try {
        let entries = $(".crossRef");
        entries.each(function(index, element) {
            let entry=$(element).attr("href").split("//:")[1]
            console.log($(element).attr("href"));
            $(element).attr("href",entry);
        });
    }catch (e) {
        console.log("erro when replace enrty")
    }

    console.log("succed")
    // 创建一个新的URLSearchParams对象
    var searchParams = new URLSearchParams(window.location.search);
    let playImg=$("img[src='pron.png']")
    for (const playImgKey in playImg) {
        try {
            let $playImgElement = $(playImg[playImgKey]);
            console.log($playImgElement);
            let $a = $playImgElement.parent();
            console.log($a.attr("href"));
            let mp3File = $a.attr("href").split("//")[1];
            console.log(mp3File);
            // 创建并添加audio元素
            let audioHtml = "<audio autoplay controls id='mp3" + audioId + "'>" +
                "    <source src='" + mp3File + "' type='audio/mpeg'>" +
                "    Your browser does not support the audio element." +
                "</audio>";
            $a.append(audioHtml);
            $("#mp3"+audioId).hide();
            // 阻止a标签的默认跳转行为并添加点击事件
            $a.attr("href", "javascript:void(0);");
            $a.attr("onclick","playAudio(mp3"+audioId+")");
            audioId++;
        }catch (e) {
            console.log("erro when play audio")
        }

    }
    for (var [key, value] of searchParams.entries()) {
        console.log(key + ": " + value);
        if (key==="type")
        {
            if (value==="spell")
            {
                $(".Head").hide();
                $(".Examples").hide();
                $(".AMEPRON").hide();
                $(".Inflection").hide();
                $(".Patternbox").hide();
                $(".Lexubox").hide();
                $(".Tail").hide();
            }
        }
    }
})