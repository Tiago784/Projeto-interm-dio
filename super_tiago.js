
const mycanvas = document.getElementById("mycanvas");
const ctx = mycanvas.getContext("2d");

// --- 1. CONFIGURAÇÕES E ESTADO ---
let sceneId = 0;
const floor = 440;
const passos = 5;

// Estrutura para carregar as imagens
const cenarios = [
    { url: "imagens/super_tiago/cenario01_fundo.png", image: new Image() },
    { url: "imagens/super_tiago/cenario02_fundo.png", image: new Image() },
    { url: "imagens/super_tiago/cenario03_fundo.png", image: new Image() }
];

const stage = {
    actors: [
        {
            name: "pinguim",
            url: "imagens/super_tiago/pinguim.png",
            image: new Image(),
            x: 300,
            newx: 300,
            updatePos: function() {
                // Move o personagem em direção ao clique do mouse
                if (Math.abs(this.newx - this.x) < passos) {
                    this.x = this.newx;
                } else {
                    this.x += this.newx > this.x ? passos : -passos;
                }
            }
        }
    ]
};

// --- 2. CARREGAMENTO ---
function inicializar() {
    cenarios.forEach(c => c.image.src = c.url);
    stage.actors.forEach(a => a.image.src = a.url);
    console.log("Recursos carregando...");
}

// --- 3. LÓGICA DE RENDERIZAÇÃO ---
function renderStage() {
    // Limpa o canvas
    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);

    // Desenha o fundo (cenário atual)
    const currentScene = cenarios[sceneId];
    if (currentScene.image.complete) {
        ctx.drawImage(currentScene.image, 0, 0, mycanvas.width, mycanvas.height);
    }

    // Atualiza e desenha o pinguim
    stage.actors.forEach(actor => {
        actor.updatePos();
        if (actor.image.complete) {
            // Desenha o pinguim no "chão" (floor)
            const y = floor - actor.image.height;
            ctx.drawImage(actor.image, actor.x, y);
        }
    });
}

function loop() {
    renderStage();
    requestAnimationFrame(loop); // Cria um loop suave
}

// --- 4. CONTROLES ---
window.addEventListener("keyup", (ev) => {
    // Muda de cenário com as setas do teclado
    if (ev.code === "ArrowRight" && sceneId < cenarios.length - 1) sceneId++;
    if (ev.code === "ArrowLeft" && sceneId > 0) sceneId--;
});

mycanvas.addEventListener("click", (ev) => {
    // Move o pinguim para onde você clicar
    const bound = mycanvas.getBoundingClientRect();
    stage.actors[0].newx = ev.clientX - bound.left;
});

// --- 5. INICIALIZAÇÃO ---
inicializar();
loop();