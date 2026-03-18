export default function Footer() {
  return (
    <footer className="mt-8 bg-stone-50 text-foreground">
      <div className="border-t border-border" />

      <div className="mx-auto max-w-5xl px-6 py-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-foreground">Naviguer</h3>
            <ul className="flex flex-col gap-1">
              <li>
                <a
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Accueil
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-foreground">Connexion</h3>
            <ul className="flex flex-col gap-1">
              <li>
                <a
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Se connecter
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              Inscription
            </h3>
            <ul className="flex flex-col gap-1">
              <li>
                <a
                  href="/register"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  S'inscrire
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 inline-flex flex-col">
          <div className="border-t-2 border-border pt-2">
            <p className="text-2xl font-bold tracking-tight text-foreground">
              Glint
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
