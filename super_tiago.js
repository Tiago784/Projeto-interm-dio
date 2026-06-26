const mycanvas = document.getElementById("mycanvas")
const ctx = mycanvas.getContext("2d")

const floor = 399
const passos = 5

const gravidade = 0.6
const forcaSalto = -15
const run1 = new Image()
run1.src = "imagens/super_tiago/run1.png"

run1.onload = () => {
    console.log("RUN1 CARREGADA")
}

run1.onerror = () => {
    console.log("ERRO RUN1")
}
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
    y: 0,
    velocidadeY: 0,
    noChao: false
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

pinguim.image.onload = () => {
    pinguim.y = floor - pinguim.image.height
    pinguim.noChao = true
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
            pinguim.y
        )
    }
}

function obterChao(x) {

    // plataforma esquerda
    if (x < 160) {
        return 320
    }

    // parte central
    if (x < 500) {
        return 400
    }

    // zona da porta
    return 360
}

function atualizar() {

    if (teclas.a) {
        pinguim.x -= passos
    }

    if (teclas.d) {
        pinguim.x += passos
    }

    pinguim.velocidadeY += gravidade
    pinguim.y += pinguim.velocidadeY

    if (
        pinguim.image.complete &&
        pinguim.image.naturalWidth > 0
    ) {

        const chao = obterChao(
            pinguim.x + pinguim.image.width / 2
        )

        const yChao =
            chao - pinguim.image.height

        if (pinguim.y >= yChao) {

            pinguim.y = yChao
            pinguim.velocidadeY = 0
            pinguim.noChao = true
        } else {

            pinguim.noChao = false
        }

        const limite =
            mycanvas.width - pinguim.image.width

        if (pinguim.x > limite) {
            pinguim.x = limite
        }
    }

    if (pinguim.x < 0) {
        pinguim.x = 0
    }
}

function loop() {
    atualizar()
    desenhar()
    requestAnimationFrame(loop)
}

window.addEventListener("keydown", (ev) => {

    if (ev.code === "KeyA") {
        teclas.a = true
    }

    if (ev.code === "KeyD") {
        teclas.d = true
    }

    if (ev.code === "KeyW" && pinguim.noChao) {
        pinguim.velocidadeY = forcaSalto
        pinguim.noChao = false
    }
})

window.addEventListener("keyup", (ev) => {

    if (ev.code === "KeyA") {
        teclas.a = false
    }

    if (ev.code === "KeyD") {
        teclas.d = false
    }

    // Entrar no poço
    if (ev.code === "ArrowDown") {

        const juntoAoPoco =
            pinguim.x >= poco.x &&
            pinguim.x <= poco.x + poco.largura

        if (sceneId === 0 && juntoAoPoco) {

            sceneId = 1

            pinguim.x = 80
        }
    }

    // Sair do poço
    if (ev.code === "ArrowUp") {

        if (sceneId === 1) {

            sceneId = 0

            pinguim.x = 430
        }
    }

    // Entrar na porta
    if (ev.code === "ArrowRight") {

        const juntoDaPorta =
            pinguim.x >= portaSubterranea.x &&
            pinguim.x <= portaSubterranea.x + portaSubterranea.largura

        if (sceneId === 1 && juntoDaPorta) {

            sceneId = 2

            pinguim.x = 80
        }
    }

    // Voltar
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