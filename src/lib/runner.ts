export const FLOOR = 216
export const DINO_X = 42
export type Obstacle = { x: number; width: number; height: number }
export type Run = { y: number; velocity: number; distance: number; spawn: number; obstacles: Obstacle[] }
export const newRun = (): Run => ({ y: 0, velocity: 0, distance: 0, spawn: 1.1, obstacles: [] })
export function jump(run: Run) {
  if (run.y === 0) run.velocity = 650
}
export function advance(run: Run, dt: number, width: number, random = Math.random) {
  const speed = Math.min(width < 500 ? 420 : 600, (width < 500 ? 285 : 380) + run.distance / 95)
  run.distance += speed * dt
  run.y = Math.max(0, run.y + run.velocity * dt)
  run.velocity -= 1850 * dt
  if (run.y === 0 && run.velocity < 0) run.velocity = 0
  run.spawn -= dt
  if (run.spawn <= 0) {
    run.obstacles.push({ x: width + 30, width: 22 + Math.floor(random() * 12), height: 30 + Math.floor(random() * 17) })
    run.spawn = 0.95 + random() * 0.4
  }
  for (const obstacle of run.obstacles) obstacle.x -= speed * dt
  run.obstacles = run.obstacles.filter(obstacle => obstacle.x + obstacle.width > -10)
  return run.obstacles.some(obstacle => DINO_X + 31 > obstacle.x + 3 && DINO_X + 7 < obstacle.x + obstacle.width - 3 && run.y + 5 < obstacle.height)
}
