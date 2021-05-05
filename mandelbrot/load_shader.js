const canvas = document.getElementById('glslCanvas');

const max_fps = 60;

canvas.style.width = '100%';
canvas.style.height = '100%';

const pde = new glsl.Canvas(canvas);
const width = canvas.clientWidth;
const height = canvas.clientHeight;


const to_send = {
    x:-0.5,
    y:0,
    zoom:0.2,
}

let last_coo = {
    x:0,
    y:0
}

const smooth = {
    x:0,
    y:0
}


function getCursorPosition(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return {
        x:(x - width / 2) / width,
        y:-(y - height / 2) / height
    };
}


function mouseMoveHandler(whileMove, whileDown) {
    let inter;

    const endMove = function () {
        canvas.removeEventListener('mouseup', endMove);
        canvas.removeEventListener('mouseleave', endMove);
        canvas.removeEventListener('mousemove', whileMove);
        clearInterval(inter);
    };

    canvas.addEventListener('mousedown', function (event) {
        event.stopPropagation();
        canvas.addEventListener('mousemove', whileMove);
        canvas.addEventListener('mouseup', endMove);
        canvas.addEventListener('mouseleave', endMove);
        last_coo = getCursorPosition(event);
        last_coo.zoom = to_send.zoom;
        to_send.x = smooth.x + last_coo.x / to_send.zoom;
        to_send.y = smooth.y + last_coo.y / to_send.zoom;
        inter = setInterval(whileDown, 1000/max_fps);
    });
}

pde.setUniform("u_coo", to_send.x, to_send.y);
pde.setUniform("u_zoom", to_send.zoom);

mouseMoveHandler(
    function (event) {
        event.stopPropagation();
        const new_coo = getCursorPosition(event);
        to_send.x += last_coo.x / last_coo.zoom - new_coo.x / to_send.zoom;
        to_send.y += last_coo.y / last_coo.zoom - new_coo.y / to_send.zoom;
        last_coo = new_coo;
        last_coo.zoom = to_send.zoom;
    },
    function (){
        to_send.zoom *= 1.01;

        smooth.x -= (smooth.x - to_send.x)/20;
        smooth.y -= (smooth.y - to_send.y)/20;

        pde.setUniform("u_coo", smooth.x, smooth.y);
        pde.setUniform("u_zoom", to_send.zoom);
    }
);
