export const FLOOR = 216
export const DINO_X = 42
export type Obstacle = { x: number; width: number; height: number; kind?: 'cactus' | 'rock' | 'tree' | 'bird'; altitude?: number }
export type Run = { elapsed: number; ducking: boolean; spawned: number; y: number; velocity: number; distance: number; spawn: number; obstacles: Obstacle[] }
export const newRun = (): Run => ({ elapsed: 0, ducking: false, spawned: 0, y: 0, velocity: 0, distance: 0, spawn: 0.25, obstacles: [] })
export function jump(run: Run) {
  if (run.y === 0 && !run.ducking) run.velocity = 650
}
export function advance(run: Run, dt: number, width: number, random = Math.random) {
  // Small physics steps prevent fast obstacles skipping through the dinosaur.
  let remaining = dt
  while (remaining > 0) {
    const step = Math.min(remaining, 1 / 1000)
    if (advanceStep(run, step, width, random)) return true
    remaining -= step
  }
  return false
}
function advanceStep(run: Run, dt: number, width: number, random: () => number) {
  run.elapsed += dt
  const frenzy = run.elapsed >= 30
  const speed = frenzy ? (width < 500 ? 8000 : 12000) : (width < 500 ? 2800 : 4400)
  run.distance += speed * dt
  run.y = Math.max(0, run.y + run.velocity * dt)
  run.velocity -= 1850 * dt
  if (run.y === 0 && run.velocity < 0) run.velocity = 0
  run.spawn -= dt
  if (run.spawn <= 0) {
    const kinds = ['cactus', 'rock', 'tree', 'bird'] as const
    const kind = run.spawned % 3 === 0 ? 'bird' : kinds[Math.min(2, Math.floor(random() * 3))]
    run.spawned++
    const height = kind === 'bird' ? 22 : kind === 'rock' ? 26 : kind === 'tree' ? 58 : 40
    run.obstacles.push({ x: width + 30, width: kind === 'bird' ? 44 : 34, height, kind, altitude: kind === 'bird' ? 25 : 0 })
    run.spawn = frenzy ? 0.09 + random() * 0.06 : 0.78 + random() * 0.10
  }
  for (const obstacle of run.obstacles) obstacle.x -= speed * dt
  run.obstacles = run.obstacles.filter(obstacle => obstacle.x + obstacle.width > -10)
  return run.obstacles.some(obstacle => DINO_X + 31 > obstacle.x + 3 && DINO_X + 7 < obstacle.x + obstacle.width - 3 && run.y + 5 < (obstacle.altitude ?? 0) + obstacle.height && run.y + (run.ducking && run.y === 0 ? 18 : 36) > (obstacle.altitude ?? 0))
}
