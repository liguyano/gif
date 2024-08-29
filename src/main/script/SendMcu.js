
let needShowDefault=false;


function uploadImage() {
    const fileInput = document.getElementById('imageFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('请选择一个文件！');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('文件上传成功！');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('文件上传失败！');
        });
}
function gifClick() {
    $("#imageFile").click();
}
function handleFileSelectGif(event) {
    const file = event.target.files[0];

    if (!file) {
        alert('请选择一个文件！');
        return;
    }
    const formData = new FormData();
    formData.append('image', file);
    // 显示上传状态
    const statusElement = document.getElementById('status');
    statusElement.textContent = '上传中...';
    $.post("/send","mess=ready",function (dat) {
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应错误');
                }
                return response.json();
            })
            .then(data => {
                statusElement.textContent = '文件上传成功！';
                console.log('Success:', data);
            })
            .catch((error) => {
                statusElement.textContent = '文件上传基本成功！';
                console.error('Error:', error);
            });
    })

}
$(function () {
  $.post("/notsend","mess=ready",function (dat) {
    console.log(dat);
  })
    document.getElementById('imageFile').addEventListener('change', handleFileSelectGif, false);
    let eyeBtns=$(".eyeBtn");
    eyeBtns.click(function () {
        console.log("clicked")
        console.log($(this).text())
        $.post("/eye","eye="+$(this).text(),function () {
            console.log("sent");
        })
    })
    $("#selectImgBtn").click(function () {
        $("#fileInput").trigger("click");
    })

    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const input = document.getElementById('fileInput');
    const downloadButton = document.getElementById('downloadButton');

    // 添加事件监听器，当用户选择文件时触发
    input.addEventListener('change', handleFileSelect, false);

    // 添加事件监听器，当用户点击下载按钮时触发
    downloadButton.addEventListener('click', downloadImage, false);

    function handleFileSelect(event) {
        if (needShowDefault){

        }else{
            $("#defaultImg").hide();
            $("#canvasRow").show();
        }
        // 获取选中的文件
        const file = event.target.files[0];
        if (!file) return;
        // 创建一个 FileReader 对象来读取文件
        const reader = new FileReader();

        // 当文件读取完成后，将图片绘制到 Canvas
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // 清除画布
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // 绘制图片
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                $('.image-canvas').each(function() {
                    const canvas = $(this)[0];
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                });

                dataURL = canvas.toDataURL('image/jpeg',0.4);
                console.log(dataURL);
                $.ajax({
                    type: 'POST',
                    url: '/upload-image', // Replace with your server endpoint
                    data: { imageData: dataURL },
                    success: function(response) {
                        console.log('Image uploaded successfully:', response);
                    },
                    error: function(error) {
                        console.error('Error uploading image:', error);
                    }
                });
            };
            img.src = e.target.result;
        };
        // 读取文件内容
        reader.readAsDataURL(file);
    }
})
