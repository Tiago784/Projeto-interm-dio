const mycanvas = document.getElementById("mycanvas")
const ctx = mycanvas.getContext("2d")

const floor = 399
const passos = 5
const gravidade = 0.6
const forcaSalto = -12

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
    y: floor - 83,
    largura: 64,
    altura: 83,
    velocidadeY: 0,
    noChao: true
}

seylah.image.src = "imagens/seylah_idle.png"

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

    if (seylah.image.complete) {
        ctx.drawImage(
            seylah.image,
            seylah.x,
            seylah.y,
            seylah.largura,
            seylah.altura
        )
    }
}

function atualizar() {

    // Movimento horizontal
    if (teclas.a) {
        seylah.x -= passos
    }

    if (teclas.d) {
        seylah.x += passos
    }

    // Gravidade
    seylah.velocidadeY += gravidade
    seylah.y += seylah.velocidadeY

    // Chão
    const yChao = floor - seylah.altura

    if (seylah.y >= yChao) {
        seylah.y = yChao
        seylah.velocidadeY = 0
        seylah.noChao = true
    } else {
        seylah.noChao = false
    }

    // Limites
    if (seylah.x < 0) {
        seylah.x = 0
    }

    if (seylah.x > mycanvas.width - seylah.largura) {
        seylah.x = mycanvas.width - seylah.largura
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

    // W para saltar
    if (
        (ev.key === "w" || ev.key === "W") &&
        seylah.noChao
    ) {
        seylah.velocidadeY = forcaSalto
        seylah.noChao = false
    }
})

window.addEventListener("keyup", (ev) => {

    if (ev.key === "a" || ev.key === "A") {
        teclas.a = false
    }

    if (ev.key === "d" || ev.key === "D") {
        teclas.d = false
    }

    // Entrar no poço
    if (ev.code === "ArrowDown") {

        const juntoAoPoco =
            seylah.x >= poco.x &&
            seylah.x <= poco.x + poco.largura

        if (sceneId === 0 && juntoAoPoco) {

            sceneId = 1

            seylah.x = 80
            seylah.y = floor - seylah.altura
        }
    }

    // Sair do poço
    if (ev.code === "ArrowUp") {

        if (sceneId === 1) {

            sceneId = 0

            seylah.x = 430
            seylah.y = floor - seylah.altura
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
            seylah.y = floor - seylah.altura
        }
    }

    // Voltar
    if (ev.code === "ArrowLeft") {

        if (sceneId === 2) {

            sceneId = 1

            seylah.x = 520
            seylah.y = floor - seylah.altura
        }
    }
})

window.onload = () => {
    loop()
}