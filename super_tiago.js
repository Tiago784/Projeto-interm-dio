const loading = document.getElementById("loading")
const mycanvas = document.getElementById("mycanvas")
const ctx = mycanvas.getContext("2d")

const floor = 440
const passos = 10

let sceneId = 0

const cenarios = [
    {
        url: "imagens/super_tiago/cenario01_fundo.png",
        image: null
    },
    {
        url: "imagens/super_tiago/cenario02_fundo.png",
        image: null
    },
    {
        url: "imagens/super_tiago/cenario03_fundo.png",
        image: null
    }
]

const personagens = {
    pinguim: {
        url: "imagens/super_tiago/pinguim.png",
        image: null,
        x: 300,
        newx: 300
    }
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image()

        img.onload = () => resolve(img)
        img.onerror = reject

        img.src = url
    })
}

async function inicializar() {

    for (const cenario of cenarios) {
        cenario.image = await loadImage(cenario.url)
    }

    personagens.pinguim.image =
        await loadImage(personagens.pinguim.url)

    loading.style.display = "none"

    renderScene()
    loop()
}

function renderScene() {

    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height)

    ctx.drawImage(
        cenarios[sceneId].image,
        0,
        0
    )

    const pinguim = personagens.pinguim

    ctx.drawImage(
        pinguim.image,
        pinguim.x,
        floor - pinguim.image.height
    )
}

function updateActors() {

    const pinguim = personagens.pinguim

    if (pinguim.newx > pinguim.x) {

        const diff = pinguim.newx - pinguim.x

        pinguim.x += Math.min(diff, passos)

    } else if (pinguim.newx < pinguim.x) {

        const diff = pinguim.x - pinguim.newx

        pinguim.x -= Math.min(diff, passos)
    }
}

function loop() {

    updateActors()

    renderScene()

    requestAnimationFrame(loop)
}

addEventListener("keyup", (ev) => {

    if (ev.code === "ArrowRight") {

        if (sceneId < cenarios.length - 1) {
            sceneId++
        }

        renderScene()
    }

    if (ev.code === "ArrowLeft") {

        if (sceneId > 0) {
            sceneId--
        }

        renderScene()
    }
})

mycanvas.addEventListener("click", (ev) => {

    const bound = mycanvas.getBoundingClientRect()

    const x = ev.clientX - bound.left

    personagens.pinguim.newx = x
})

inicializar()