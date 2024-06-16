/**
 Fetch metadata about JSR package. E.g.:
 ```ts
 const metadata = await jsrMetadataFetch('axhxrx', 'date');

 // an example of what the looks like:
 const example = {
   scope: "axhxrx",
   name: "date",
   latest: "0.1.6",
   versions: {
     "0.1.4": {},
     "0.1.1": {
       yanked: true,
     },
     "0.1.5": {},
     "0.1.2": {},
     "0.1.0": {},
     "0.1.6": {},
   },
 }
 ```ts
 */
export const jsrMetadataFetch = async (scopeName: string, packageName: string): Promise<any> =>
{
  const datWerxScopeName = !scopeName.startsWith('@')
    ? scopeName
    : '@' + scopeName;

  const url = `https://jsr.io/${datWerxScopeName}/${packageName}/meta.json`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'JSR Metadata Fetcher',
      Accept: 'application/json',
    },
  });
  if (!response.ok)
  {
    throw new Error(`Failed to fetch JSR metadata from ${url}`);
  }
  const result = await response.json();
  return result;
};

import * as semver from "@std/semver";

/**
 Returns `true` if the JSR metadata `latest` version string indicates an older version when compared to `localVersionString`, `false` otherwise. Comparison is done by `@std/semver` and it throws if you (or, for that matter, JSR) pass in a bad version string.

 @throws some error if something goes wrong
 */
export const jsrVersionIsOlderThan = async (scopeName: string, packageName: string, otherVersionString: string, jsrMetadata?: {latest: string }): Promise<any> => {
  const metadata =  jsrMetadata ?? await jsrMetadataFetch(scopeName, packageName);
  const jsrVersionString = metadata.latest;

  const jsrVersion = semver.parse(jsrVersionString); 
  const localVersion = semver.parse(otherVersionString);
 
  const isOlder = semver.lessThan(jsrVersion, localVersion); 
  return isOlder;
}
