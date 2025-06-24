import React from "react";
import { useParams } from "react-router-dom";
import ReviewDisplay from "../components/review.jsx";
import ReviewForm from "../components/review-form.jsx";
import Footer from "../components/Footer";

export default function ReviewPage() {
  const { masterId } = useParams();

  //   console.log("ReviewPage: masterId from URL params:", masterId)

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {masterId ? (
          <>
            {/* <div className="w-full max-w-[1400px] mb-10">
              <ReviewDisplay masterId={masterId} />
            </div> */}
            <div className="w-full max-w-[1400px]">
              <ReviewForm masterId={masterId} />
            </div>
          </>
        ) : (
          <div className="text-center text-red-500 text-lg p-6 bg-white rounded-lg shadow-md">
            Rəy yazmaq üçün peşəkar ID-si tapılmadı. Zəhmət olmasa, peşəkarın
            profil səhifəsindən gəlin.
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
