
const loading = document.getElementById("loading")
const mycanvas = document.getElementById("mycanvas")
const ctx = mycanvas.getContext("2d")
const cenarios = [
    {
        url: "imagens/super_tiago/cenario01_fundo.png",
    },
    {
        url: "imagens/super_tiago/cenario02_fundo.png",
    },
    {
        url: "imagens/super_tiago/cenario03_fundo.png"
    }
]
const personagens = {
    "pinguim": {
        "url": "imagens/super_tiago/pinguim.png",
        "image": null
    }
}

async function inicializar() {
    // carregar os fundos
    cenarios[0].image = new Image()
    cenarios[0].image.src = cenarios[0].url
    await cenarios[0].image.decode()
    cenarios[1].image = new Image()
    cenarios[1].image.src = cenarios[1].url
    await cenarios[1].image.decode()
    cenarios[2].image = new Image()
    cenarios[2].image.src = cenarios[2].url
    await cenarios[2].image.decode()
    // carregar o pinguim
    personagens.pinguim.image = new Image()
    personagens.pinguim.image.src = personagens.pinguim.url
    personagens.pinguim.image.onload = () => {
        loading.style.display = "none"
        mycanvas.style.display = "block"
    }
}

async function loadScene(id) {
    ctx.drawImage(cenarios[id].image, 0, 0)
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
    ctx.drawImage(cenarios[sceneId].image, 0, 0)
    ctx.drawImage(personagens.pinguim.image, x, y)
}




mycanvas.addEventListener("click", (ev) => {
    const bound = mycanvas.getBoundingClientRect()
    const x = ev.clientX - bound.left
    const y = ev.clientY - bound.top
    console.log(x + " x " + y)
    loadCharacter(x, y)
})
let sceneId = 0
inicializar().then( () => {
    console.log("carregar fundo")
    loadScene(sceneId)
})



async function loadCharacter(x, y) {
    x = 320
    y = 240
    ctx.drawImage(cenarios[sceneId].image, 0, 0)
    ctx.drawImage(personagens.pinguim.image, x, y)
}

