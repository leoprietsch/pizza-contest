'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Pizza, Lock } from 'lucide-react';

// Inline pizza SVG icon — used instead of stars in the rating widget.
// A top-down pizza circle with three slices and two small circles for toppings.
function PizzaIcon({
  filled,
  fillColor = '#E26F56',
  outlineColor = '#2B100D',
  className = '',
}: {
  filled: boolean;
  fillColor?: string;
  outlineColor?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pizza base circle */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill={filled ? fillColor : 'none'}
        stroke={outlineColor}
        strokeWidth="1.5"
      />
      {/* Slice divider lines */}
      <line x1="12" y1="2" x2="12" y2="22" stroke={outlineColor} strokeWidth="1" opacity="0.5" />
      <line x1="2.1" y1="8" x2="21.9" y2="16" stroke={outlineColor} strokeWidth="1" opacity="0.5" />
      <line x1="2.1" y1="16" x2="21.9" y2="8" stroke={outlineColor} strokeWidth="1" opacity="0.5" />
      {/* Toppings (small circles) — visible when filled */}
      {filled && (
        <>
          <circle cx="12" cy="8" r="1.2" fill={outlineColor} opacity="0.55" />
          <circle cx="8.5" cy="14" r="1.2" fill={outlineColor} opacity="0.55" />
          <circle cx="15.5" cy="14" r="1.2" fill={outlineColor} opacity="0.55" />
        </>
      )}
    </svg>
  );
}

const FLAVORS = ['Pepperoni', 'Margherita', 'Bacon', 'Vegetarian'];

const CRITERIA = [
  { key: 'criatividade', label: 'CREATIVITY' },
  { key: 'aparencia', label: 'APPEARANCE' },
  { key: 'sabor', label: 'TASTE' },
] as const;

type CategoryKey = (typeof CRITERIA)[number]['key'];

export default function PizzaReviewForm() {
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [completedFlavors, setCompletedFlavors] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [ratings, setRatings] = useState<Record<string, Record<CategoryKey, number>>>(() =>
    FLAVORS.reduce((acc, flavor) => {
      acc[flavor] = { criatividade: 0, aparencia: 0, sabor: 0 };
      return acc;
    }, {} as Record<string, Record<CategoryKey, number>>)
  );

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync completed flavors list from server memory on load
  const fetchCompletedFlavors = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.completedFlavors) {
        setCompletedFlavors(data.completedFlavors);
      }
    } catch (err) {
      console.error('Error fetching completed flavors', err);
    }
  };

  useEffect(() => {
    fetchCompletedFlavors();
  }, []);

  const handleRate = (flavor: string, category: CategoryKey, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [flavor]: {
        ...prev[flavor],
        [category]: value,
      },
    }));
  };

  const handleSelectFlavor = (flavor: string) => {
    if (completedFlavors.includes(flavor)) return;
    setSelectedFlavor(flavor);
    setIsModalOpen(false);
    setErrorMessage('');
  };

  // Form Validation: Returns true if any active (non-own) flavor has
  // at least one category left with 0 stars.
  const isFormInvalid =
    !selectedFlavor ||
    FLAVORS.some((flavor) => {
      if (flavor === selectedFlavor) return false; // Skip the user's own flavor
      const flavorRatings = ratings[flavor];
      return (
        flavorRatings.criatividade === 0 ||
        flavorRatings.aparencia === 0 ||
        flavorRatings.sabor === 0
      );
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isFormInvalid) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flavor: selectedFlavor, reviews: ratings }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Error submitting review.');
        fetchCompletedFlavors();
        setIsModalOpen(true);
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setErrorMessage('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-[#4A1D18]">
        <div className="bg-[#FFFDF9] border-2 border-[#8B261D] rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <CheckCircle2 className="w-16 h-16 text-[#8B261D] mx-auto mb-4" />
          <h2 className="font-caveat text-4xl font-extrabold tracking-wide mb-2">
            THANK YOU!
          </h2>
          <p className="text-lg text-[#6E2A23]">Your review has been recorded successfully.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] py-8 px-4 flex justify-center text-[#4A1D18] relative">
      
      {/* Flavor Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border-2 border-[#8B261D] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center">
            <Pizza className="w-12 h-12 text-[#8B261D] mx-auto mb-2" />
            <h2 className="font-caveat text-4xl font-extrabold text-[#8B261D] mb-1">
              WHICH FLAVOR DID YOU MAKE?
            </h2>
            <p className="text-sm text-[#6E2A23] mb-6 font-semibold">
              Select your pizza flavor to begin rating.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-semibold">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1">
              {FLAVORS.map((flavor) => {
                const isDone = completedFlavors.includes(flavor);
                return (
                  <button
                    key={flavor}
                    type="button"
                    disabled={isDone}
                    onClick={() => handleSelectFlavor(flavor)}
                    className={`py-3 px-4 rounded-xl font-caveat text-2xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                      isDone
                        ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed opacity-60'
                        : selectedFlavor === flavor
                        ? 'bg-[#8B261D] text-white border-[#8B261D]'
                        : 'border-[#E8D2C9] text-[#2B100D] hover:border-[#8B261D]'
                    }`}
                  >
                    {flavor}
                    {isDone && <Lock className="w-4 h-4 text-gray-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Scorecard Form */}
      <div className="w-full max-w-lg bg-[#FFFDF9] border-2 border-dashed border-[#8B261D] rounded-2xl p-6 sm:p-8 shadow-xl relative">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-caveat text-4xl sm:text-5xl font-black tracking-widest text-[#8B261D] uppercase">
            PIZZA REVIEW
          </h1>
          {selectedFlavor && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-2 text-sm text-[#8B261D] underline font-semibold block mx-auto"
            >
              Rating as: <strong>{selectedFlavor}</strong> (Change)
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {FLAVORS.map((flavor) => {
            const isOwnFlavor = selectedFlavor === flavor;

            return (
              <div
                key={flavor}
                className={`text-center space-y-3 pb-6 border-b border-[#E8D2C9] last:border-b-0 ${
                  isOwnFlavor ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <h2 className="font-caveat text-xl sm:text-2xl font-black tracking-wider uppercase text-[#2B100D]">
                  {flavor}
                </h2>

                {isOwnFlavor ? (
                  <p className="font-caveat text-lg text-[#8B261D] italic font-bold">
                    (Your flavor - rating blocked)
                  </p>
                ) : (
                  CRITERIA.map(({ key, label }) => (
                    <div
                      key={key}
                      className="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-1"
                    >
                      <span className="font-caveat text-sm font-bold tracking-widest text-[#8B261D] italic mb-1 sm:mb-0">
                        {label}
                      </span>

                      {/* Pizza Rating Bar with Half Pizzas */}
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((pizzaIndex) => {
                          const currentRating = ratings[flavor][key];
                          const isFull = currentRating >= pizzaIndex;
                          const isHalf = currentRating === pizzaIndex - 0.5;

                          return (
                            <div
                              key={pizzaIndex}
                              className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center"
                            >
                              {/* Outline pizza — always visible */}
                              <PizzaIcon
                                filled={false}
                                outlineColor="#2B100D"
                                className="w-full h-full absolute inset-0"
                              />

                              {/* Filled pizza overlay — clipped for half support */}
                              {(isFull || isHalf) && (
                                <div
                                  className="absolute inset-0 overflow-hidden"
                                  style={{ width: isHalf ? '50%' : '100%' }}
                                >
                                  <PizzaIcon
                                    filled={true}
                                    fillColor="#E26F56"
                                    outlineColor="#2B100D"
                                    className="w-7 h-7 sm:w-8 sm:h-8 absolute left-0 top-0"
                                  />
                                </div>
                              )}

                              {/* Left half click zone → half value */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRate(flavor, key, pizzaIndex - 0.5);
                                }}
                                className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer touch-manipulation focus:outline-none"
                                aria-label={`Rate ${pizzaIndex - 0.5} pizza${pizzaIndex - 0.5 !== 1 ? 's' : ''}`}
                              />

                              {/* Right half click zone → whole value */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRate(flavor, key, pizzaIndex);
                                }}
                                className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer touch-manipulation focus:outline-none"
                                aria-label={`Rate ${pizzaIndex} pizza${pizzaIndex !== 1 ? 's' : ''}`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isFormInvalid || isSubmitting}
            className={`w-full py-4 rounded-xl font-caveat text-2xl font-bold tracking-wide uppercase transition-all ${
              isFormInvalid || isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#8B261D] text-white hover:bg-[#6E2A23]'
            }`}
          >
            {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
          </button>
        </form>
      </div>
    </main>
  );
}
