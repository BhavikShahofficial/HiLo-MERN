import { StarIcon } from "lucide-react";

function StarRatingComponent({ rating, handleRatingChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={
            handleRatingChange ? () => handleRatingChange(star) : undefined
          }
          className="p-0.5 hover:scale-110 transition-transform"
        >
          <StarIcon
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default StarRatingComponent;
