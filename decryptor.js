let savedKey = null;
let savedIv = null;

async function encryptText() {
  const text = document.getElementById("inputBox").value;

  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  // Generate AES key
  savedKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  // Generate random IV
  savedIv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: savedIv },
    savedKey,
    data
  );

  // Convert encrypted buffer → base64
  const encryptedBytes = new Uint8Array(encrypted);
  const base64Encrypted = btoa(String.fromCharCode(...encryptedBytes));

  document.getElementById("outputBox").value = base64Encrypted;
}

async function decryptText() {
  const encryptedBase64 = document.getElementById("outputBox").value;

  // Convert base64 → bytes
  const encryptedBytes = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));

  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: savedIv },
    savedKey,
    encryptedBytes
  );

  // Convert bytes → text
  const decoder = new TextDecoder();
  const decryptedText = decoder.decode(decrypted);

  document.getElementById("inputBox").value = decryptedText;
}

function copyText() {
  const text = document.getElementById("outputBox").value;
  navigator.clipboard.writeText(text);
}