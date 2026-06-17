let allowedPan = false

function enableZoomPan(canvas, image) {
    const ctx = canvas.getContext("2d");

    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;

    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    function redraw() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
        ctx.drawImage(image, 0, 0);
    }

    canvas.addEventListener("wheel", (e) => {
        e.preventDefault();

        const zoomFactor = 1.1;

        const worldX = (e.offsetX - offsetX) / scale;
        const worldY = (e.offsetY - offsetY) / scale;

        scale *= e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;

        offsetX = e.offsetX - worldX * scale;
        offsetY = e.offsetY - worldY * scale;
        zoom *= zoomFactor;
        redraw();
    });

    canvas.addEventListener("mousedown", (e) => {
        if (allowedPan) {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });

    window.addEventListener("mousemove", (e) => {
        if (allowedPan) {
            if (!isDragging) return;

            offsetX += e.clientX - lastX;
            offsetY += e.clientY - lastY;

            x0 -= (e.clientX - lastX) / zoom;
            y0 -= (e.clientY - lastY) / zoom;

            lastX = e.clientX;
            lastY = e.clientY;

            redraw();

        }
    });

    window.addEventListener("mouseup", () => {
        if (allowedPan) {
            isDragging = false;
        }
    });

    redraw();

    return {
        redraw,
        reset() {
            scale = 1;
            offsetX = 0;
            offsetY = 0;
            redraw();
        }
    };
}