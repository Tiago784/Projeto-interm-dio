const mycanvas = document.getElementById("mycanvas")
const ctx = mycanvas.getContext("2d")

const floor = 399
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
    x: 300
}
pinguim.image.src = "imagens/super_tiago/seylah_idle.png"

const teclas = {
    a: false,
    d: false
}

const poco = {
    x: 420,
    largura: 50
}

const portaSubterranea = {
    x: 540,
    largura: 60
}

function desenhar() {

    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height)

    if (cenarios[sceneId].complete) {
        ctx.drawImage(cenarios[sceneId], 0, 0)
    }

    if (
        pinguim.image.complete &&
        pinguim.image.naturalWidth > 0
    ) {
        ctx.drawImage(
            pinguim.image,
            pinguim.x,
            floor - pinguim.image.height
        )
    }
}

function atualizar() {

    if (teclas.a) {
        pinguim.x -= passos
    }

    if (teclas.d) {
        pinguim.x += passos
    }

    if (pinguim.x < 0) {
        pinguim.x = 0
    }

    if (
        pinguim.image.complete &&
        pinguim.image.naturalWidth > 0
    ) {
        const limite =
            mycanvas.width - pinguim.image.width

        if (pinguim.x > limite) {
            pinguim.x = limite
        }
    }
}

function loop() {
    atualizar()
    desenhar()
    requestAnimationFrame(loop)
}

window.addEventListener("keydown", (ev) => {

    if (ev.key === "a" || ev.key === "A") {
        teclas.a = true
    }

    if (ev.key === "d" || ev.key === "D") {
        teclas.d = true
    }
})

window.addEventListener("keyup", (ev) => {

    if (ev.key === "a" || ev.key === "A") {
        teclas.a = false
    }

    if (ev.key === "d" || ev.key === "D") {
        teclas.d = false
    }

    if (ev.code === "ArrowDown") {

        const juntoAoPoco =
            pinguim.x >= poco.x &&
            pinguim.x <= poco.x + poco.largura

        if (sceneId === 0 && juntoAoPoco) {

            sceneId = 1
            pinguim.x = 80
        }
    }

    if (ev.code === "ArrowUp") {

        if (sceneId === 1) {

            sceneId = 0
            pinguim.x = 430
        }
    }

    if (ev.code === "ArrowRight") {

        const juntoDaPorta =
            pinguim.x >= portaSubterranea.x &&
            pinguim.x <= portaSubterranea.x + portaSubterranea.largura

        if (sceneId === 1 && juntoDaPorta) {

            sceneId = 2
            pinguim.x = 80
        }
    }

    if (ev.code === "ArrowLeft") {

        if (sceneId === 2) {

            sceneId = 1
            pinguim.x = 520
        }
    }
})

window.onload = () => {
    loop()
}