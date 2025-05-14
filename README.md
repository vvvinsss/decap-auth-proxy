# Decap CMS GitHub OAuth Proxy

Ce projet permet de se connecter à Decap CMS en utilisant GitHub OAuth, sans passer par Netlify Identity.

## 🛠 Variables à configurer (dans Render)

- `GITHUB_CLIENT_ID` : depuis ton app GitHub
- `GITHUB_CLIENT_SECRET` : depuis ton app GitHub

## 🚀 Déploiement

1. Crée un dépôt GitHub avec ces fichiers.
2. Va sur https://render.com, connecte-toi avec GitHub.
3. Clique sur "New Web Service" > connecte ton dépôt.
4. Build command : `npm install`
5. Start command : `npm start`
6. Port : `3000`

## 🔗 Utilisation dans Decap CMS

Dans `config.yml` :
```yaml
backend:
  name: github
  repo: ton-utilisateur/ton-depot
  branch: main
  base_url: https://ton-service.onrender.com
  auth_endpoint: auth
```