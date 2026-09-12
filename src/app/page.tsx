'use client';

import { useState, useEffect } from 'react';
import { Star, CheckCircle2, User, Lock } from 'lucide-react';

const REVIEWERS = [
  'Muri',
  'Leo',
  'Carol',
  'Gabriel',
  'Lu',
  'Thiago',
  'Andres',
  'Nicolas',
  'Henrique',
  'Pedro',
];

const REVIEWER_DUO_MAP: Record<string, string> = {
  Muri: 'Muri e Leo',
  Leo: 'Muri e Leo',
  Carol: 'Carol e Gabriel',
  Gabriel: 'Carol e Gabriel',
  Lu: 'Lu e Thiago',
  Thiago: 'Lu e Thiago',
  Andres: 'Andres e Nicolas',
  Nicolas: 'Andres e Nicolas',
  Henrique: 'Henrique e Pedro',
  Pedro: 'Henrique e Pedro',
};

const PAIRS = [
  'Muri e Leo',
  'Carol e Gabriel',
  'Lu e Thiago',
  'Andres e Nicolas',
  'Henrique e Pedro',
];

const CRITERIA = [
  { key: 'criatividade', label: 'CRIATIVIDADE' },
  { key: 'aparencia', label: 'APARÊNCIA' },
  { key: 'sabor', label: 'SABOR' },
] as const;

type CategoryKey = (typeof CRITERIA)[number]['key'];

export default function PizzaReviewForm() {
  const [selectedReviewer, setSelectedReviewer] = useState<string>('');
  const [completedReviewers, setCompletedReviewers] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [ratings, setRatings] = useState<Record<string, Record<CategoryKey, number>>>(() =>
    PAIRS.reduce((acc, pair) => {
      acc[pair] = { criatividade: 0, aparencia: 0, sabor: 0 };
      return acc;
    }, {} as Record<string, Record<CategoryKey, number>>)
  );

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync completed reviewers list from server memory on load
  const fetchCompletedReviewers = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.completedReviewers) {
        setCompletedReviewers(data.completedReviewers);
      }
    } catch (err) {
      console.error('Erro ao buscar avaliadores concluídos', err);
    }
  };

  useEffect(() => {
    fetchCompletedReviewers();
  }, []);

  const handleRate = (pair: string, category: CategoryKey, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [pair]: {
        ...prev[pair],
        [category]: value,
      },
    }));
  };

  const handleSelectReviewer = (name: string) => {
    if (completedReviewers.includes(name)) return;
    setSelectedReviewer(name);
    setIsModalOpen(false);
    setErrorMessage('');
  };

  // -------------------------------------------------------------
  // Form Validation: Returns true if any active (non-self) duo has
  // at least one category left with 0 stars.
  // -------------------------------------------------------------
  const ownDuo = selectedReviewer ? REVIEWER_DUO_MAP[selectedReviewer] : null;

  const isFormInvalid =
    !selectedReviewer ||
    PAIRS.some((pair) => {
      if (pair === ownDuo) return false; // Skip the reviewer's own duo
      const pairRatings = ratings[pair];
      return (
        pairRatings.criatividade === 0 ||
        pairRatings.aparencia === 0 ||
        pairRatings.sabor === 0
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
        body: JSON.stringify({ reviewer: selectedReviewer, reviews: ratings }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Erro ao enviar avaliação.');
        fetchCompletedReviewers();
        setIsModalOpen(true);
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setErrorMessage('Falha ao enviar avaliação. Tente novamente.');
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
            OBRIGADO, {selectedReviewer.toUpperCase()}!
          </h2>
          <p className="text-lg text-[#6E2A23]">Sua avaliação foi registrada com sucesso.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] py-8 px-4 flex justify-center text-[#4A1D18] relative">
      
      {/* Identity Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border-2 border-[#8B261D] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center">
            <User className="w-12 h-12 text-[#8B261D] mx-auto mb-2" />
            <h2 className="font-caveat text-4xl font-extrabold text-[#8B261D] mb-1">
              QUEM É VOCÊ?
            </h2>
            <p className="text-sm text-[#6E2A23] mb-6 font-semibold">
              Selecione seu nome para iniciar a avaliação.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-semibold">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1">
              {REVIEWERS.map((name) => {
                const isDone = completedReviewers.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    disabled={isDone}
                    onClick={() => handleSelectReviewer(name)}
                    className={`py-3 px-4 rounded-xl font-caveat text-2xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                      isDone
                        ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed opacity-60'
                        : selectedReviewer === name
                        ? 'bg-[#8B261D] text-white border-[#8B261D]'
                        : 'border-[#E8D2C9] text-[#2B100D] hover:border-[#8B261D]'
                    }`}
                  >
                    {name}
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
            AVALIAÇÃO
          </h1>
          {selectedReviewer && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-2 text-sm text-[#8B261D] underline font-semibold block mx-auto"
            >
              Avaliando como: <strong>{selectedReviewer}</strong> (Alterar)
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {PAIRS.map((pair) => {
            const isOwnDuo = selectedReviewer && REVIEWER_DUO_MAP[selectedReviewer] === pair;

            return (
              <div
                key={pair}
                className={`text-center space-y-3 pb-6 border-b border-[#E8D2C9] last:border-b-0 ${
                  isOwnDuo ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <h2 className="font-caveat text-xl sm:text-2xl font-black tracking-wider uppercase text-[#2B100D]">
                  {pair}
                </h2>

                {isOwnDuo ? (
                  <p className="font-caveat text-lg text-[#8B261D] italic font-bold">
                    (Sua dupla - avaliação bloqueada)
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

                      {/* Star Rating Bar with Half Stars */}
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((starIndex) => {
                          const currentRating = ratings[pair][key];
                          const isFull = currentRating >= starIndex;
                          const isHalf = currentRating === starIndex - 0.5;

                          return (
                            <div
                              key={starIndex}
                              className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center"
                            >
                              <Star className="w-full h-full text-[#2B100D] fill-transparent stroke-[1.5] absolute inset-0" />

                              {(isFull || isHalf) && (
                                <div
                                  className="absolute inset-0 overflow-hidden"
                                  style={{ width: isHalf ? '50%' : '100%' }}
                                >
                                  <Star className="w-7 h-7 sm:w-8 sm:h-8 fill-[#E26F56] text-[#E26F56] absolute left-0 top-0" />
                                </div>
                              )}

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRate(pair, key, starIndex - 0.5);
                                }}
                                className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer touch-manipulation focus:outline-none"
                              />

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRate(pair, key, starIndex);
                                }}
                                className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer touch-manipulation focus:outline-none"
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

          <button
            type="submit"
            disabled={isSubmitting || isFormInvalid}
            className="w-full py-4 bg-[#8B261D] hover:bg-[#6E2A23] text-[#FFFDF9] font-black text-lg tracking-widest rounded-xl transition duration-200 shadow-md uppercase disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'ENVIANDO...' : 'ENVIAR AVALIAÇÃO'}
          </button>
        </form>
      </div>
    </main>
  );
}