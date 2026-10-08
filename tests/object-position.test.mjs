import assert from 'node:assert/strict';
import { test } from 'node:test';
import { constrainObjectPosition } from '../src/lib/object-position.ts';
test('dragging beyond either edge keeps the complete object and note within the paper', () => {
  assert.deepEqual(constrainObjectPosition(-900, -900, 662, 270), {x:0,y:0});
  assert.deepEqual(constrainObjectPosition(9000, 9000, 662, 270), {x:1,y:1});
});
test('a dropped object retains its relative placement within narrower paper bounds', () => {
  const position = constrainObjectPosition(331, 135, 662, 270);
  assert.deepEqual(position, {x:.5,y:.5});
  const mobileWidth = 225, objectWidth = 144;
  assert.ok(position.x * (mobileWidth - objectWidth) + objectWidth <= mobileWidth);
});
test('a zero available dimension never creates NaN coordinates', () => {
  const position = constrainObjectPosition(0, 0, 0, 0);
  assert.deepEqual(position, {x:0,y:0});
});
