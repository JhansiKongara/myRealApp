const greeting = "Hello, World!";
const duplicateGreeting = "Hello, World!";
function getComplexFunction(a: number, b: number, c: number): number {
  if (a > b) {
    if (b > c) {
      if (c > a) {
        return c;
      }
    } else {
      if (a > c) {
        return a;
      }
    }
  }
  return b;
} // SonarJS will flag this due to high cognitive complexity.

export = { greeting, duplicateGreeting, getComplexFunction };
