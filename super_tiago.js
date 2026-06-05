
const mycanvas = document.getElementById("mycanvas")
const ctx = mycanvas.getContext("2d")
const cenarios_fundos = [
    "imagens/super_tiago/cenario01_fundo.png",
    "imagens/super_tiago/cenario02_fundo.png",
    "imagens/super_tiago/cenario03_fundo.png"
]
const personagens = {
    "pinguim": "imagens/super_tiago/pinguim.png"
}
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

function loadCharacter(x, y) {
    const pinguim = new Image()
    pinguim.src = personagens.pinguim
    pinguim.onload = () => {
        ctx.drawImage(pinguim, x, y)
    }
}

mycanvas.addEventListener("click", (ev) => {
    const bound = mycanvas.getBoundingClientRect()
    const x = ev.clientX - bound.left
    const y = ev.clientY - bound.top
    console.log(x + " x " + y)
    loadScene(sceneId)
    loadCharacter(x, y)
})