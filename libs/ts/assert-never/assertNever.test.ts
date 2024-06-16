import { describe, it } from 'https://deno.land/std@0.224.0/testing/bdd.ts';
import { assertEquals, assertThrows } from 'jsr:@std/assert';
import { assertNever } from './assertNever.ts';

describe('assertNever', () =>
{
  it('should exist', () =>
  {
    assertEquals(typeof assertNever, 'function');
  });

  it('should work', () =>
  {
    let state: 'happy' | 'sad' | 'mad';
    let result = '🤔';

    state = 'happy' as unknown as 'happy' | 'sad' | 'mad';
    state = 'mad' as unknown as 'happy' | 'sad' | 'mad';

    switch (state)
    {
      case 'happy':
        result = '😀';
        break;
      case 'sad':
        result = '😢';
        break;
      case 'mad':
        result = '😠';
        break;
      default:
        assertNever(state);
    }

    const errFragment = 'Should never happen: mad';

    const invalidNonexhaustiveSwitch = () =>
    {
      switch (state)
      {
        case 'happy':
          result = '😀';
          break;
        default:
          // @ts-expect-error Argument of type '"sad" | "mad"' is not assignable to parameter of type 'undefined'.
          assertNever(state);
      }
    };

    assertThrows(invalidNonexhaustiveSwitch, Error, errFragment);

    assertEquals(result, '😠');
  });
});
