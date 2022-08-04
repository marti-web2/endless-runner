import Player from "./player.js"
import InputHandler from "./input.js"
import Background from "./background.js"
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from "./enemies.js"
import UI from "./UI.js"

window.addEventListener("load", () => {
  const loading = document.getElementById("loading")
  loading.style.display = "none"
  const ctx = canvas1.getContext("2d")
  const CANVAS_WIDTH = (canvas1.width = 1667)
  const CANVAS_HEIGHT = (canvas1.height = 500)

  class Game {
    constructor(width, height) {
      this.width = width
      this.height = height
      this.groundMargin = 40
      this.speed = 0
      this.maxSpeed = 4
      this.background = new Background(this)
      this.player = new Player(this)
      this.input = new InputHandler(this)
      this.UI = new UI(this)
      this.enemies = []
      this.particles = []
      this.maxParticles = 128
      this.collisions = []
      this.splashParticles = 30
      this.floatingMessages = []
      this.enemyTimer = 0
      this.enemyInterval = 1000
      this.debug = false
      this.score = 0
      this.winningScore = 40
      this.fontColor = "black"
      this.time = 0
      this.maxTime = 30000
      this.gameOver = false
      this.lives = 5
      this.player.currentState = this.player.states[0]
      this.player.currentState.enter()
    }

    update(deltaTime) {
      this.time += deltaTime
      if (this.time > this.maxTime) {
        this.gameOver = true
      }
      this.background.update()
      this.player.update(this.input.keys, deltaTime)

      // handle enemies
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy()
        this.enemyTimer = 0
      } else {
        this.enemyTimer += deltaTime
      }
      this.enemies.forEach((enemy) => {
        enemy.update(deltaTime)
      })

      // handle messages
      this.floatingMessages.forEach((msg) => {
        msg.update()
      })

      // handle particles
      this.particles.forEach((particle, i) => {
        particle.update()
      })
      if (this.particles.length > this.maxParticles) {
        this.particles.length = this.maxParticles
      }

      // handle collision sprites
      this.collisions.forEach((collision, i) => {
        collision.update(deltaTime)
      })
      this.enemies = this.enemies.filter((enemy) => {
        !enemy.markedForDeletion
      })
      this.particles = this.particles.filter((particle) => {
        !particle.markedForDeletion
      })
      this.collisions = this.collisions.filter((collision) => {
        !collision.markedForDeletion
      })
      this.floatingMessages = this.floatingMessages.filter((msg) => {
        !msg.markedForDeletion
      })
    }

    draw(ctx) {
      if (this.debug) {
      }
      this.background.draw(ctx)
      this.player.draw(ctx)
      this.enemies.forEach((enemy) => {
        enemy.draw(ctx)
      })
      this.particles.forEach((particle) => {
        particle.draw(ctx)
      })
      this.collisions.forEach((collision) => {
        collision.draw(ctx)
      })
      this.floatingMessages.forEach((msg) => {
        msg.draw(ctx)
      })
      this.UI.draw(ctx)
    }

    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5) {
        this.enemies.push(new GroundEnemy(this))
      } else if (this.speed > 0) {
        this.enemies.push(new ClimbingEnemy(this))
      }
      this.enemies.push(new FlyingEnemy(this))
      console.log(this.enemies)
    }
  }

  const game = new Game(CANVAS_WIDTH, CANVAS_HEIGHT)
  let lastTime = 0

  function animate(timestamp) {
    const deltaTime = timestamp - lastTime
    lastTime = timestamp
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    game.update(deltaTime)
    game.draw(ctx)

    if (!game.gameOver) {
      requestAnimationFrame(animate)
    }
  }

  animate(0)
})
