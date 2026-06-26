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

const seylah = {
    image: new Image(),
    x: 300,
    destinoX: 300,
    largura: 80,
    altura: 104
}

seylah.image.src = "imagens/seylah_idle.png"

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

    if (seylah.image.complete) {

        ctx.drawImage(
            seylah.image,
            seylah.x,
            floor - seylah.altura,
            seylah.largura,
            seylah.altura
        )
    }
}

function atualizar() {

    if (seylah.x < seylah.destinoX) {

        seylah.x += Math.min(
            passos,
            seylah.destinoX - seylah.x
        )
    }

    if (seylah.x > seylah.destinoX) {

        seylah.x -= Math.min(
            passos,
            seylah.x - seylah.destinoX
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

    seylah.destinoX =
        ev.clientX - rect.left
})

window.addEventListener("keyup", (ev) => {

    // Entrar no poço
    if (ev.code === "ArrowDown") {

        const juntoAoPoco =
            seylah.x >= poco.x &&
            seylah.x <= poco.x + poco.largura

        if (sceneId === 0 && juntoAoPoco) {

            sceneId = 1

            seylah.x = 80
            seylah.destinoX = 80
        }
    }

    // Sair do poço
    if (ev.code === "ArrowUp") {

        if (sceneId === 1) {

            seylah.x = 430
            seylah.destinoX = 430

            sceneId = 0
        }
    }

    // Entrar na porta
    if (ev.code === "ArrowRight") {

        const juntoDaPorta =
            seylah.x >= portaSubterranea.x &&
            seylah.x <= portaSubterranea.x + portaSubterranea.largura

        if (sceneId === 1 && juntoDaPorta) {

            sceneId = 2

            seylah.x = 80
            seylah.destinoX = 80
        }
    }

    // Voltar
    if (ev.code === "ArrowLeft") {

        if (sceneId === 2) {

            sceneId = 1

            seylah.x = 520
            seylah.destinoX = 520
        }
    }
})

window.onload = () => {
    loop()
}