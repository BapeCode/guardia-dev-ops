import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import ShinyText from "@/components/ShinyText";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Subscribe() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const planName = searchParams.get("plan") || "Aucun plan sélectionné";
  const planPrice = parseFloat(searchParams.get("price") || "0");

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [comments, setComments] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1,
          amount: planPrice,
          currency: "EUR",
          method: "card",
          description: `Abonnement ${planName}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du paiement");
      }

      alert(`Paiement réussi ! Référence : ${data.payment.reference}`);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-5 min-h-screen w-full">
      {/* ============================================ */}
      {/* HEADER LOGO                                  */}
      {/* ============================================ */}
      <div className="lg:col-start-1 lg:col-end-4 flex items-center px-8 lg:px-12 py-6 bg-white">
        <a href="/">
          <ShinyText
            text="GLINT"
            className="relative z-10 text-5xl lg:text-7xl font-extrabold tracking-tight"
            speed={2.5}
            color="#b8860b"
            shineColor="#ffffff"
            spread={120}
            direction="left"
          />
        </a>
      </div>

      {/* ============================================ */}
      {/* CONTENU — empilé en mobile, côte à côte     */}
      {/* en desktop (lg:)                             */}
      {/* ============================================ */}
      <div className="flex flex-col lg:contents">
        {/* --- COLONNE GAUCHE : avantages --- */}
        <div className="order-2 lg:order-none lg:col-start-1 lg:col-end-4 lg:row-start-2 lg:row-end-6 flex flex-col justify-center px-8 lg:px-15 py-10 lg:py-0 bg-white">
          <p className="text-gray-500 text-base lg:text-lg mb-10 lg:mb-15 max-w-xl lg:max-w-10/12">
            Rejoignez des milliers de membres GLINT et débloquez une expérience
            entièrement repensée.
          </p>
          <ul className="space-y-6 lg:space-y-7 max-w-xl lg:max-w-10/12">
            <li className="flex items-start gap-4">
              <span className="text-2xl mt-0.5">🏅</span>
              <div>
                <p className="font-semibold text-slate-900 text-base">
                  Badges exclusifs GLINT
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Affichez votre statut avec des badges uniques visibles sur
                  tout votre profil. Soyez reconnu instantanément par la
                  communauté et montrez que vous faites partie de l'élite GLINT.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <span className="text-2xl mt-0.5">✨</span>
              <div>
                <p className="font-semibold text-slate-900 text-base">
                  Photo de profil animée
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Votre première impression compte. Démarquez-vous avec une
                  photo de profil animée qui capte l'attention et reflète votre
                  personnalité bien mieux qu'une simple image statique.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <span className="text-2xl mt-0.5">🎨</span>
              <div>
                <p className="font-semibold text-slate-900 text-base">
                  Bannière de profil animée
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Transformez votre profil en véritable vitrine. Une bannière
                  animée personnalisée pour un rendu visuel époustouflant —
                  votre espace, votre style, sans compromis.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <span className="text-2xl mt-0.5">🚀</span>
              <div>
                <p className="font-semibold text-slate-900 text-base">
                  Archives de Posts
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Déverrouillez le coffre-fort GLINT. Accédez en illimité à
                  votre bibliothèque privée regroupant l'intégralité de vos
                  publications passées. N'oubliez plus jamais vos moments
                  favoris!
                </p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <span className="text-2xl mt-0.5">💬</span>
              <div>
                <p className="font-semibold text-slate-900 text-base">
                  Support dédié
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Une équipe à votre écoute, uniquement pour les membres
                  premium. Réponses rapides, solutions concrètes — parce que
                  votre temps est précieux et que vous méritez mieux qu'une FAQ.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* --- COLONNE DROITE : résumé + formulaire --- */}
        <div className="order-1 lg:order-none lg:col-start-4 lg:col-end-6 lg:row-start-1 lg:row-end-6 flex items-start lg:items-center justify-center bg-slate-50 lg:border-l border-slate-200 px-6 lg:px-8 py-8 lg:py-0 lg:overflow-y-auto">
          <div className="w-full max-w-md">
            {/* ============================================ */}
            {/* RÉSUMÉ DU PLAN — au-dessus du formulaire     */}
            {/* ============================================ */}
            <div className="mb-6 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Votre sélection
              </p>
              <p className="text-xl font-bold text-slate-900">{planName}</p>
              <p className="text-2xl font-extrabold text-[#b8860b] mt-1">
                {planPrice.toFixed(2).replace(".", ",")}€
                <span className="text-sm font-normal text-gray-500 ml-1">
                  /mois
                </span>
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <FieldSet>
                  <FieldLegend>Méthode de paiement</FieldLegend>
                  <FieldDescription>
                    Toutes les transactions sont sécurisées et chiffrées
                  </FieldDescription>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="card-name">
                        Nom sur la carte
                      </FieldLabel>
                      <Input
                        id="card-name"
                        placeholder="Jean Dupont"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="card-number">
                        Numéro de carte
                      </FieldLabel>
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        required
                        value={cardNumber}
                        onChange={(e) => {
                          const val = e.target.value
                            .replace(/[^\d]/g, "")
                            .replace(/(.{4})/g, "$1 ")
                            .trim();
                          if (val.replace(/\s/g, "").length <= 16) {
                            setCardNumber(val);
                          }
                        }}
                        maxLength={19}
                      />
                      <FieldDescription>
                        Entrez votre numéro de carte à 16 chiffres
                      </FieldDescription>
                    </Field>
                    <div className="grid grid-cols-3 gap-4">
                      <Field>
                        <FieldLabel htmlFor="exp-month">Mois</FieldLabel>
                        <select
                          id="exp-month"
                          value={expMonth}
                          onChange={(e) => setExpMonth(e.target.value)}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => {
                            const v = String(i + 1).padStart(2, "0");
                            return (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            );
                          })}
                        </select>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="exp-year">Année</FieldLabel>
                        <select
                          id="exp-year"
                          value={expYear}
                          onChange={(e) => setExpYear(e.target.value)}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          <option value="">YYYY</option>
                          {[2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="cvv">CVV</FieldLabel>
                        <input
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          id="cvv"
                          placeholder="123"
                          required
                          value={cvv}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^\d]/g, "");
                            if (val.length <= 3) setCvv(val);
                          }}
                          maxLength={3}
                        />
                      </Field>
                    </div>
                  </FieldGroup>
                </FieldSet>
                <FieldSeparator />
                <FieldSet>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="comments">Commentaires</FieldLabel>
                      <Textarea
                        id="comments"
                        placeholder="Ajouter un commentaire..."
                        className="resize-none"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <Field orientation="horizontal">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-[#b8860b] via-[#d4a017] to-[#b8860b] text-white shadow-[0_0_12px_rgba(184,134,11,0.25)] transition-all duration-500 ease-out hover:bg-[position:100%_0] hover:shadow-[0_0_20px_rgba(184,134,11,0.4)] active:scale-95 disabled:opacity-50"
                  >
                    {isLoading
                      ? "Paiement en cours..."
                      : `Payer ${planPrice.toFixed(2).replace(".", ",")}€`}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => navigate(-1)}
                  >
                    Annuler
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
