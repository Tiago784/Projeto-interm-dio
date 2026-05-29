
const mycanvas = document.getElementById("mycanvas")
const ctx = mycanvas.getContext("2d")
const cenarios_fundos = [
    "imagens/super_tiago/cenario01_fundo.png",
    "imagens/super_tiago/cenario02_fundo.png",
    "imagens/super_tiago/cenario03_fundo.png"
]
const personagens = [
    "pinguim.png"
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
function loadCharacter(id) {
    const pinguim = new Image()
    pinguim.src = cenarios_fundos[id];
    pinguim.onload = () => {
        ctx.drawImage(pinguim, 0, 0)
    }
}