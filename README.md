# Ventol

**Version:** v1.1.0

Um aplicativo mobile desenvolvido com React Native e Expo para controle e gerenciamento.

## 📋 Descrição

Ventol é um aplicativo mobile que oferece funcionalidades de navegação, controle e perfil de usuário, com uma interface intuitiva e responsiva.

## 🚀 Tecnologias

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **React Navigation** - Navegação entre telas
- **TypeScript** - Tipagem estática
- **React 19.1.0** - Versão mais recente do React

## 📁 Estrutura do Projeto

```
Ventol/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── button-nav.tsx
│   │   ├── cards.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── Navigator-Bar.tsx
│   ├── screens/            # Telas do aplicativo
│   │   ├── HomeScreen.tsx
│   │   ├── ControllerScreen.tsx
│   │   ├── ContactScreen.tsx
│   │   ├── InfoScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── constants/          # Constantes da aplicação
│   │   └── colors.ts
│   ├── hooks/              # Custom hooks
│   │   └── useAppState.ts
│   ├── types/              # Tipos TypeScript
│   │   └── response.ts
│   ├── assets/             # Imagens e recursos
│   ├── App.tsx             # Componente principal
│   └── index.ts            # Ponto de entrada
├── AGENTS.md               # Configuração de agentes
├── CLAUDE.md               # Instruções Claude
├── app.json                # Configuração do Expo
├── package.json            # Dependências
├── tsconfig.json           # Configuração TypeScript
└── README.md               # Este arquivo
```

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/CarlosEduardS/Ventol.git
cd Ventol
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
# ou
yarn start
```

## 📱 Executando em Diferentes Plataformas

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 📖 Scripts Disponíveis

- `npm start` - Inicia o servidor Expo
- `npm run android` - Inicia no emulador Android
- `npm run ios` - Inicia no simulador iOS
- `npm run web` - Inicia na web

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, siga os padrões de código do projeto.

## 📄 Licença

Este projeto é privado.

## 👤 Autor

Carlos Eduardo Santos

---

**Última atualização:** 2026-06-18
