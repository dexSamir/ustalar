import React from "react"
import ReviewDisplay from "../components/review-display.jsx"
import ReviewForm from "../components/review-form.jsx"

export default function ReviewPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-[1400px] mb-10">
        <ReviewDisplay />
      </div>
      <div className="w-full max-w-[1400px]">
        <ReviewForm />
      </div>
    </main>
  )
}
