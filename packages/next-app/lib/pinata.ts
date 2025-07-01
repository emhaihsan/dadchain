// File: packages/next-app/lib/pinata.ts
import PinataSDK from "@pinata/sdk";

// Pastikan Anda telah mengatur PINATA_JWT di file .env.local Anda
export const pinata = new PinataSDK({
  pinataJWTKey: process.env.PINATA_JWT,
});