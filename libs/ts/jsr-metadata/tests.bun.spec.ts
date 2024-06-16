import { it, describe, expect} from 'bun:test'

import { jsrMetadataFetch, jsrVersionIsOlderThan } from "./mod.ts";
describe('JsrMetadata ', () => {
  it('can fetch', () => {
    const md = jsrMetadataFetch('@axhxrx', 'date');
  });

  it('can check if JSR version is old', async () => {
    const md = jsrMetadataFetch('@axhxrx', 'date');
    const isOld = await jsrVersionIsOlderThan('@axhxrx', 'date', '0.1.0');
    expect(isOld).toBe(false);
    const isOld2 = await jsrVersionIsOlderThan('@axhxrx', 'date', '999.1.0');
    expect(isOld2).toBe(true);
  });
});