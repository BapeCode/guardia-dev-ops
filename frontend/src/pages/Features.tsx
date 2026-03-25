import Footer from "@/components/Footer";
import Header from "@/components/Header";

const features = [
  {
    icon: "🔒",
    title: "Cercle privé de 50 personnes max",
    description:
      "Glint ne te laisse pas accumuler des centaines de contacts fantômes. Ton réseau est limité à 50 proches. Chaque connexion compte vraiment tu choisis avec qui tu partages ta vie, pas l'algorithme.",
    tag: "Connexions authentiques",
  },
  {
    icon: "🎭",
    title: "Réactions expressives & privées",
    description:
      "Fini le simple like visible de tous. Sur Glint, tes réactions sont riches, nuancées, et visibles uniquement par la personne concernée. Tu t'exprimes vraiment, sans jouer à la galerie.",
    tag: "Intimité",
  },
  {
    icon: "🏅",
    title: "Badges collectifs",
    description:
      'Les badges ne sont pas individuels ton groupe les débloque ensemble. "100 posts partagés entre vous", "3 mois de streak"... Des trophées qui valorisent la relation, pas l\'ego.',
    tag: "Collectif",
  },
  {
    icon: "📸",
    title: "Souvenirs partagés",
    description:
      "Vos moments s'accumulent dans un journal commun. Photos, textes, réactions tout est archivé et resurgit en \"ce jour là il y a X ans\", c'est un album vivant que vous construisez.",
    tag: "Mémoire",
  },
];

export default function Fonctionnalites() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl px-6 py-16 min-h-screen">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Tout ce qui rend Glint{" "}
            <span className="text-muted-foreground">différent des autres</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-full flex flex-col sm:flex-row items-start gap-6 rounded-2xl border border-white/8 bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl">
            <span className="text-5xl leading-none flex-shrink-0">
              {features[0].icon}
            </span>
            <div>
              <h3 className="text-lg font-bold mb-2">{features[0].title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {features[0].description}
              </p>
              <span className="mt-3 inline-block rounded-full bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-white">
                {features[0].tag}
              </span>
            </div>
          </div>

          {features.slice(1).map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/8 bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl"
            >
              <div className="text-4xl mb-4 leading-none">{feature.icon}</div>
              <h3 className="text-base font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              <span className="mt-3 inline-block rounded-full bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-white">
                {feature.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
