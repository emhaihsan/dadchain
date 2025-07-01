// File: packages/next-app/app/api/upload/route.ts

import { NextResponse } from "next/server";
import { pinata } from "@/lib/pinata";
import { Readable } from "stream";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file found" });
    }

    // Convert the File object to a Node.js Readable Stream
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const stream = Readable.from(buffer);

    const response = await pinata.pinFileToIPFS(stream, {
      pinataMetadata: {
        name: file.name, // We need to pass the name manually
      },
      pinataOptions: {
        cidVersion: 0,
      },
    });

    return NextResponse.json({ success: true, ipfsHash: response.IpfsHash });
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    return NextResponse.json(
      { success: false, message: "Error uploading file" },
      { status: 500 }
    );
  }
}