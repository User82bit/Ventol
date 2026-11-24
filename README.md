# Ventol

Aplicativo Android em React Native + Expo para controle remoto do robô do Projeto Éden.

## Comunicação

O Ventol não se conecta diretamente ao broker MQTT e não contém credenciais MQTT.

1. O operador entra com e-mail e senha de uma conta administradora do Adan-Stella.
2. O aplicativo recebe um JWT por POST /api/auth/login.
3. O SignalR apresenta esse JWT nos hubs /controllerHub e /robotHub.
4. O ControllerHub converte coordenadas X/Y em W/A/S/D/STOP e publica no tópico MQTT esp32/comandos/wasd.
5. A telemetria MQTT esp32/dados é disponibilizada pelo RobotHub.

Importante: /wasd não é um endpoint HTTP. É parte do tópico MQTT esp32/comandos/wasd usado pelo Adan-Stella e pelo firmware do ESP8266.

O aplicativo exige uma conta com isAdmin=true. O cadastro público do Adan-Stella cria contas comuns; somente usuários promovidos localmente no banco do backend podem controlar o robô.

## Endereço da API

A configuração padrão utiliza o HTTPS do Tailscale Funnel:

https://desktop-s66k8c7.tailc423e9.ts.net

Para substituir o endereço em desenvolvimento, defina EXPO_PUBLIC_API_URL antes de iniciar o Expo. O perfil EAS preview já recebe essa variável durante o build.

## Segurança da sessão

O JWT fica somente na memória do aplicativo. Ele não é gravado em AsyncStorage ou em arquivos. Ao fechar o aplicativo, o operador precisará entrar novamente.

Não coloque JWT secret, Robot Device API Key, usuário/senha MQTT ou credenciais administrativas no bundle do aplicativo.

## Comandos de desenvolvimento

Instale as dependências e execute:

- npm install
- npx expo start
- npx expo run:android (com ambiente Android local configurado)

## APK Android restrito

O projeto contém um perfil EAS chamado preview, configurado para distribuição interna em APK.

1. Instale o EAS CLI: npm install -g eas-cli
2. Entre na sua conta Expo: eas login
3. Configure o projeto EAS: eas build:configure
4. Gere o APK: eas build --platform android --profile preview

O primeiro build pode solicitar a criação das credenciais de assinatura Android. Guarde o keystore e não o publique no Git.

A distribuição interna do EAS gera um link de instalação. No painel do projeto Expo, desative a opção de acesso não autenticado aos builds internos para exigir que a pessoa entre em uma conta Expo autorizada para acessar o link.

A proteção principal, porém, é aplicada pelo Adan-Stella: mesmo que alguém obtenha uma cópia do APK, o aplicativo só abre a conexão de controle depois de receber um JWT de uma conta administradora. A instalação do APK Android, isoladamente, não pode ser limitada tecnicamente a uma lista de pessoas depois que o arquivo é copiado.

## Segurança do controle

- O Adan-Stella continua sendo o único cliente MQTT do lado da aplicação.
- O Ventol envia coordenadas somente por SignalR com JWT.
- Os hubs /controllerHub e /robotHub exigem AdminOnly no backend.
- O app renova o último comando a cada 350 ms enquanto o controle está pressionado, para não expirar o watchdog de 1,2 s do ESP8266.
- Ao desconectar ou fechar o aplicativo, o Ventol tenta enviar STOP. O watchdog do ESP também deve permanecer ativo como proteção independente.
