# Astral Study

Aplicação web responsiva para transformar anotações, PDFs e slides em resumos, flashcards, quizzes e conversas fundamentadas com um tutor de IA.

## Aplicação

O protótipo funcional inclui:

- dashboard de estudos com meta diária, progresso, cadernos e materiais recentes;
- biblioteca pesquisável de materiais;
- upload por seleção ou arrastar e soltar, com feedback de processamento;
- sessão interativa de flashcards e conclusão da revisão;
- tutor contextual com sugestões, respostas simuladas e citações das fontes;
- navegação responsiva para desktop e mobile.

> Os fluxos de IA usam dados demonstrativos no frontend. A arquitetura do backend, os contratos, os prompts e o modelo de dados para a integração real estão descritos no documento principal.

## Executar localmente

Requisitos: Node.js 20.9 ou superior e npm.

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Para validar a mesma compilação usada em produção:

```bash
npm run lint
npm run typecheck
npm run build
```

## Deploy na Vercel

### Pela interface

1. Envie este repositório para o GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. A Vercel detectará **Next.js** automaticamente. Não é necessário alterar os comandos.
4. Clique em **Deploy**. O protótipo atual não exige variáveis de ambiente.

### Pela CLI

```bash
npx vercel
```

O arquivo `vercel.json` já define o framework e os comandos de instalação e build. Para integrar autenticação, armazenamento e modelos de IA posteriormente, cadastre os segredos somente nas variáveis de ambiente da Vercel; nunca os envie ao Git.

## Documento principal

- [Plano de desenvolvimento e arquitetura completa](docs/arquitetura-produto.md)

## Objetivo do produto

Transformar fotos, PDFs e slides em material de estudo confiável: texto estruturado com rastreabilidade, resumos, flashcards com repetição espaçada, quizzes e um tutor que responde somente com base nas fontes do estudante.

O documento principal inclui stack recomendada, fluxo assíncrono, modelo relacional com `pgvector`, contratos de API, prompts JSON, estratégia de segurança, observabilidade, roadmap e detalhamento das telas.
