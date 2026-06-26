const mycanvas = document.getElementById("mycanvas")
const ctx = mycanvas.getContext("2d")

const passos = 3
const gravidade = 0.6
const forcaSalto = -15

let sceneId = 0


const cenarios = [new Image(), new Image()]
cenarios[0].src = "imagens/super_tiago/cenario01_fundo.png"
cenarios[1].src = "imagens/super_tiago/cenario02_fundo.png"


idleImg.src = "imagens/super_tiago/seylah_idle.png"
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



const plataformasCenario1 = [
    { xInicio:   0, xFim: 430, y: 399 },
    { xInicio: 460, xFim: 640, y: 399 },
]


const plataformasCenario2 = [
    { xInicio:  35, xFim: 160, y: 312 }, 
    { xInicio: 160, xFim: 280, y: 182 }, 
    { xInicio: 280, xFim: 422, y: 222 },  
    { xInicio: 422, xFim: 632, y: 182 },  
    { xInicio: 490, xFim: 632, y: 260 },  

]
const pocos = [
    { xInicio: 430, xFim: 460, destinoCenario: 1 },
]

function plataformasAtuais() {
    return sceneId === 0 ? plataformasCenario1 : plataformasCenario2
}

const iniciosPorCenario = [
    { x: 300, y: 200 },   
    { x: 340, y: 50  },   
]

function posicionarNoInicio() {
    const inicio = iniciosPorCenario[sceneId]
    pinguim.x = inicio.x
    pinguim.y = inicio.y
    pinguim.noChao = false
    pinguim.velocidadeY = 0
}


function obterChao(x) {
    let melhorY = -1
    for (let p of plataformasAtuais()) {
        if (x >= p.xInicio && x <= p.xFim) {
            if (p.y > melhorY) melhorY = p.y
        }
    }
    return melhorY === -1 ? mycanvas.height : melhorY
}


let frameAtual = 0
let contadorAnimacao = 0

const teclas = { a: false, d: false, s: false }

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

 
    const centroX = pinguim.x + larguraSprite / 2
    const poco = pocos.find(p => sceneId < p.destinoCenario && centroX >= p.xInicio && centroX <= p.xFim)
    if (poco && teclas.s && pinguim.noChao) {
        sceneId = poco.destinoCenario
        const inicio = iniciosPorCenario[sceneId]
        pinguim.x = inicio.x
        pinguim.y = inicio.y
        pinguim.velocidadeY = 0
        pinguim.noChao = false
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