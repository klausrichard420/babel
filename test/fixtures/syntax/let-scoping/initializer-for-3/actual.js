for (let x = 1, y = x + 1; x < 10 && y != 0; x ++, y *= 2) {
  if (y > 300) {
    continue;
  }
}
