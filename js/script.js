let img, watermark, imgX = 0, imgY = 0, imgScale = 1, dragging = false;

document.getElementById('imageInput').addEventListener('change', function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const file = this.files[0];
    const reader = new FileReader();

    watermark = new Image();
    watermark.src = 'assets/marca_dagua_aviacao7.png';

    reader.onload = function(e) {
        img = new Image();
        img.src = e.target.result;

        img.onload = function() {
            imgScale = parseFloat(document.getElementById('zoomRange').value);
            imgX = (canvas.width - img.width * imgScale) / 2;
            imgY = (canvas.height - img.height * imgScale) / 2 + parseFloat(document.getElementById('positionYRange').value);
            drawCanvas(ctx, canvas, img, watermark, imgX, imgY, imgScale);
        };

         // Mostra o botão de download
         const downloadBtn = document.getElementById('downloadBtn');
         downloadBtn.style.display = 'inline-flex'; // Mostra o botão
         console.log("Botão de download exibido"); // Verificação
    };

    reader.readAsDataURL(file);

    canvas.onmousedown = startDragging;
    canvas.onmousemove = dragImage;
    canvas.onmouseup = stopDragging;
    canvas.onmouseleave = stopDragging;

    document.getElementById('zoomRange').addEventListener('input', function() {
        imgScale = parseFloat(this.value);
        if (img) {
            imgX = (canvas.width - img.width * imgScale) / 2;
            imgY = (canvas.height - img.height * imgScale) / 2 + parseFloat(document.getElementById('positionYRange').value);
            drawCanvas(ctx, canvas, img, watermark, imgX, imgY, imgScale);
        }
    });

    document.getElementById('positionYRange').addEventListener('input', function() {
        if (img) {
            imgY = (canvas.height - img.height * imgScale) / 2 + parseFloat(this.value);
            drawCanvas(ctx, canvas, img, watermark, imgX, imgY, imgScale);
        }
    });
});

function drawCanvas(ctx, canvas, img, watermark, imgX, imgY, imgScale) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (img) {
        ctx.drawImage(img, imgX, imgY, img.width * imgScale, img.height * imgScale);
    }
    if (watermark) {
        const watermarkWidth = 1080;
        const watermarkHeight = watermark.height * (watermarkWidth / watermark.width);
        const posX = 0;
        const posY = canvas.height - watermarkHeight;
        ctx.globalAlpha = 1.0;
        ctx.drawImage(watermark, posX, posY, watermarkWidth, watermarkHeight);

       
    }
}

function startDragging(e) {
    const canvas = document.getElementById('canvas');
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (img && mouseX >= imgX && mouseX <= imgX + img.width * imgScale &&
        mouseY >= imgY && mouseY <= imgY + img.height * imgScale) {
        dragging = true;
    }
}

function dragImage(e) {
    if (dragging && img) {
        const canvas = document.getElementById('canvas');
        const rect = canvas.getBoundingClientRect();
        imgX = e.clientX - rect.left - img.width * imgScale / 2;
        imgY = e.clientY - rect.top - img.height * imgScale / 2;
        const ctx = canvas.getContext('2d');
        drawCanvas(ctx, canvas, img, watermark, imgX, imgY, imgScale);
    }
}

function stopDragging() {
    dragging = false;
}

document.getElementById('downloadBtn').addEventListener('click', function() {
    const canvas = document.getElementById('canvas');
    const link = document.createElement('a');
    link.download = 'foto-perfil-apoio-joaojorge.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});
