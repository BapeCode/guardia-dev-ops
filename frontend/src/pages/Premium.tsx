import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Pricing from "@/components/Pricing";

export default function Premium() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl px-6 py-16 min-h-screen">
        <h1 className="text-4xl font-bold mb-8">Devenir Premium</h1>
        <p className="text-lg text-muted-foreground mb-6">
          En tant que membre Premium, tu bénéficieras de fonctionnalités
          exclusives pour rendre ton expérience sur Glint encore plus spéciale.
          Voici ce que tu pourras débloquer :
        </p>
        <Pricing />

        <ul className="list-disc list-inside space-y-4 text-lg text-muted-foreground mb-8"></ul>
        <p className="text-lg text-muted-foreground mb-6">
          En devenant Premium, tu aides GLINT à continuer à créer un réseau
          social. Merci de faire partie de cette aventure avec nous !
        </p>
      </div>
      <Footer />;
    </>
  );
}
