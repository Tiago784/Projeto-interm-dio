const mycanvas = document.getElementById("mycanvas")
const ctx = mycanvas.getContext("2d")

const floor = 440
const passos = 10
const mycanvas = document.getElementById("mycanvas");

if (!mycanvas) {
    alert("Canvas não encontrado!");
} else {
    const ctx = mycanvas.getContext("2d");

    // fundo
    ctx.fillRect(0, 0, 640, 480);

    // texto
    ctx.font = "30px Arial";
    ctx.fillText("Canvas funciona!", 180, 240);

    console.log("Canvas carregado com sucesso");
}
let sceneId = 0

const cenarios = [
  {
    image: new Image(),
    url: "imagens/super_tiago/cenario01_fundo.png"
  },
  {
    image: new Image(),
    url: "imagens/super_tiago/cenario02_fundo.png"
  },
  {
    image: new Image(),
    url: "imagens/super_tiago/cenario03_fundo.png"
  }
]

cenarios.forEach(c => {
  c.image.src = c.url
})

const pinguim = {
  image: new Image(),
  x: 300,
  newx: 300
}

pinguim.image.src = "imagens/super_tiago/pinguim.png"

function render() {

  const fundo = cenarios[sceneId]

  if (!fundo.image.complete) return
  if (!pinguim.image.complete) return

  ctx.clearRect(0, 0, mycanvas.width, mycanvas.height)

  ctx.drawImage(
    fundo.image,
    0,
    0
  )

  ctx.drawImage(
    pinguim.image,
    pinguim.x,
    floor - pinguim.image.height
  )
}

function update() {

  if (pinguim.x < pinguim.newx) {
    pinguim.x += Math.min(
      passos,
      pinguim.newx - pinguim.x
    )
  }

  if (pinguim.x > pinguim.newx) {
    pinguim.x -= Math.min(
      passos,
      pinguim.x - pinguim.newx
    )
  }
}

function loop() {

  update()
  render()

  requestAnimationFrame(loop)
}

mycanvas.addEventListener("click", (ev) => {

  const rect = mycanvas.getBoundingClientRect()

  pinguim.newx =
    ev.clientX - rect.left
})

addEventListener("keyup", (ev) => {

  if (ev.code === "ArrowRight") {

    if (sceneId < cenarios.length - 1) {
      sceneId++
    }
  }

  if (ev.code === "ArrowLeft") {

    if (sceneId > 0) {
      sceneId--
    }
  }
})

window.onload = () => {
  loop()
}