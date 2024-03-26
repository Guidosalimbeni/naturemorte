export async function calculateBalanceScore(imageData, currentObjects) {
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
    let darkness = 0;

    if (b <= 110) {
      darkness = 1;
    }
    // Determine if the pixel is in the left or right half of the image
    const xPosition = i % width;
    if (xPosition < width / 2) {
      leftDarkness += darkness;
    } else {
      rightDarkness += darkness;
    }
  }

  const totalWeightedDarkness = leftDarkness + rightDarkness;
  const balanceScore =
    1 - Math.abs(leftDarkness - rightDarkness) / totalWeightedDarkness;

  return balanceScore + calculateSceneBalanceScore(currentObjects);
}
//calculateSceneBalanceScore(currentObjects)
function calculateSceneBalanceScore(currentObjects) {
  if (!currentObjects || currentObjects.length === 0) {
    return 0;
  }

  // Initialize min and max values with the first object's position
  let minX = currentObjects[0].x,
    maxX = currentObjects[0].x;
  let minZ = currentObjects[0].z,
    maxZ = currentObjects[0].z;

  // Find the min and max values for x and z
  currentObjects.forEach((obj) => {
    if (obj.x < minX) minX = obj.x;
    if (obj.x > maxX) maxX = obj.x;
    if (obj.z < minZ) minZ = obj.z;
    if (obj.z > maxZ) maxZ = obj.z;
  });

  // Calculate distances
  const xDistance = Math.abs(maxX - minX);
  const zDistance = Math.abs(maxZ - minZ);

  // Determine the score for x based on the distance
  let xScore = 0.0; // Default score
  if (xDistance >= 1.8 && xDistance <= 2) {
    xScore = -0.2;
  }

  // Determine the score for z based on the distance
  let zScore = 0.0; // Default score
  if (zDistance >= 0.9 && zDistance <= 1) {
    zScore = -0.2;
  }

  // Return the scores
  return (xScore + zScore) / 2;
}
