export async function calculateBalanceScore(imageData) {
  const { data, width, height } = imageData;

  let leftDarkness = 0;
  let rightDarkness = 0;
  const totalPixels = width * height;

  // Iterate over each pixel to calculate its darkness
  for (let i = 0; i < totalPixels; i++) {
    const index = i * 4;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];

    // Calculate the "darkness" of the pixel (simplified as inversely proportional to the average lightness)
    const darkness = 255 - (r + g + b) / 3;

    // Determine if the pixel is in the left or right half of the image
    const xPosition = i % width;
    if (xPosition < width / 2) {
      leftDarkness += darkness;
    } else {
      rightDarkness += darkness;
    }
  }

  // Calculate the balance score
  // The score is higher when the darkness is similar on both sides
  const maxDarkness = Math.max(leftDarkness, rightDarkness);
  const minDarkness = Math.min(leftDarkness, rightDarkness);
  const balanceScore = minDarkness / maxDarkness;

  return balanceScore;
}
