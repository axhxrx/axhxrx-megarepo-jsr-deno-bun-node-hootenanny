/**
 Utility function for [exhaustiveness checking](http://www.typescriptlang.org/docs/handbook/advanced-types.html#exhaustiveness-checkin). Use it to get compile-time errors for non-exhaustive `switch` statements. Example:

 ```ts
 let state: "happy" | "sad" | "mad";
 switch(state) {
   case "happy": return "😀";
   case "sad":   return "😢";
   // case "mad" : return "😠";
   default:
     assertNever(state);
       // ERROR:
       // Argument of type '"mad"' is not assignable
       // to parameter of type 'never'.ts(2345)
       //
       // Uncomment the third case to fix the error by making the switch exhaustive.
 }
 ```
 */
export const assertNever = (x?: never): never =>
{
  throw new Error('Should never happen: ' + x);
};
