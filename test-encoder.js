
// Test the TextEncoder/TextDecoder polyfills
const testString = 'Hello, World!';
console.log('Testing with string:', testString);

// Check if TextEncoder/TextDecoder are available
console.log('TextEncoder available:', typeof TextEncoder !== 'undefined');
console.log('TextDecoder available:', typeof TextDecoder !== 'undefined');

// Define our polyfills
const textEncoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : {
  encode: (str) => {
    // Simple UTF-8 encoding fallback
    const buf = new Uint8Array(str.length * 3); // Max 3 bytes per char for UTF-8
    let i = 0;
    for (let j = 0; j < str.length; j++) {
      const code = str.charCodeAt(j);
      if (code < 0x80) {
        buf[i++] = code;
      } else if (code < 0x800) {
        buf[i++] = 0xc0 | (code >> 6);
        buf[i++] = 0x80 | (code & 0x3f);
      } else if (code < 0xd800 || code >= 0xe000) {
        buf[i++] = 0xe0 | (code >> 12);
        buf[i++] = 0x80 | ((code >> 6) & 0x3f);
        buf[i++] = 0x80 | (code & 0x3f);
      } else { // Surrogate pair
        j++;
        const code2 = str.charCodeAt(j);
        const fullCode = 0x10000 + ((code & 0x3ff) << 10) + (code2 & 0x3ff);
        buf[i++] = 0xf0 | (fullCode >> 18);
        buf[i++] = 0x80 | ((fullCode >> 12) & 0x3f);
        buf[i++] = 0x80 | ((fullCode >> 6) & 0x3f);
        buf[i++] = 0x80 | (fullCode & 0x3f);
      }
    }
    return buf.slice(0, i);
  }
};

const textDecoder = typeof TextDecoder !== 'undefined' ? new TextDecoder() : {
  decode: (buf) => {
    // Simple UTF-8 decoding fallback
    let str = '';
    for (let i = 0; i < buf.length; i++) {
      const byte = buf[i];
      if (byte < 0x80) {
        str += String.fromCharCode(byte);
      } else if (byte < 0xe0) {
        str += String.fromCharCode(((byte & 0x1f) << 6) | (buf[++i] & 0x3f));
      } else if (byte < 0xf0) {
        const code = ((byte & 0x0f) << 12) | ((buf[++i] & 0x3f) << 6) | (buf[++i] & 0x3f);
        if (code > 0xffff) { // Surrogate pair
          str += String.fromCharCode(0xd800 + ((code - 0x10000) >> 10));
          str += String.fromCharCode(0xdc00 + ((code - 0x10000) & 0x3ff));
        } else {
          str += String.fromCharCode(code);
        }
      } else {
        const code = ((byte & 0x07) << 18) | ((buf[++i] & 0x3f) << 12) | ((buf[++i] & 0x3f) << 6) | (buf[++i] & 0x3f);
        str += String.fromCodePoint ? String.fromCodePoint(code) : String.fromCharCode(code);
      }
    }
    return str;
  }
};

try {
  console.log('Testing encoding/decoding...');
  const encoded = textEncoder.encode(testString);
  console.log('Encoded bytes:', encoded);
  console.log('Encoded type:', typeof encoded);
  console.log('Encoded length:', encoded.length);
  
  const decoded = textDecoder.decode(encoded);
  console.log('Decoded string:', decoded);
  console.log('Encoding/decoding successful:', testString === decoded);
} catch (error) {
  console.error('Error during encoding/decoding:', error.message);
  console.error('Stack:', error.stack);
}

// Test base64 functions
function base64Encode(str) {
  if (typeof Buffer !== 'undefined') {
    // Node.js environment
    return Buffer.from(str, 'utf8').toString('base64');
  } else {
    // Browser/React Native environment
    const bytes = textEncoder.encode(str);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}

function base64Decode(str) {
  if (typeof Buffer !== 'undefined') {
    // Node.js environment
    return Buffer.from(str, 'base64').toString('utf8');
  } else {
    // Browser/React Native environment
    const binary = atob(str);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return textDecoder.decode(bytes);
  }
}

try {
  console.log('\nTesting base64 functions...');
  const original = 'Hello, World!';
  const encoded = base64Encode(original);
  console.log('Base64 encoded:', encoded);
  const decoded = base64Decode(encoded);
  console.log('Base64 decoded:', decoded);
  console.log('Base64 encoding/decoding successful:', original === decoded);
} catch (error) {
  console.error('Error during base64 encoding/decoding:', error.message);
  console.error('Stack:', error.stack);
}
