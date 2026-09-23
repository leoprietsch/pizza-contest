'use client';

import { useState, useEffect } from 'react';
import { Trophy, CheckCircle, Clock, RefreshCw, Award } from 'lucide-react';

interface FlavorScoreResult {
  flavor: string;
  criatividadeAverage: number;
  aparenciaAverage: number;
  saborAverage: number;
  overallAverage: number;
  totalVotesCount: number;
}

interface AdminData {
  totalFlavors: number;
  completedFlavors: string[];
  pendingFlavors: string[];
  submissions: any[];
  leaderboard: FlavorScoreResult[];
  winner: FlavorScoreResult | null;
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !data) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <p className="font-caveat text-3xl text-[#8B261D] flex items-center gap-2">
          <RefreshCw className="animate-spin" /> Loading dashboard...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] py-8 px-4 text-[#4A1D18]">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Top Header & Winner Action */}
        <div className="bg-[#FFFDF9] border-2 border-[#8B261D] rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="font-caveat text-4xl sm:text-5xl font-black text-[#8B261D]">
              VOTE TALLY
            </h1>
            <p className="text-sm text-[#6E2A23] font-medium mt-1">
              Track who has voted and reveal the winning pizza flavor!
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={fetchData}
              className="p-3 border-2 border-[#8B261D] text-[#8B261D] rounded-xl hover:bg-[#8B261D]/10 transition flex items-center justify-center"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              disabled={data?.completedFlavors.length !== data?.totalFlavors}
              onClick={() => setShowWinnerModal(true)}
              className="flex-1 md:flex-none px-6 py-3 bg-[#8B261D] hover:bg-[#6E2A23] disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed text-white font-black text-lg tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5 text-yellow-300" />
              REVEAL CHAMPION
            </button>
          </div>
        </div>

        {/* Voting Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Completed Flavors */}
          <div className="bg-[#FFFDF9] border-2 border-emerald-600/30 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-700 mb-4">
              <CheckCircle className="w-6 h-6" />
              <h2 className="font-caveat text-3xl font-bold">
                SUBMITTED ({data?.completedFlavors.length}/{data?.totalFlavors})
              </h2>
            </div>
            {data?.completedFlavors.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No submissions yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {data?.completedFlavors.map((flavor) => (
                  <span
                    key={flavor}
                    className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold font-caveat text-xl rounded-lg border border-emerald-300"
                  >
                    {flavor}
                  </span>
                ))}
              </div>
            )}
          </div>
          

          {/* Pending Flavors */}
          <div className="bg-[#FFFDF9] border-2 border-amber-600/30 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-amber-700 mb-4">
              <Clock className="w-6 h-6" />
              <h2 className="font-caveat text-3xl font-bold">
                PENDING ({data?.pendingFlavors.length})
              </h2>
            </div>
            {data?.pendingFlavors.length === 0 ? (
              <p className="text-sm text-emerald-700 font-bold">All flavors have submitted!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {data?.pendingFlavors.map((flavor) => (
                  <span
                    key={flavor}
                    className="px-3 py-1 bg-amber-50 text-amber-800 font-bold font-caveat text-xl rounded-lg border border-amber-200"
                  >
                    {flavor}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Standings Table */}
        <div hidden={data?.completedFlavors.length !== data?.totalFlavors} className="bg-[#FFFDF9] border-2 border-[#8B261D] rounded-2xl p-6 shadow-md">
          <h2 className="font-caveat text-3xl font-extrabold text-[#8B261D] mb-4 flex items-center gap-2">
            <Award className="w-7 h-7" /> FINAL RANKINGS
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#E8D2C9] text-[#8B261D]">
                  <th className="py-3 px-2 font-caveat text-2xl">FLAVOR</th>
                  <th className="py-3 px-2 font-caveat text-xl text-center">CREATIVITY</th>
                  <th className="py-3 px-2 font-caveat text-xl text-center">APPEARANCE</th>
                  <th className="py-3 px-2 font-caveat text-xl text-center">TASTE</th>
                  <th className="py-3 px-2 font-caveat text-2xl text-center font-black">OVERALL</th>
                </tr>
              </thead>
              <tbody>
                {data?.leaderboard.map((item, index) => (
                  <tr
                    key={item.flavor}
                    className="border-b border-[#E8D2C9] last:border-0 hover:bg-[#FDFBF7]"
                  >
                    <td className="py-4 px-2 font-caveat text-2xl font-bold text-[#2B100D] flex items-center gap-2">
                      <span className="w-6 text-sm font-sans font-bold text-gray-400">
                        #{index + 1}
                      </span>
                      {item.flavor}
                    </td>
                    <td className="py-4 px-2 text-center text-lg font-bold">{item.criatividadeAverage} ⭐</td>
                    <td className="py-4 px-2 text-center text-lg font-bold">{item.aparenciaAverage} ⭐</td>
                    <td className="py-4 px-2 text-center text-lg font-bold">{item.saborAverage} ⭐</td>
                    <td className="py-4 px-2 text-center font-caveat text-3xl font-black text-[#8B261D]">
                      {item.overallAverage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Winner Announcement Modal */}
        {showWinnerModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#FFFDF9] border-4 border-[#8B261D] rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-2 animate-bounce" />
              <h2 className="font-caveat text-3xl font-bold text-[#6E2A23]">WINNING FLAVOR!</h2>

              {data?.winner ? (
                <div className="my-6 space-y-3">
                  <h3 className="font-caveat text-5xl font-black text-[#8B261D] uppercase tracking-wide">
                    {data.winner.flavor}
                  </h3>
                  <div className="inline-block bg-yellow-100 border-2 border-yellow-400 px-6 py-2 rounded-2xl">
                    <p className="font-caveat text-3xl font-bold text-yellow-900">
                      Overall: {data.winner.overallAverage} ⭐
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm pt-4 text-[#6E2A23] font-semibold border-t border-[#E8D2C9]">
                    <div>
                      <p className="text-xs text-gray-500">Creativity</p>
                      <p className="text-lg">{data.winner.criatividadeAverage}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Appearance</p>
                      <p className="text-lg">{data.winner.aparenciaAverage}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Taste</p>
                      <p className="text-lg">{data.winner.saborAverage}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-lg text-gray-600 my-6">
                  No submissions recorded yet to calculate a winner.
                </p>
              )}

              <button
                onClick={() => setShowWinnerModal(false)}
                className="w-full py-3 bg-[#8B261D] hover:bg-[#6E2A23] text-white font-bold text-lg rounded-xl transition uppercase"
              >
                CLOSE
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
