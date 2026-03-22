import { Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const allFeatures = [
  "Badges exclusifs GLINT",
  "Photo de profil animée",
  "Bannière de profil animée",
  "Archives de Posts",
  "Support dédié",
];

const packs = [
  {
    name: "GLINT Basique",
    price: 4.99,
    priceLabel: "4,99€",
    description: "Offre basique.",
    availableCount: 2,
    highlight: false,
  },
  {
    name: "GLINT Pro",
    price: 9.99,
    priceLabel: "9,99€",
    description: "Offre pro.",
    availableCount: 3,
    highlight: true,
  },
  {
    name: "GLINT Max",
    price: 19.99,
    priceLabel: "19,99€",
    description: "Offre max.",
    availableCount: 5,
    highlight: false,
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const handleChoosePack = (pack: (typeof packs)[0]) => {
    const params = new URLSearchParams({
      plan: pack.name,
      price: pack.price.toString(),
    });
    navigate(`/subscribe?${params.toString()}`);
  };

  return (
    <section id="tarifs" className="pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16"></div>
        <div className="grid md:grid-cols-3 gap-8">
          {packs.map((pack, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${
                pack.highlight
                  ? "bg-gradient-to-r from-[#b8860b] via-[#d4a017] to-[#b8860b] text-white shadow-xl ring-1 ring-[#b8860b]/30"
                  : "bg-white text-slate-900 shadow-lg"
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{pack.name}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold">{pack.priceLabel}</span>
                <span className="text-sm opacity-80">/mois</span>
              </div>
              <p
                className={`mb-6 ${
                  pack.highlight ? "text-amber-50" : "text-gray-500"
                }`}
              >
                {pack.description}
              </p>
              <ul className="space-y-4 mb-8">
                {allFeatures.map((feature, idx) => {
                  const available = idx < pack.availableCount;
                  return (
                    <li key={idx} className="flex items-center gap-3">
                      {available ? (
                        <Check
                          size={20}
                          className={
                            pack.highlight ? "text-white" : "text-[#b8860b]"
                          }
                        />
                      ) : (
                        <X
                          size={20}
                          className={
                            pack.highlight ? "text-white/40" : "text-slate-300"
                          }
                        />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          !available
                            ? pack.highlight
                              ? "opacity-40"
                              : "text-slate-300"
                            : ""
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <button
                onClick={() => handleChoosePack(pack)}
                className={`w-full py-3 rounded-lg font-bold cursor-pointer transition-colors ${
                  pack.highlight
                    ? "bg-white text-gray-950 hover:bg-blue-50"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                Choisir ce pack
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
