import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { FaStar, FaQuoteLeft, FaCheckCircle, FaUserCircle } from 'react-icons/fa';

const sampleReviews = [
  {
    id: 1,
    name: 'Eleanor Vance',
    role: 'Executive Suite Guest',
    rating: 5,
    date: 'August 2026',
    comment:
      'The service was unparalleled. From the express check-in to the panoramic ocean views and Michelin-standard dinners, Grand Hotel exceeded every expectation.',
  },
  {
    id: 2,
    name: 'Marcus Sterling',
    role: 'Deluxe Suite Guest',
    rating: 5,
    date: 'July 2026',
    comment:
      'An absolute haven of tranquility. The bed was remarkably comfortable and the M-Pesa deposit process was seamless and instantaneous.',
  },
  {
    id: 3,
    name: 'Dr. Sophia Chen',
    role: 'Superior Suite Guest',
    rating: 5,
    date: 'June 2026',
    comment:
      'The spa and wellness facilities are top notch. The concierge arranged private transportation effortlessly. We will definitely return annually.',
  },
];

const Feedback = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [guestName, setGuestName] = useState(user?.name || '');
  const [comments, setComments] = useState('');
  const [reviews, setReviews] = useState(sampleReviews);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReview = {
      id: Date.now(),
      name: guestName || 'Anonymous Guest',
      role: 'Verified Guest',
      rating,
      date: 'Just now',
      comment: comments,
    };

    setReviews([newReview, ...reviews]);
    setSubmitted(true);

    Swal.fire({
      title: 'Thank You!',
      text: 'Your review has been published. We appreciate your valuable feedback!',
      icon: 'success',
      confirmButtonColor: '#cfa64b',
      background: '#0f172a',
      color: '#f8fafc',
    });

    setComments('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
            Guest Testimonials
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
            We Value Your Experience
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Your impressions shape the perfection of Grand Hotel. Share your stay reflections or read reviews from our global guests.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Feedback Form Card */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-luxury h-fit">
            <h3 className="font-serif text-xl font-bold text-white mb-1">
              Leave a Review
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Rate your stay, dining, and concierge service
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Star Rating selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="text-2xl transition transform hover:scale-125 focus:outline-none"
                    >
                      <FaStar
                        className={
                          (hoverRating || rating) >= star
                            ? 'text-gold-400 fill-current'
                            : 'text-gray-700'
                        }
                      />
                    </button>
                  ))}
                  <span className="text-xs text-gold-300 font-semibold ml-2">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Guest Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Kamau"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/60"
                />
              </div>

              {/* Feedback Comments */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Review & Comments
                </label>
                <textarea
                  rows="4"
                  placeholder="Share details of your room, meals, or spa service..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-gold-500/60"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-black font-bold text-xs uppercase tracking-wider transition shadow-luxury"
              >
                Submit Review
              </button>
            </form>
          </div>

          {/* Testimonials List */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-serif text-xl font-bold text-white flex items-center justify-between">
              <span>Verified Guest Reflections</span>
              <span className="text-xs font-sans text-gold-400 font-semibold">
                {reviews.length} Reviews
              </span>
            </h3>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md hover:border-gold-500/30 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center font-bold text-sm">
                        {rev.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-white">{rev.name}</div>
                        <div className="text-[11px] text-gray-400">{rev.role} • {rev.date}</div>
                      </div>
                    </div>

                    {/* Star icons */}
                    <div className="flex items-center text-gold-400 text-xs">
                      {[...Array(rev.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
