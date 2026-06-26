const run1 = new Image()
run1.src = "imagens/super_tiago/run1.png"

run1.onload = () => console.log("RUN1 OK")
run1.onerror = () => console.log("RUN1 ERRO")

const mycanvas = document.getElementById("mycanvas")
const ctx = mycanvas.getContext("2d")

const floor = 399
const passos = 1

const gravidade = 0.6
const forcaSalto = -15

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
    noChao: false,
    direcao: 1
}

pinguim.image.src = "imagens/super_tiago/seylah_idle.png"

// Frames de corrida (run1.png até run5.png)
const runFrames = []
for (let i = 1; i <= 5; i++) {
    const img = new Image()
    img.src = `imagens/super_tiago/run${i}.png`
    runFrames.push(img)
}

// Frames de pulo — se não tiver sprites separados,
// reutiliza os frames de corrida automaticamente
const jumpFrames = []
for (let i = 1; i <= 5; i++) {
    const img = new Image()
    img.src = `imagens/super_tiago/jump${i}.png`
    img.onerror = () => {
        // Se não carregar, marca como inválido
        img.dataset.falhou = "true"
    }
    jumpFrames.push(img)
}

let frameAtual = 0
let contadorAnimacao = 0

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

    if (pinguim.image.complete && pinguim.image.naturalWidth > 0) {

        // Escolhe o sprite correto conforme o estado do personagem
        let sprite

        if (!pinguim.noChao) {
            // No ar → tenta usar frame de pulo, senão usa corrida
            const jf = jumpFrames[frameAtual]
            if (jf && jf.complete && jf.naturalWidth > 0 && !jf.dataset.falhou) {
                sprite = jf
            } else {
                sprite = runFrames[frameAtual]
            }
        } else if (teclas.a || teclas.d) {
            // No chão e em movimento → animação de corrida
            sprite = runFrames[frameAtual]
        } else {
            // Parado → idle
            sprite = pinguim.image
        }

        // Garante que o sprite escolhido está carregado; senão usa idle
        if (!sprite || !sprite.complete || sprite.naturalWidth === 0) {
            sprite = pinguim.image
        }

        ctx.save()

        if (pinguim.direcao === -1) {
            // Espelha horizontalmente sem deslocar a posição
            ctx.translate(pinguim.x + sprite.width, 0)
            ctx.scale(-1, 1)
            ctx.drawImage(sprite, 0, pinguim.y)
        } else {
            ctx.drawImage(sprite, pinguim.x, pinguim.y)
        }

        ctx.restore()
    }
}

function obterChao(x) {
    return 399
}

function atualizar() {

    if (teclas.a) {
        pinguim.x -= passos
        pinguim.direcao = -1
    }

    if (teclas.d) {
        pinguim.x += passos
        pinguim.direcao = 1
    }

    pinguim.velocidadeY += gravidade
    pinguim.y += pinguim.velocidadeY

    if (pinguim.image.complete && pinguim.image.naturalWidth > 0) {

        const chao = obterChao(pinguim.x + pinguim.image.width / 2)
        const yChao = chao - pinguim.image.height

        if (pinguim.y >= yChao) {
            pinguim.y = yChao
            pinguim.velocidadeY = 0
            pinguim.noChao = true
        } else {
            pinguim.noChao = false
        }

        const limite = mycanvas.width - pinguim.image.width

        if (pinguim.x > limite) {
            pinguim.x = limite
        }
    }

    if (pinguim.x < 0) {
        pinguim.x = 0
    }

    // Anima quando em movimento OU quando no ar (pulo)
    if (teclas.a || teclas.d || !pinguim.noChao) {
        contadorAnimacao++
        if (contadorAnimacao >= 10) {
            contadorAnimacao = 0
            frameAtual++
            if (frameAtual >= runFrames.length) {
                frameAtual = 0
            }
        }
    } else {
        // Parado no chão → reseta animação para idle
        frameAtual = 0
        contadorAnimacao = 0
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
        console.log("saltou")
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
})

window.onload = () => {
    loop()
}