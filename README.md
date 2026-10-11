# Ekayn Web

Nouveau frontend e-commerce indépendant d’Ekayn, construit avec Next.js App Router, React et TypeScript strict.

`ekayn-ui`/`ekayn` (Astro) et `ekayn-api` (Spring Boot) ne sont pas modifiés par ce projet. Le backend Spring Boot reste l’unique source pour l’authentification, les commandes, les adresses, les prix de checkout et Stripe.

## Lancement local

```bash
cp .env.example .env.local
npm install
npm run dev
```

Le frontend démarre sur http://localhost:3000. `NEXT_PUBLIC_API_URL` doit pointer vers l’API Spring Boot, par défaut `http://localhost:8080`.

```bash
npm run lint
npm run build
npm run start
```

Les appels authentifiés passent par le client unique `lib/api/client.ts`, avec `credentials: 'include'`. Le token CSRF est récupéré via `/api/auth/csrf` et envoyé dans `X-CSRF-Token` pour les mutations.

## Architecture

- `app/` : routes App Router, métadonnées, sitemap et robots
- `components/` : interface, auth, panier, checkout, compte et administration
- `lib/api/` : client API unique et endpoints typés
- `lib/auth/` : garde de session côté interface (`components/auth`)
- `types/` : DTO correspondant aux `ApiModels` Spring Boot
- `public/` : logo, vidéo et photos repris du frontend Astro

Les montants affichés dans le catalogue sont repris du contenu existant pour l’interface. Le frontend n’envoie jamais de prix au backend et ne traite jamais de clé Stripe secrète. L’endpoint Spring Boot `/api/checkout/session` recalcule le panier et produit l’URL Stripe Checkout.

## API manquante ou incohérente

- Il n’existe pas de route Spring Boot publique de catalogue produits/prix. Le frontend reprend donc le catalogue statique existant pour l’affichage ; les prix peuvent devenir obsolètes tant qu’un endpoint catalogue versionné n’est pas ajouté.
- Il n’existe pas de route de contact dans `ekayn-api`. La page `/contact` l’indique explicitement et n’envoie aucune donnée vers un faux endpoint.
- Le backend renvoie Stripe vers `/success` et `/cancel` via `app.frontend-url`; des alias Next.js existent en plus des pages demandées `/checkout/success` et `/checkout/cancel`.
- L’inscription renvoie un DTO `Auth` mais ne pose pas de cookie de session dans `AuthController`; l’utilisateur doit donc vérifier son email puis se connecter.
- Le backend ne renvoie pas de lien de suivi séparé : le frontend ouvre `trackingNumber` comme lien uniquement s’il commence par `http://` ou `https://`.

Aucune de ces lacunes n’est contournée avec des données fictives.

## Livraison

Le checkout appelle `POST /api/checkout/quote` pour obtenir le sous-total, les frais et le total validés par le backend, puis `POST /api/checkout/session` avec `shippingMethod: STANDARD_HOME_DELIVERY` et l’adresse sélectionnée. Il n’y a pas encore d’intégration Mondial Relay, Colissimo ou Boxtal.
