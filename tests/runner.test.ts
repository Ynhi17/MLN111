import { test } from 'node:test'
import assert from 'node:assert/strict'
import { advance, jump, newRun } from '../src/lib/runner'
import { runnerQuestions } from '../src/data/runnerQuestions'

test('Collision ends a run, while a correctly timed jump clears the obstacle', () => {
  const standing = newRun()
  standing.obstacles.push({ x: 110, width: 25, height: 40 })
  standing.spawn = 10
  const jumping = structuredClone(standing)
  jump(jumping)
  let hitStanding = false
  let hitJumping = false
  for (let i = 0; i < 48; i++) {
    hitStanding ||= advance(standing, 1 / 60, 375, () => 0.5)
    hitJumping ||= advance(jumping, 1 / 60, 375, () => 0.5)
  }
  assert.equal(hitStanding, true)
  assert.equal(hitJumping, false)
  assert.equal(jumping.y, 0)
})

test('No double jumps; long runs remain bounded and spawn playable gaps', () => {
  const run = newRun()
  jump(run); advance(run, 0.1, 375)
  const velocity = run.velocity
  jump(run)
  assert.equal(run.velocity, velocity)
  run.distance = 1000000
  const before = run.distance
  advance(run, 0.1, 375)
  assert.ok(run.distance - before <= 280.01)
  for (let i = 0; i < 10000; i++) advance(run, 1 / 60, 375, () => 0)
  assert.ok(run.obstacles.length < 5)
  assert.ok(run.y >= 0)
})

test('Each philosophy question has one valid answer and an explanation', () => {
  assert.equal(new Set(runnerQuestions.map(item => item.question)).size, runnerQuestions.length)
  for (const item of runnerQuestions) {
    assert.ok(item.answer >= 0 && item.answer < item.options.length)
    assert.ok(item.explanation.length > 30)
  }
})


test('Extreme speed still detects obstacles crossing the player between frames', () => {
  const run = newRun()
  run.distance = 100000
  run.elapsed = 30
  run.obstacles.push({ x: 100, width: 22, height: 40 })
  assert.equal(advance(run, 0.033, 800), true)
})


test('Low birds hit standing players but pass above ducking players', () => {
  for (const ducking of [false, true]) {
    const run = newRun()
    run.elapsed = 30
    run.ducking = ducking
    run.obstacles.push({ x: 100, width: 44, height: 22, altitude: 25, kind: 'bird' })
    assert.equal(advance(run, 0.033, 375), !ducking)
  }
})
test('First obstacle is a bird and 30 seconds triggers extreme speed and density', () => {
  const early = newRun()
  early.spawn = 0
  advance(early, 0.001, 800, () => 0)
  assert.equal(early.obstacles[0].kind, 'bird')
  const late = newRun()
  late.elapsed = 30; late.spawn = 0
  advance(late, 0.001, 800, () => 0)
  assert.ok(late.distance > early.distance * 2)
  assert.ok(late.spawn < early.spawn / 5)
})


test('Speed increases gradually before 30 seconds and resets for a new run', () => {
  for (const width of [375, 800]) {
    const speeds = [0, 10, 20, 29].map(elapsed => {
      const run = newRun()
      run.elapsed = elapsed; run.spawn = 10
      advance(run, 0.001, width)
      return run.distance / 0.001
    })
    assert.ok(speeds[0] < 400)
    for (let i = 1; i < speeds.length; i++) assert.ok(speeds[i] > speeds[i - 1])
    assert.equal(newRun().elapsed, 0)
  }
})
