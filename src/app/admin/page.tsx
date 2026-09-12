'use client';

import { useState, useEffect } from 'react';
import { Trophy, CheckCircle, Clock, RefreshCw, Star, Award } from 'lucide-react';

interface DuoScoreResult {
  duo: string;
  criatividadeAverage: number;
  aparenciaAverage: number;
  saborAverage: number;
  overallAverage: number;
  totalVotesCount: number;
}

interface AdminData {
  totalReviewers: number;
  completedReviewers: string[];
  pendingReviewers: string[];
  submissions: any[];
  leaderboard: DuoScoreResult[];
  winner: DuoScoreResult | null;
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
          <RefreshCw className="animate-spin" /> Carregando painel de controle...
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
              APURAÇÃO DE VOTOS
            </h1>
            <p className="text-sm text-[#6E2A23] font-medium mt-1">
              Acompanhe quem já votou e descubra a dupla campeã!
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={fetchData}
              className="p-3 border-2 border-[#8B261D] text-[#8B261D] rounded-xl hover:bg-[#8B261D]/10 transition flex items-center justify-center"
              title="Atualizar Dados"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              disabled={data?.completedReviewers.length !== data?.totalReviewers}
              onClick={() => setShowWinnerModal(true)}
              className="flex-1 md:flex-none px-6 py-3 bg-[#8B261D] hover:bg-[#6E2A23] disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed text-white font-black text-lg tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5 text-yellow-300" />
              REVELAR CAMPEÃO
            </button>
          </div>
        </div>

        {/* Voting Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Completed Reviewers */}
          <div className="bg-[#FFFDF9] border-2 border-emerald-600/30 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-700 mb-4">
              <CheckCircle className="w-6 h-6" />
              <h2 className="font-caveat text-3xl font-bold">
                JÁ VOTARAM ({data?.completedReviewers.length}/{data?.totalReviewers})
              </h2>
            </div>
            {data?.completedReviewers.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Nenhum voto registrado ainda.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {data?.completedReviewers.map((name) => (
                  <span
                    key={name}
                    className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold font-caveat text-xl rounded-lg border border-emerald-300"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>
          

          {/* Pending Reviewers */}
          <div className="bg-[#FFFDF9] border-2 border-amber-600/30 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-amber-700 mb-4">
              <Clock className="w-6 h-6" />
              <h2 className="font-caveat text-3xl font-bold">
                PENDENTES ({data?.pendingReviewers.length})
              </h2>
            </div>
            {data?.pendingReviewers.length === 0 ? (
              <p className="text-sm text-emerald-700 font-bold">Todos os jurados já votaram!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {data?.pendingReviewers.map((name) => (
                  <span
                    key={name}
                    className="px-3 py-1 bg-amber-50 text-amber-800 font-bold font-caveat text-xl rounded-lg border border-amber-200"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Standings Table */}
        <div hidden={data?.completedReviewers.length !== data?.totalReviewers} className="bg-[#FFFDF9] border-2 border-[#8B261D] rounded-2xl p-6 shadow-md">
          <h2 className="font-caveat text-3xl font-extrabold text-[#8B261D] mb-4 flex items-center gap-2">
            <Award className="w-7 h-7" /> CLASSIFICAÇÃO GERAL
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#E8D2C9] text-[#8B261D]">
                  <th className="py-3 px-2 font-caveat text-2xl">DUPLA</th>
                  <th className="py-3 px-2 font-caveat text-xl text-center">CRIATIVIDADE</th>
                  <th className="py-3 px-2 font-caveat text-xl text-center">APARÊNCIA</th>
                  <th className="py-3 px-2 font-caveat text-xl text-center">SABOR</th>
                  <th className="py-3 px-2 font-caveat text-2xl text-center font-black">MÉDIA GERAL</th>
                </tr>
              </thead>
              <tbody>
                {data?.leaderboard.map((item, index) => (
                  <tr
                    key={item.duo}
                    className="border-b border-[#E8D2C9] last:border-0 hover:bg-[#FDFBF7]"
                  >
                    <td className="py-4 px-2 font-caveat text-2xl font-bold text-[#2B100D] flex items-center gap-2">
                      <span className="w-6 text-sm font-sans font-bold text-gray-400">
                        #{index + 1}
                      </span>
                      {item.duo}
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
              <h2 className="font-caveat text-3xl font-bold text-[#6E2A23]">DUPLA CAMPEÃ!</h2>

              {data?.winner ? (
                <div className="my-6 space-y-3">
                  <h3 className="font-caveat text-5xl font-black text-[#8B261D] uppercase tracking-wide">
                    {data.winner.duo}
                  </h3>
                  <div className="inline-block bg-yellow-100 border-2 border-yellow-400 px-6 py-2 rounded-2xl">
                    <p className="font-caveat text-3xl font-bold text-yellow-900">
                      Média Geral: {data.winner.overallAverage} ⭐
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm pt-4 text-[#6E2A23] font-semibold border-t border-[#E8D2C9]">
                    <div>
                      <p className="text-xs text-gray-500">Criatividade</p>
                      <p className="text-lg">{data.winner.criatividadeAverage}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Aparência</p>
                      <p className="text-lg">{data.winner.aparenciaAverage}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Sabor</p>
                      <p className="text-lg">{data.winner.saborAverage}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-lg text-gray-600 my-6">
                  Nenhum voto registrado para calcular o vencedor.
                </p>
              )}

              <button
                onClick={() => setShowWinnerModal(false)}
                className="w-full py-3 bg-[#8B261D] hover:bg-[#6E2A23] text-white font-bold text-lg rounded-xl transition uppercase"
              >
                FECHAR
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}