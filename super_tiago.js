const mycanvas = document.getElementById("mycanvas")
const ctx = mycanvas.getContext("2d")

const floor = 810
const passos = 5

let sceneId = 0

const cenarios = [
    new Image(),
    new Image(),
    new Image()
]

cenarios[0].src = "imagens/super_tiago/cenario01_fundo.png"
cenarios[1].src = "imagens/super_tiago/cenario02_fundo.png"
cenarios[2].src = "imagens/super_tiago/cenario03_fundo.png"

const pinguim = {
    image: new Image(),
    x: 300,
    destinoX: 300
}

pinguim.image.src = "imagens/super_tiago/pinguim.png"

function desenhar() {

    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height)

    if (cenarios[sceneId].complete) {
        ctx.drawImage(cenarios[sceneId], 0, 0)
    }

    if (pinguim.image.complete) {
        ctx.drawImage(
            pinguim.image,
            pinguim.x,
            floor - pinguim.image.height
        )
    }
}

function atualizar() {

    if (pinguim.x < pinguim.destinoX) {
        pinguim.x += Math.min(
            passos,
            pinguim.destinoX - pinguim.x
        )
    }

    if (pinguim.x > pinguim.destinoX) {
        pinguim.x -= Math.min(
            passos,
            pinguim.x - pinguim.destinoX
        )
    }
}

function loop() {
    atualizar()
    desenhar()
    requestAnimationFrame(loop)
}

mycanvas.addEventListener("click", (ev) => {

    const rect = mycanvas.getBoundingClientRect()

    pinguim.destinoX =
        ev.clientX - rect.left
})

window.addEventListener("keyup", (ev) => {

    if (ev.code === "ArrowRight") {
        if (sceneId < 2) {
            sceneId++
        }
    }

    if (ev.code === "ArrowLeft") {
        if (sceneId > 0) {
            sceneId--
        }
    }
})

window.onload = () => {
    loop()
}