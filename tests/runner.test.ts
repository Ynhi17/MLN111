import { test } from 'node:test'
import assert from 'node:assert/strict'
import { advance, jump, newRun } from '../src/lib/runner'
import { runnerQuestions } from '../src/data/runnerQuestions'

test('Collision ends a run, while a correctly timed jump clears the obstacle', () => {
  const standing = newRun()
  standing.obstacles.push({ x: 110, width: 25, height: 40 })
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
  assert.ok(run.distance - before <= 42.01)
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
