import ReviewCard from "./ReviewCard";

const REVIEWS = [
  { name: "Charu", years: "5 years on Airbnb", date: "1 day ago", text: "Great place worth the price. Surely visitable again.", bg: "bg-red-100" },
  { name: "Adarsh Kumar", years: "New to Airbnb", date: "1 week ago", text: "it was very amazing experience and they are very helpful", bg: "bg-purple-200" },
  { name: "Pallavi", years: "4 years on Airbnb", date: "2 weeks ago", text: "We had a wonderful stay at this beautiful 2BHK villa in Goa! The villa was clean, spacious, and tastefully designed, with all the amenities needed for a comfortable vacation. The ...", showMore: true, avatar: "https://i.pravatar.cc/80?img=47" },
  { name: "Angshuman", years: "8 years on Airbnb", date: "3 weeks ago", text: "This is a great place to stay during a holiday with friends or family.", avatar: "https://i.pravatar.cc/80?img=12" },
  { name: "Sujaan", years: "7 years on Airbnb", date: "June 2026", text: "We had such a wonderful stay at your property. The accommodations were very comfortable and well-...", avatar: "https://i.pravatar.cc/80?img=15" },
  { name: "Abhishek", years: "5 years on Airbnb", date: "June 2026", text: "Arpit is very great person. Awesome property. Even handed over the messy property due to toddler but he was super chill.", bg: "bg-orange-100" },
];

export default function ReviewSection() {
  return (
    <section className="border-b border-gray-200 py-8">
      <div className="grid grid-cols-2 gap-x-12 gap-y-8">
        {REVIEWS.map((r) => (
          <ReviewCard key={r.name} review={r} />
        ))}
      </div>
      <button className="mt-8 rounded-lg border border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900">
        Show all 47 reviews
      </button>
    </section>
  );
}
