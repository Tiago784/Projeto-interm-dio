const mycanvas = document.getElementById("mycanvas")
const ctx = mycanvas.getContext("2d")

let x = 300
let destinoX = 300

const passos = 5

const fundo = new Image()
const pinguim = new Image()

fundo.src = "imagens/super_tiago/cenario01_fundo.png"
pinguim.src = "imagens/super_tiago/pinguim.png"

function atualizar() {

    if (x < destinoX) {
        x += passos
    }

    if (x > destinoX) {
        x -= passos
    }
}

function desenhar() {

    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height)

    if (fundo.complete) {
        ctx.drawImage(fundo, 0, 0)
    }

    if (pinguim.complete) {
        ctx.drawImage(
            pinguim,
            x,
            440 - pinguim.height
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

    destinoX = ev.clientX - rect.left
})

window.onload = () => {
    loop()
}