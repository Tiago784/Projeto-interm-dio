const loading = document.getElementById("loading")
const mycanvas = document.getElementById("mycanvas")
const ctx = mycanvas.getContext("2d")
const floor = 440
const passos = 10
let sceneId = 0

const cenarios = [
  {
    url: "imagens/super_tiago/cenario01_fundo.png",
    image: new Image()
  },
  {
    url: "imagens/super_tiago/cenario02_fundo.png",
    image: new Image()
  },
  {
    url: "imagens/super_tiago/cenario03_fundo.png",
    image: new Image()
  }
]
cenarios.forEach(c => {
  c.image.src = c.url
})
const personagens = {
  "pinguim": {
    "url": "imagens/super_tiago/pinguim.png",
    "image": null
  }
}

async function loadScene(id) {
  ctx.drawImage(cenarios[id].image, 0, 0)
}

addEventListener("keyup", (ev) => {
  if (ev.code === "ArrowRight") {
    if (sceneId < 2) {
      sceneId = sceneId + 1
    }
async function loadScene(id) {
  if (!cenarios[id].image.complete) return
  ctx.drawImage(cenarios[id].image, 0, 0)
}
  }
})
async function loadCharacter(x, y) {
  if (!cenarios[sceneId].image.complete) return
  if (!personagens.pinguim.image) return

  ctx.drawImage(cenarios[sceneId].image, 0, 0)
  ctx.drawImage(personagens.pinguim.image, x, y)
}
personagens.pinguim.image = new Image()
personagens.pinguim.image.src = personagens.pinguim.url
async function loadCharacter(x, y) {
  ctx.drawImage(cenarios[sceneId].image, 0, 0)
  ctx.drawImage(personagens.pinguim.image, x, y)
}

mycanvas.addEventListener("click", (ev) => {
  const bound = mycanvas.getBoundingClientRect()
  const x = ev.clientX - bound.left
  const y = ev.clientY - bound.top
  console.log(x + " x " + y)
  loadCharacter(x, y)
})


const actors = {
  pinguim: {
    sprite: "imagens/super_tiago/cenario01_fundo.png",
    image: null,
    x: 300,
    newx: 300,
    updatePos: () => {
      if (actors.pinguim.newx > actors.pinguim.x) {
        const diff = actors.pinguim.newx - actors.pinguim.x
        if (diff > passos) {
          actors.pinguim.x = actors.pinguim.x + passos
        } else {
          actors.pinguim.x = actors.pinguim.x + diff
        }
      } else {
        const diff = actors.pinguim.x - actors.pinguim.newx
        if (diff > passos) {
          actors.pinguim.x = actors.pinguim.x - passos
        } else {
          actors.pinguim.x = actors.pinguim.x - diff
        }
      }
    }
  }
}

async function loadSceneByKey(key) {
  const scene = scenes[Object.keys(scenes)[sceneKey]]
  await loadScene(scene)
}

async function loadScene(scene) {
  ctx.drawImage(scene.image, 0, 0)
}

async function actorToScene(actor) {
  actorTo(actor, actor.scenePos)
}

async function actorTo(actor, x) {
  // update actor current positions //
  actor.x = x

  // update scenes //
  const y = floor - actors.pinguim.image.height
  loadSceneByKey(sceneKey)
  ctx.drawImage(actor.image, x, y)
}

async function actorMoveTo(actor, x) {
  while (actor.x !== x) {
    let newpos = -1
    if (actor.x > x) {
      newpos = (actor.x - x) / 2 + x
    } else {
      newpos = actor, (x - actor.x) / 2 + actor.x
    }
    console.log(newpos)
    await actorTo(actor, newpos)
    await delay(500)
  }
}

mycanvas.addEventListener("click", (ev) => {
  const bound = mycanvas.getBoundingClientRect()
  const x = ev.clientX - bound.left
  stage.actors[0].newx = x
})

/** renderiza o palco */
function renderStage() {
  // render cenário
  ctx.drawImage(stage.scene.image, 0, 0)

  // atualiza atores //
  stage.actors.forEach(actor => {
    actor.updatePos()
  })

  // render atores //
  stage.actors.forEach(actor => {
    ctx.drawImage(actor.image, actor.x, stage.scene.floor - actor.image.height)
  })
}

function loop() {
  console.log('loop: ' + Date.now())

  // render stage //
  renderStage()

  // update actors //
  setTimeout(loop, 40)
}

function inicializar() {
  return new Promise((resolve) => {
    console.log("iniciando")
    resolve()
  })