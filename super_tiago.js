const mycanvas = document.getElementById("mycanvas")
const ctx = mycanvas.getContext("2d")

const passos = 3
const gravidade = 0.6
const forcaSalto = -15

let sceneId = 0

// ── Cenários ────────────────────────────────────────────
const cenarios = [new Image(), new Image()]
cenarios[0].src = "imagens/super_tiago/cenario01_fundo.png"
cenarios[1].src = "imagens/super_tiago/cenario02_fundo.png"

// ── Sprites ─────────────────────────────────────────────
const idleImg = new Image()
idleImg.src = "imagens/super_tiago/seylah_idle.png"
idleImg.onload  = () => posicionarNoInicio()
idleImg.onerror = () => console.error("ERRO: seylah_idle.png nao carregou")

const runFrames = []
for (let i = 1; i <= 5; i++) {
    const img = new Image()
    img.src = "imagens/super_tiago/run" + i + ".png"
    runFrames.push(img)
}

// ── Personagem ───────────────────────────────────────────
const pinguim = {
    x: 0,
    y: 0,
    velocidadeY: 0,
    noChao: false,
    direcao: 1
}

// ── Plataformas por cenário ──────────────────────────────
// Cenário 1 (interior, 640x480)
// Corda ao centro ~x=265-295, chão principal ~y=210
// Degraus na caixa esquerda, corredor do meio, sala direita
const plataformasCenario1 = [
    // Chão principal esquerdo (antes da caixa)
    { xInicio:   0, xFim: 165, y: 210 },

    // Degraus dentro da caixa esquerda (visíveis na imagem)
    { xInicio:  40, xFim: 155, y: 305 },
    { xInicio:  40, xFim: 155, y: 285 },
    { xInicio:  40, xFim: 155, y: 265 },
    { xInicio:  40, xFim: 155, y: 245 },
    { xInicio:  40, xFim: 155, y: 225 },

    // Chão do corredor do meio
    { xInicio: 165, xFim: 265, y: 210 },

    // Após a corda (lado direito)
    { xInicio: 295, xFim: 500, y: 210 },

    // Abertura/sala direita (nível mais baixo)
    { xInicio: 500, xFim: 530, y: 250 },
    { xInicio: 530, xFim: 640, y: 210 },
]

// Cenário 2 (exterior noite, 640x480)
// Chão geral ~y=390, abertura na zona da corda ~x=430-470
const plataformasCenario2 = [
    // Chão contínuo à esquerda (inclui zona da casa)
    { xInicio:   0, xFim: 420, y: 390 },

    // Após a abertura da corda
    { xInicio: 470, xFim: 640, y: 390 },
]

// Poços por cenário: zona onde premir S muda de cenário
const pocos = [
    { xInicio: 265, xFim: 295, destinoCenario: 1 },  // Cenário 1 → 2
]

function plataformasAtuais() {
    return sceneId === 0 ? plataformasCenario1 : plataformasCenario2
}

// Posições de início por cenário (em cima da corda)
const iniciosPorCenario = [
    { x: 265, y: 150 },   // Cenário 1: ao lado da corda
    { x: 420, y: 320 },   // Cenário 2: ao lado da corda exterior
]

function posicionarNoInicio() {
    const alturaSprite = spriteOk(idleImg) ? idleImg.height : 64
    const inicio = iniciosPorCenario[sceneId]
    pinguim.x = inicio.x
    pinguim.y = inicio.y - alturaSprite
    pinguim.noChao = false
    pinguim.velocidadeY = 0
}

// Devolve o y do chão para uma dada posição x
function obterChao(x) {
    let melhorY = 999
    for (let p of plataformasAtuais()) {
        if (x >= p.xInicio && x <= p.xFim) {
            if (p.y < melhorY) melhorY = p.y
        }
    }
    return melhorY
}

// ── Animação ─────────────────────────────────────────────
let frameAtual = 0
let contadorAnimacao = 0

const teclas = { a: false, d: false, s: false }

function spriteOk(img) {
    return img && img.complete && img.naturalWidth > 0
}

// ── Desenhar ─────────────────────────────────────────────
function desenhar() {
    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height)

    if (spriteOk(cenarios[sceneId])) {
        ctx.drawImage(cenarios[sceneId], 0, 0)
    } else {
        ctx.fillStyle = "#1a2a5e"
        ctx.fillRect(0, 0, mycanvas.width, mycanvas.height)
    }

    let sprite = idleImg
    if (!pinguim.noChao || teclas.a || teclas.d) {
        const rf = runFrames[frameAtual]
        if (spriteOk(rf)) sprite = rf
    }

    if (!spriteOk(sprite)) {
        ctx.fillStyle = "red"
        ctx.fillRect(pinguim.x, pinguim.y, 48, 64)
        return
    }

    ctx.save()
    if (pinguim.direcao === -1) {
        ctx.translate(pinguim.x + sprite.width, 0)
        ctx.scale(-1, 1)
        ctx.drawImage(sprite, 0, pinguim.y)
    } else {
        ctx.drawImage(sprite, pinguim.x, pinguim.y)
    }
    ctx.restore()

    // Dica do poço
    const larguraSprite = spriteOk(idleImg) ? idleImg.width : 48
    const centroX = pinguim.x + larguraSprite / 2
    const poco = pocos.find(p => sceneId < p.destinoCenario && centroX >= p.xInicio && centroX <= p.xFim)
    if (poco && pinguim.noChao) {
        ctx.fillStyle = "white"
        ctx.font = "14px Arial"
        ctx.textAlign = "center"
        ctx.fillText("▼ S para descer", mycanvas.width / 2, 30)
    }
}

// ── Atualizar ─────────────────────────────────────────────
function atualizar() {
    if (teclas.a) { pinguim.x -= passos; pinguim.direcao = -1 }
    if (teclas.d) { pinguim.x += passos; pinguim.direcao =  1 }

    pinguim.velocidadeY += gravidade
    pinguim.y += pinguim.velocidadeY

    const alturaSprite = spriteOk(idleImg) ? idleImg.height : 64
    const larguraSprite = spriteOk(idleImg) ? idleImg.width : 48

    const chaoY = obterChao(pinguim.x + larguraSprite / 2)
    const yChao = chaoY - alturaSprite

    if (pinguim.y >= yChao) {
        pinguim.y = yChao
        pinguim.velocidadeY = 0
        pinguim.noChao = true
    } else {
        pinguim.noChao = false
    }

    pinguim.x = Math.max(0, Math.min(pinguim.x, mycanvas.width - larguraSprite))

    if (teclas.a || teclas.d || !pinguim.noChao) {
        contadorAnimacao++
        if (contadorAnimacao >= 8) {
            contadorAnimacao = 0
            frameAtual = (frameAtual + 1) % runFrames.length
        }
    } else {
        frameAtual = 0
        contadorAnimacao = 0
    }

    // ── Detetar poço + tecla S ───────────────────────────
    const centroX = pinguim.x + larguraSprite / 2
    const poco = pocos.find(p => sceneId < p.destinoCenario && centroX >= p.xInicio && centroX <= p.xFim)
    if (poco && teclas.s && pinguim.noChao) {
        sceneId = poco.destinoCenario
        posicionarNoInicio()
    }
}

// ── Loop principal ────────────────────────────────────────
function loop() {
    atualizar()
    desenhar()
    requestAnimationFrame(loop)
}

// ── Controlos ─────────────────────────────────────────────
window.addEventListener("keydown", function(ev) {
    if (ev.code === "KeyA") teclas.a = true
    if (ev.code === "KeyD") teclas.d = true
    if (ev.code === "KeyS") teclas.s = true
    if (ev.code === "KeyW" && pinguim.noChao) {
        pinguim.velocidadeY = forcaSalto
        pinguim.noChao = false
    }
})

window.addEventListener("keyup", function(ev) {
    if (ev.code === "KeyA") teclas.a = false
    if (ev.code === "KeyD") teclas.d = false
    if (ev.code === "KeyS") teclas.s = false
})

window.onload = function() {
    posicionarNoInicio()
    loop()
}