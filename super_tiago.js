const mycanvas = document.getElementById("mycanvas")
const ctx = mycanvas.getContext("2d")

const floor = 399
const passos = 3
const gravidade = 0.6
const forcaSalto = -15

let sceneId = 0

const cenarios = [new Image(), new Image(), new Image()]
cenarios[0].src = "imagens/super_tiago/cenario01_fundo.png"
cenarios[1].src = "imagens/super_tiago/cenario02_fundo.png"
cenarios[2].src = "imagens/super_tiago/cenario03_fundo.png"

// ── Idle ────────────────────────────────────────────────
const idleImg = new Image()
idleImg.src = "imagens/super_tiago/seylah_idle.png"
idleImg.onload  = () => console.log("✅ idle carregou", idleImg.width, idleImg.height)
idleImg.onerror = () => console.error("❌ idle NÃO carregou – verifica o caminho!")

// ── Run frames ──────────────────────────────────────────
const runFrames = []
for (let i = 1; i <= 5; i++) {
    const img = new Image()
    img.src = `imagens/super_tiago/run${i}.png`
    img.onload  = () => console.log(`✅ run${i} carregou`)
    img.onerror = () => console.error(`❌ run${i} NÃO carregou – verifica o caminho!`)
    runFrames.push(img)
}

// ── Personagem ──────────────────────────────────────────
const pinguim = {
    x: 300,
    y: 0,
    velocidadeY: 0,
    noChao: false,
    direcao: 1   // 1 = direita, -1 = esquerda
}

let frameAtual = 0
let contadorAnimacao = 0

const teclas = { a: false, d: false }

// Quando o idle carregar, posiciona o personagem no chão
idleImg.onload = () => {
    console.log("✅ idle carregou", idleImg.width, idleImg.height)
    pinguim.y = floor - idleImg.height
    pinguim.noChao = true
}

// ── Helpers ─────────────────────────────────────────────
function spriteCarregado(img) {
    return img && img.complete && img.naturalWidth > 0
}

// ── Desenhar ─────────────────────────────────────────────
function desenhar() {
    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height)

    // Fundo
    if (spriteCarregado(cenarios[sceneId])) {
        ctx.drawImage(cenarios[sceneId], 0, 0)
    } else {
        // Fundo de fallback para confirmar que o canvas funciona
        ctx.fillStyle = "#87CEEB"
        ctx.fillRect(0, 0, mycanvas.width, mycanvas.height)
        ctx.fillStyle = "#5a8a3c"
        ctx.fillRect(0, floor, mycanvas.width, mycanvas.height - floor)
    }

    // Escolhe sprite
    let sprite = idleImg  // default: idle

    if (!pinguim.noChao) {
        // No ar → usa run frames como animação de pulo
        const rf = runFrames[frameAtual]
        if (spriteCarregado(rf)) sprite = rf
    } else if (teclas.a || teclas.d) {
        // A mover → run frames
        const rf = runFrames[frameAtual]
        if (spriteCarregado(rf)) sprite = rf
    }

    // Fallback: se ainda nenhum sprite carregou, desenha rectângulo
    if (!spriteCarregado(sprite)) {
        ctx.fillStyle = "red"
        ctx.fillRect(pinguim.x, pinguim.y === 0 ? floor - 64 : pinguim.y, 48, 64)
        return
    }

    ctx.save()

    if (pinguim.direcao === -1) {
        // Espelha: translada para a direita do sprite, depois escala -1
        ctx.translate(pinguim.x + sprite.width, 0)
        ctx.scale(-1, 1)
        ctx.drawImage(sprite, 0, pinguim.y)
    } else {
        ctx.drawImage(sprite, pinguim.x, pinguim.y)
    }

    ctx.restore()

    // Debug HUD
    ctx.fillStyle = "rgba(0,0,0,0.5)"
    ctx.fillRect(4, 4, 220, 70)
    ctx.fillStyle = "white"
    ctx.font = "13px monospace"
    ctx.fillText(`x:${Math.round(pinguim.x)}  y:${Math.round(pinguim.y)}`, 10, 22)
    ctx.fillText(`noChao:${pinguim.noChao}  dir:${pinguim.direcao}`, 10, 40)
    ctx.fillText(`frame:${frameAtual}  velY:${pinguim.velocidadeY.toFixed(1)}`, 10, 58)
}

// ── Atualizar ────────────────────────────────────────────
function atualizar() {
    if (teclas.a) { pinguim.x -= passos; pinguim.direcao = -1 }
    if (teclas.d) { pinguim.x += passos; pinguim.direcao =  1 }

    // Gravidade
    pinguim.velocidadeY += gravidade
    pinguim.y += pinguim.velocidadeY

    // Altura do sprite (usa idle como referência)
    const alturaSprite = spriteCarregado(idleImg) ? idleImg.height : 64
    const yChao = floor - alturaSprite

    if (pinguim.y >= yChao) {
        pinguim.y = yChao
        pinguim.velocidadeY = 0
        pinguim.noChao = true
    } else {
        pinguim.noChao = false
    }

    // Limites horizontais
    const larguraSprite = spriteCarregado(idleImg) ? idleImg.width : 48
    pinguim.x = Math.max(0, Math.min(pinguim.x, mycanvas.width - larguraSprite))

    // Animação de frames
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

// ── Loop ─────────────────────────────────────────────────
function loop() {
    atualizar()
    desenhar()
    requestAnimationFrame(loop)
}

// ── Teclas ───────────────────────────────────────────────
window.addEventListener("keydown", (ev) => {
    if (ev.code === "KeyA") teclas.a = true
    if (ev.code === "KeyD") teclas.d = true
    if (ev.code === "KeyW" && pinguim.noChao) {
        pinguim.velocidadeY = forcaSalto
        pinguim.noChao = false
        console.log("🦘 saltou!")
    }
})

window.addEventListener("keyup", (ev) => {
    if (ev.code === "KeyA") teclas.a = false
    if (ev.code === "KeyD") teclas.d = false
})

// ── Inicia ──────────────────────────────────────────────
window.onload = () => {
    // Garante que o personagem está posicionado mesmo se idle já carregou
    if (spriteCarregado(idleImg)) {
        pinguim.y = floor - idleImg.height
        pinguim.noChao = true
    }
    loop()
} 