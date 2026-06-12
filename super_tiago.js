
const loading = document.getElementById("loading")
const mycanvas = document.getElementById("mycanvas")
const ctx = mycanvas.getContext("2d")
const cenarios_fundos = [
    "imagens/super_tiago/cenario01_fundo.png",
    "imagens/super_tiago/cenario02_fundo.png",
    "imagens/super_tiago/cenario03_fundo.png"
]
const personagens = {
    "pinguim": {
        "url": "imagens/super_tiago/pinguim.png",
        "image": null
    }
}

async function inicializar() {
    // carregar o pinguim
    personagens.pinguim.image = new Image()
    personagens.pinguim.image.src = personagens.pinguim.url
    personagens.pinguim.image.onload = () => {
        loading.style.display = "none"
        mycanvas.style.display = "block"
    }
}

async function loadScene(id) {
    const cenario01_fundo = new Image()
    cenario01_fundo.src = cenarios_fundos[id];
    cenario01_fundo.onload = () => {
        ctx.drawImage(cenario01_fundo, 0, 0)
    }
}

addEventListener("keyup", (ev) => {
    if (ev.code === "ArrowRight") {
        if (sceneId < 2) sceneId = sceneId + 1
        loadScene(sceneId)
    }else if (ev.code === "ArrowLeft") {
        if (sceneId > 0) sceneId = sceneId - 1
        loadScene(sceneId)
    } 
})
async function loadCharacter(x, y) {
    ctx.drawImage(personagens.pinguim.image, x, y)
}

mycanvas.addEventListener("click", (ev) => {
    const bound = mycanvas.getBoundingClientRect()
    const x = ev.clientX - bound.left
    const y = ev.clientY - bound.top
    console.log(x + " x " + y)
    loadScene(sceneId).then( () => {
        loadCharacter(x, y)
    })
})

let sceneId = 0
inicializar().then( () => {
    loadScene(sceneId)

})


