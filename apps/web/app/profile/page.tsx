"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

interface UserStats {
    totalGames: number;
    wins: number;
    losses: number;
    draws: number;
    name: string;
    email: string;
}

interface Game {
    id: string;
    roomId: string;
    isWin: boolean;
    createdAt: string;
}

export default function Profile() {
    const router = useRouter();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        console.log("userId", userId);
        if (!token || !userId) {
            router.push("/signin");
            return;
        }

        const fetchData = async () => {
            try {
                const statsRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/game/userstats`, {
                    headers: { Authorization: `Bearer ${token}` },

                });
                console.log(statsRes.data);
                setStats(statsRes.data.user);
            } catch (error) {
                console.error("Error fetching profile data:", error);
                toast.error("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const fetchHistory = async () => {
        if (games.length > 0) {
            setShowHistory(!showHistory);
            return;
        }

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        try {
            const gamesRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/game/usergames`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { userId }
            });
            setGames(gamesRes.data.games);
            setShowHistory(true);
        } catch (error) {
            console.error("Error fetching game history:", error);
            toast.error("Failed to load game history");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
                        PROFILE
                    </h1>
                    <button
                        onClick={() => router.push("/room")}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors border border-white/10"
                    >
                        Back to Room
                    </button>
                </header>

                {stats && (
                    <div className="bg-white/5 rounded-3xl p-8 border border-white/10 backdrop-blur-xl shadow-2xl mb-8">
                        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-4xl font-bold shadow-lg shadow-purple-500/30">
                                {stats.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-center md:text-left">
                                <h2 className="text-3xl font-bold mb-2">{stats.name}</h2>
                                <p className="text-gray-400">{stats.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <StatCard label="Total Games" value={stats.totalGames} color="text-white" />
                            <StatCard label="Wins" value={stats.wins} color="text-green-400" />
                            <StatCard label="Losses" value={stats.losses} color="text-red-400" />
                            <StatCard label="Draws" value={stats.draws} color="text-gray-400" />
                        </div>
                    </div>
                )}

                <div className="flex justify-center mb-8">
                    <button
                        onClick={fetchHistory}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-purple-500/20"
                    >
                        {showHistory ? "Hide Game History" : "View Game History"}
                    </button>
                </div>

                {showHistory && (
                    <div className="bg-white/5 rounded-2xl p-8 border border-white/10 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-bold mb-6 text-gray-200">Recent Games</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                                        <th className="pb-4 pl-4">Result</th>
                                        <th className="pb-4">Room ID</th>
                                        <th className="pb-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {games.map((game) => (
                                        <tr key={game.id} className="hover:bg-white/5 transition-colors">
                                            <td className="py-4 pl-4">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${game.isWin
                                                        ? "bg-green-500/20 text-green-400"
                                                        : "bg-red-500/20 text-red-400"
                                                        }`}
                                                >
                                                    {game.isWin ? "WIN" : "LOSS/DRAW"}
                                                </span>
                                            </td>
                                            <td className="py-4 font-mono text-gray-300">{game.roomId}</td>
                                            <td className="py-4 text-gray-400">
                                                {new Date(game.createdAt).toLocaleDateString()} {new Date(game.createdAt).toLocaleTimeString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {games.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="py-8 text-center text-gray-500">
                                                No games played yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors text-center">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">{label}</p>
            <p className={`text-3xl font-black ${color}`}>{value}</p>
        </div>
    );
}
