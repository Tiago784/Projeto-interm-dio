const mycanvas = document.getElementById("mycanvas")
const ctx = mycanvas.getContext("2d")

const floor = 394
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

// zonas de transição
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

    // Entrar no poço
    if (ev.code === "ArrowDown") {

        const juntoAoPoco =
            pinguim.x >= poco.x &&
            pinguim.x <= poco.x + poco.largura

        if (sceneId === 0 && juntoAoPoco) {

            sceneId = 1

            pinguim.x = 80
            pinguim.destinoX = 80
        }
    }

    // Sair do poço
    if (ev.code === "ArrowUp") {

        if (sceneId === 1) {

            pinguim.x = 430
            pinguim.destinoX = 430

            sceneId = 0
        }
    }

    // Entrar na porta do cenário 2
    if (ev.code === "ArrowRight") {

        const juntoDaPorta =
            pinguim.x >= portaSubterranea.x &&
            pinguim.x <= portaSubterranea.x + portaSubterranea.largura

        if (sceneId === 1 && juntoDaPorta) {

            sceneId = 2

            pinguim.x = 80
            pinguim.destinoX = 80
        }
    }

    // Voltar do cenário 2
    if (ev.code === "ArrowLeft") {

        if (sceneId === 2) {

            sceneId = 1

            pinguim.x = 520
            pinguim.destinoX = 520
        }
    }
})

window.onload = () => {
    loop()
}