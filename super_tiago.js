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

const idleImg = new Image()
idleImg.src = "imagens/super_tiago/seylah_idle.png"
idleImg.onload  = () => { pinguim.y = floor - idleImg.height; pinguim.noChao = true }
idleImg.onerror = () => console.error("ERRO: seylah_idle.png nao carregou")

const runFrames = []
for (let i = 1; i <= 5; i++) {
    const img = new Image()
    img.src = "imagens/super_tiago/run" + i + ".png"
    img.onerror = () => console.error("ERRO: run" + i + ".png nao carregou")
    runFrames.push(img)
}

const pinguim = {
    x: 300,
    y: 0,
    velocidadeY: 0,
    noChao: false,
    direcao: 1
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
        ctx.fillStyle = "#87CEEB"
        ctx.fillRect(0, 0, mycanvas.width, mycanvas.height)
        ctx.fillStyle = "#5a8a3c"
        ctx.fillRect(0, floor, mycanvas.width, mycanvas.height - floor)
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
    const yChao = floor - alturaSprite

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
    if (spriteOk(idleImg)) {
        pinguim.y = floor - idleImg.height
        pinguim.noChao = true
    }
    loop()
}
