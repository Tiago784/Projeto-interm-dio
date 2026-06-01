
const mycanvas = document.getElementById("mycanvas")
const ctx = mycanvas.getContext("2d")
const cenarios_fundos = [
    "imagens/super_tiago/cenario01_fundo.png",
    "imagens/super_tiago/cenario02_fundo.png",
    "imagens/super_tiago/cenario03_fundo.png"
]

function loadScene(id) {
    const cenario01_fundo = new Image()
    cenario01_fundo.src = cenarios_fundos[id];
    cenario01_fundo.onload = () => {
        ctx.drawImage(cenario01_fundo, 0, 0)
    }
}

let sceneId = 0
loadScene(sceneId)

addEventListener("keyup", (ev) => {
    if (ev.code === "ArrowRight") {
        if (sceneId < 2) sceneId = sceneId + 1
        loadScene(sceneId)
    }else if (ev.code === "ArrowLeft") {
        if (sceneId > 0) sceneId = sceneId - 1
        loadScene(sceneId)
    } 
})
const personagem = new Image();
personagem.src = "imagens/super_tiago/tiago.png";

let playerX = 100;
let playerY = 250;
let sceneId = 0;
desenharCena(sceneId);

addEventListener("keydown", (ev) => {

    if (ev.code === "ArrowRight") {
        playerX += 10;
    }

    if (ev.code === "ArrowLeft") {
        playerX -= 10;
    }

    if (ev.code === "ArrowUp") {
        playerY -= 10;
    }

    if (ev.code === "ArrowDown") {
        playerY += 10;
    }

    desenharCena(sceneId);
});
