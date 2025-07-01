"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, ImagePlus, X } from "lucide-react";
import { useWriteContract } from "wagmi";
import { dadChainCoreContract } from "@/lib/contracts";

const MAX_JOKE_LENGTH = 280;

export function JokeSubmissionForm() {
  const [joke, setJoke] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    // Cleanup function to revoke the object URL
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joke.trim()) return;

    setIsSubmitting(true);
    let imageUri = "";

    try {
      // Step 1: Upload image via our API route if it exists
      if (imageFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", imageFile);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        setIsUploading(false);

        if (!result.success) {
          throw new Error(result.message || "Image upload failed");
        }
        imageUri = `ipfs://${result.ipfsHash}`;
      }

      // Step 2: Submit joke and image URI to the smart contract
      await writeContractAsync({
        ...dadChainCoreContract,
        functionName: "submitJoke",
        args: [joke, imageUri],
      });

      // Step 3: Handle success
      alert("Joke submitted successfully!");
      setJoke("");
      setImageFile(null);
    } catch (error: any) {
      console.error("Error submitting joke:", error);
      alert(`Submission failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <Card className="mb-8 border-orange-100 shadow-sm transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Tell a Dad Joke
        </CardTitle>
        <CardDescription>
          The funnier the joke, the better the rewards!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="What's the best time to go to the dentist? Tooth-hurty!"
              value={joke}
              onChange={(e) => setJoke(e.target.value)}
              className="min-h-[100px] pr-10"
              maxLength={MAX_JOKE_LENGTH}
              required
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {joke.length} / {MAX_JOKE_LENGTH}
            </div>
          </div>

          {previewUrl ? (
            <div className="relative w-fit">
              <Image
                src={previewUrl}
                alt="Image preview"
                width={100}
                height={100}
                className="rounded-md object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={() => setImageFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label className="flex w-full cursor-pointer items-center space-x-2 rounded-md border-2 border-dashed border-gray-300 p-4 text-center text-gray-500 hover:bg-gray-50">
              <ImagePlus className="h-5 w-5" />
              <span>Add an image (optional)</span>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setImageFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </label>
          )}

          <Button
            type="submit"
            disabled={!joke.trim() || isSubmitting || isUploading}
            className="w-full bg-orange-600 hover:bg-orange-700 transition-all duration-300 transform hover:scale-105"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading Image...
              </>
            ) : isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting to Blockchain...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Joke
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
