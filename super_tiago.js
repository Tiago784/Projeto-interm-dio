const mycanvas = document.getElementById("mycanvas")
const ctx = mycanvas.getContext("2d")

const passos = 3
const gravidade = 0.6
const forcaSalto = -15

let sceneId = 0

const cenarios = [new Image(), new Image(), new Image()]
cenarios[0].src = "imagens/super_tiago/cenario01_fundo.png"
cenarios[1].src = "imagens/super_tiago/cenario02_fundo.png"
cenarios[2].src = "imagens/super_tiago/cenario03_fundo.png"

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

const pinguim = {
    x: 0,
    y: 0,
    velocidadeY: 0,
    noChao: false,
    direcao: 1
}

// ── Chão do cenário ──────────────────────────────────────
// Mapeado a partir da imagem fornecida (canvas 640x480)
// Cada entrada: { xInicio, xFim, y } — y é onde o personagem assenta
//
//  Plataformas visíveis na imagem:
//   - Plataformas dentro da caixa esquerda (escadas/degraus)
//   - Chão principal do nível do meio
//   - Zona da corda (abertura no chão)
//   - Chão do lado direito
//   - Plataforma da sala direita

const plataformas = [
    // Chão principal esquerdo (antes da caixa)
    { xInicio:   0, xFim: 310, y: 370 },

    // Degraus dentro da caixa esquerda (de baixo para cima)
    { xInicio:  75, xFim: 155, y: 530 },
    { xInicio:  95, xFim: 175, y: 495 },
    { xInicio: 115, xFim: 195, y: 460 },
    { xInicio: 135, xFim: 215, y: 425 },
    { xInicio: 155, xFim: 235, y: 390 },
    { xInicio: 175, xFim: 255, y: 355 },
    { xInicio: 195, xFim: 275, y: 320 },
    { xInicio: 215, xFim: 295, y: 285 },

    // Chão do corredor do meio (entre caixa e corda)
    { xInicio: 310, xFim: 490, y: 370 },

    // Depois da corda até à parede direita
    { xInicio: 610, xFim: 900, y: 310 },

    // Chão da sala direita (zona inferior)
    { xInicio: 870, xFim: 1100, y: 460 },

    // Chão do lado direito da sala
    { xInicio: 870, xFim: 1100, y: 310 },
]

// Posição do fim da corda — onde o personagem começa
const CORDA_X = 490   // x do centro da corda na imagem
const CORDA_Y_FIM = 430 // y do fim da corda

function posicionarNoInicio() {
    const alturaSprite = spriteOk(idleImg) ? idleImg.height : 64
    pinguim.x = CORDA_X - (spriteOk(idleImg) ? idleImg.width / 2 : 24)
    pinguim.y = CORDA_Y_FIM - alturaSprite
    pinguim.noChao = false
    pinguim.velocidadeY = 0
}

// Devolve o y do chão para uma dada posição x
function obterChao(x) {
    let melhorY = 999  // valor grande = cair indefinidamente se não encontrar
    for (let p of plataformas) {
        if (x >= p.xInicio && x <= p.xFim) {
            if (p.y < melhorY) melhorY = p.y
        }
    }
    return melhorY
}

let frameAtual = 0
let contadorAnimacao = 0

const teclas = { a: false, d: false }

function spriteOk(img) {
    return img && img.complete && img.naturalWidth > 0
}

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
}

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
}

function loop() {
    atualizar()
    desenhar()
    requestAnimationFrame(loop)
}

window.addEventListener("keydown", function(ev) {
    if (ev.code === "KeyA") teclas.a = true
    if (ev.code === "KeyD") teclas.d = true
    if (ev.code === "KeyW" && pinguim.noChao) {
        pinguim.velocidadeY = forcaSalto
        pinguim.noChao = false
    }
})

window.addEventListener("keyup", function(ev) {
    if (ev.code === "KeyA") teclas.a = false
    if (ev.code === "KeyD") teclas.d = false
})

window.onload = function() {
    posicionarNoInicio()
    loop()
}