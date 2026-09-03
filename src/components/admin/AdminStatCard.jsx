/* eslint-disable react/prop-types */
const AdminStatCard = ({ icon: Icon, label, value, sub, color = "gold", trend, trendUp }) => {
  const colorMap = {
    gold: { bg: "bg-gold-500/10", border: "border-gold-500/25", text: "text-gold-400", icon: "text-gold-500" },
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/25", text: "text-blue-400", icon: "text-blue-500" },
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/25", text: "text-emerald-400", icon: "text-emerald-500" },
    violet: { bg: "bg-violet-500/10", border: "border-violet-500/25", text: "text-violet-400", icon: "text-violet-500" },
    rose: { bg: "bg-rose-500/10", border: "border-rose-500/25", text: "text-rose-400", icon: "text-rose-500" },
    amber: { bg: "bg-amber-500/10", border: "border-amber-500/25", text: "text-amber-400", icon: "text-amber-500" },
    cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/25", text: "text-cyan-400", icon: "text-cyan-500" },
    slate: { bg: "bg-slate-700/30", border: "border-slate-600/30", text: "text-slate-300", icon: "text-slate-400" },
  };
  const c = colorMap[color] || colorMap.gold;

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${c.border} ${c.bg} p-5 flex flex-col gap-3 group hover:scale-[1.01] transition duration-200`}>
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
          <Icon className={`text-lg ${c.icon}`} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trendUp ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"}`}>
            {trendUp ? "+" : ""}{trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-white font-mono tracking-tight">{value ?? "—"}</p>
        <p className="text-xs font-semibold text-gray-400 mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-gray-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
};

export default AdminStatCard;
