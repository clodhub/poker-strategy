import { assert, load } from './runtime.mjs';
const m = await load('server/index.ts');
const strategy = m.createStrategy({ odds: { winChance: () => 0.1 } });
assert.equal(strategy.choose(null, 'a', () => 0.5, {}), null);
assert.equal(strategy.choose({}, 'a', () => 0.5, {}), null);
const memory = strategy.newMemory();
strategy.observe(memory, { street: 'preflop' }, 'a', { type: 'call' });
strategy.observe(memory, { street: 'flop' }, 'a', { type: 'fold' });
assert.equal(memory.a.actions, 2);
assert.equal(memory.a.calls, 1);
assert.equal(memory.a.folds, 1);
assert.equal(memory.a.vpip, 1);
assert.deepEqual(strategy.newMemory(), {});
assert.throws(() => m.createStrategy({ odds: {} }, { aggression: 101 }));
const observation = { hole: ['Ac', 'Kd'], board: ['2c', '7d', '9h'], street: 'flop', stack: 1000, bet: 0, seat: 0, button: 1, seats: 2, sb: 5, bb: 10,
  currentBet: 100, lastFullRaiseTo: 100, pot: 100, legal: { fold: true, check: false, call: 100, bet: null },
  opponents: [{ id: 'b', seat: 1, bet: 100, totalIn: 100, lastAction: 'bet' }] };
assert.deepEqual(m.createStrategy({ odds: { winChance: () => 0.01 } }).choose(observation, 'a', () => 0.5, {}), { type: 'fold' });
assert.deepEqual(m.createStrategy({ odds: { winChance: () => 0.95 } }).choose(observation, 'a', () => 0.5, {}), { type: 'call' });
