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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function Subscribe() {
  return (
    <>
      <div className="grid grid-cols-5 grid-rows-5 h-screen w-full">
        <div className="col-start-1 col-end-4 row-start-1 row-end-2 flex items-center px-12 bg-white">
          <a href="/">
            <ShinyText
              text="GLINT"
              className="relative z-10 text-7xl font-extrabold tracking-tight sm:text-8xl"
              speed={2.5}
              color="#b8860b"
              shineColor="#ffffff"
              spread={120}
              direction="left"
            />
          </a>
        </div>
        <div className="col-start-1 col-end-4 row-start-2 row-end-6 flex flex-col justify-center px-15 bg-white">
          <p className="text-gray-500 text-lg mb-15 max-w-10/12">
            Rejoignez des milliers de membres GLINT et débloquez une expérience
            entièrement repensée — pensée pour vous démarquer, à chaque instant.
          </p>
          <ul className="space-y-7 max-w-10/12">
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
                  Accès prioritaire aux nouvelles fonctionnalités
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Soyez toujours en avance. Découvrez et testez les nouveautés
                  GLINT avant tout le monde, influencez leur développement et
                  profitez d'un avantage que les autres n'ont pas encore.
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

        {/* .div1 → grid-area: 1 / 4 / 6 / 6 */}
        <div className="col-start-4 col-end-6 row-start-1 row-end-6 flex items-center justify-center bg-slate-50 border-l border-slate-200 px-8 overflow-y-auto">
          <div className="w-full max-w-md">
            <form>
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
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <Field orientation="horizontal">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-[#b8860b] via-[#d4a017] to-[#b8860b] text-white shadow-[0_0_12px_rgba(184,134,11,0.25)] transition-all duration-500 ease-out hover:bg-[position:100%_0] hover:shadow-[0_0_20px_rgba(184,134,11,0.4)] active:scale-95"
                  >
                    Payer
                  </Button>
                  <Button variant="outline" type="button">
                    Annuler
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
