# LeadFinder

## Antes de publicar
Abra `src/App.jsx` e cole suas chaves do Supabase nas duas constantes
no topo do arquivo:

```js
const SUPABASE_URL = "";
const SUPABASE_ANON_KEY = "";
```

## Rodar localmente (opcional, pra testar antes de publicar)
```
npm install
npm run dev
```

## Publicar
1. Suba esta pasta inteira para um repositório no GitHub (mantendo essa
   estrutura de arquivos, com o `package.json` na raiz).
2. Na Vercel, importe o repositório. Agora ela vai detectar sozinha
   "Vite" na Configuração de Aplicação (em vez de "Other") e preencher
   tudo automaticamente.
3. Clique em Deploy.
