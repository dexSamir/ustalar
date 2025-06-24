import { Star } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function ReviewDisplay() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState("newest");

  const sortOptions = [
    { label: "Ən yenilər", value: "newest" },
    { label: "Ən yüksək reytinq", value: "highest" },
    { label: "Ən aşağı reytinq", value: "lowest" },
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          "https://masters-1.onrender.com/api/v1/professionals/53/reviews/"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const formattedReviews = data.map((apiReview) => ({
          id: apiReview.id,
          reviewerName: apiReview.name || "Anonim hesab",
          isAnonymous: !apiReview.name,
          rating: apiReview.rating,
          date: new Date(apiReview.created_at).toLocaleDateString("az-AZ", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          text: apiReview.text,
          tags: apiReview.tags ? JSON.parse(apiReview.tags) : [],
          imageUrl:
            apiReview.images && apiReview.images.length > 0
              ? apiReview.images[0].image
              : undefined,
          profileImageUrl: "/placeholder.svg?height=40&width=40",
        }));
        setReviews(formattedReviews);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const calculateRatingDistribution = (reviews) => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating]++;
      }
    });

    const totalReviews = reviews.length;
    const percentages = {};
    for (let i = 1; i <= 5; i++) {
      percentages[i] =
        totalReviews > 0 ? (distribution[i] / totalReviews) * 100 : 0;
    }
    return { distribution, percentages, totalReviews };
  };

  const calculateOverallRating = (reviews) => {
    if (reviews.length === 0) return { average: 0, total: 0 };
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return {
      average: (totalRating / reviews.length).toFixed(1),
      total: reviews.length,
    };
  };

  const { distribution, percentages, totalReviews } =
    calculateRatingDistribution(reviews);
  const { average: overallAverage, total: overallTotal } =
    calculateOverallRating(reviews);

  const POPULAR_TAGS = [
    "#Məsuliyyət",
    "#Səliqə",
    "#Çevik",
    "#Vaxta nəzarət",
    "#Dəqiq",
  ];

  if (loading) {
    return (
      <div className="mx-auto p-6 max-w-[1400px] bg-white rounded-lg text-center">
        Rəylər yüklənir...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto p-6 max-w-[1400px] bg-white rounded-lg text-center text-red-500">
        {" "}
        // Removed shadow-md Rəylər yüklənərkən xəta baş verdi: {error}
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 max-w-[1400px] bg-white rounded-lg">
      {" "}
      <h2 className="font-bold text-2xl mb-6">Reytinq və rəylər</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-gray-50">
          <div className="text-5xl font-bold text-blue-600">
            {overallAverage}
          </div>
          <div className="flex text-yellow-400 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={
                  star <= Math.round(Number.parseFloat(overallAverage))
                    ? "fill-yellow-400"
                    : ""
                }
              />
            ))}
          </div>
          <p className="text-gray-600">Toplam {overallTotal} ray</p>
        </div>

        <div className="md:col-span-1 p-4 border rounded-lg">
          <h3 className="font-semibold mb-4">Reytinq bölgüsü</h3>
          {Object.entries(distribution)
            .sort(([a], [b]) => Number.parseInt(b) - Number.parseInt(a))
            .map(([star, count]) => (
              <div key={star} className="flex items-center mb-2">
                <span className="w-4 text-sm font-medium">{star}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-2" />
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${percentages[Number.parseInt(star)]}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-gray-600">{count}</span>
              </div>
            ))}
        </div>

        <div className="md:col-span-1 p-4 border rounded-lg">
          <h3 className="font-semibold mb-4">Haqqında etiketlər</h3>
          <div className="flex flex-wrap gap-2">
            {POPULAR_TAGS.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#cde4f2] text-[#1a4862]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl">Müştəri Rəyləri</h3>
          <div className="relative inline-block text-left">
            <button
              onClick={() => setIsSelectOpen(!isSelectOpen)}
              className="inline-flex justify-between items-center w-[180px] p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50"
            >
              {sortOptions.find((option) => option.value === selectedSortOption)
                ?.label || "Sıralama üzrə: Ən yenilər"}
              <Star className="w-4 h-4 ml-2" />
            </button>
            {isSelectOpen && (
              <div className="absolute right-0 mt-2 w-[180px] bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedSortOption(option.value);
                      setIsSelectOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      selectedSortOption === option.value ? "bg-blue-100" : ""
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-center text-gray-600">
              Hələ heç bir rəy yoxdur. İlk rəyi siz yazın!
            </p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="p-4 rounded-lg bg-white">
                {" "}
                <div className="p-0">
                  {" "}
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 mr-3 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                      {" "}
                      <img
                        src={review.profileImageUrl || "/placeholder.svg"}
                        alt={review.reviewerName}
                        className="rounded-full w-full h-full object-cover"
                      />
                      {!review.profileImageUrl && (
                        <span>{review.reviewerName.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {review.reviewerName}
                      </p>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                    <div className="ml-auto flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating ? "fill-yellow-400" : ""
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{review.text}</p>
                  {review.imageUrl && (
                    <img
                      src={review.imageUrl || "/placeholder.svg"}
                      alt="Review image"
                      width={200}
                      height={150}
                      className="rounded-lg object-cover mb-3"
                    />
                  )}
                  <div className="flex flex-wrap gap-2">
                    {review.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#cde4f2] text-[#1a4862]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-8">
        <button className="px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md">
          Hamısına bax ({overallTotal})
        </button>
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
          Rəyinizi bizimlə bölüşün
        </button>
      </div>
    </div>
  );
}
