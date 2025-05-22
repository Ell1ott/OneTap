export function base64ToInt16Array(base64: string) {
  // Step 1: Decode Base64 to binary string
  const binaryStr = atob(base64);

  // Step 2: Create Uint8Array from binary string
  const byteArray = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    byteArray[i] = binaryStr.charCodeAt(i);
  }

  // Step 3: Convert Uint8Array buffer to Int16Array
  // PCM LINEAR16 is little-endian, so ensure correct endianness
  const int16Array = new Int16Array(byteArray.buffer);

  return int16Array;
}

export function calculateRMSVolume(samples: Int16Array) {
  // Sum the squares of all samples
  let sumOfSquares = 0;
  for (let i = 0; i < samples.length; i++) {
    sumOfSquares += samples[i] * samples[i];
  }
  
  // Calculate the mean of the squares
  const meanSquare = sumOfSquares / samples.length;
  
  // Take the square root to get the RMS value
  const rms = Math.sqrt(meanSquare);
  
  return rms;
}

export function calculateNormalizedRMSVolume(samples: Int16Array) {
  const rms = calculateRMSVolume(samples);
  
  // Normalize to 0-1 range
  // 32768 is the max absolute value for a 16-bit signed integer
  return rms / 32768;
}