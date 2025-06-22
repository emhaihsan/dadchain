"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send } from "lucide-react"

export function JokeSubmissionForm() {
  const [joke, setJoke] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!joke.trim()) return

    setIsSubmitting(true)

    // Mock submission process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setJoke("")
    setImage(null)
    setIsSubmitting(false)

    // Show success message (in real app, would show transaction hash)
    alert("Joke submitted to blockchain! 🎉")
  }

  return (
    <Card className="mb-8 border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>📝</span>
          <span>Share Your Dad Joke</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="joke">Your Dad Joke</Label>
            <Textarea
              id="joke"
              placeholder="Why don't scientists trust atoms? Because they make up everything!"
              value={joke}
              onChange={(e) => setJoke(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={280}
            />
            <div className="text-sm text-gray-500 mt-1">{joke.length}/280 characters</div>
          </div>

          <div>
            <Label htmlFor="image">Optional Image (stored on IPFS)</Label>
            <div className="mt-1">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={!joke.trim() || isSubmitting}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting to Blockchain...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Joke (Gas: ~0.001 ETH)
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
