# CRUD de Tarefas com React Native + Firebase

Aplicativo mobile (Expo) para autenticação de usuários e gerenciamento de tarefas (CRUD) usando Firebase Authentication e Cloud Firestore.

## Sobre o projeto

Este projeto foi desenvolvido para praticar os conceitos de:

- Autenticação com email e senha
- Persistência de dados no Firestore
- Operações de CRUD (criar, listar, editar e excluir)
- Navegação entre telas com React Navigation
- Estruturação de app React Native com camadas de `screens`, `components` e `services`

## Funcionalidades

- Cadastro de usuário com email e senha
- Login e logout
- Criação de tarefa (título obrigatório, descrição opcional)
- Listagem de tarefas em tempo real (`onSnapshot`)
- Edição de tarefa
- Exclusão de tarefa com confirmação
- Isolamento por usuário: cada usuário visualiza somente as próprias tarefas
- Tratamento de erros de autenticação e Firestore com mensagens amigáveis

## Tecnologias utilizadas

- React Native
- Expo
- Firebase Authentication
- Cloud Firestore
- React Navigation (Native Stack)
- AsyncStorage (persistência da sessão no ambiente nativo)

Dependências principais no projeto:

- `expo` `~54.0.33`
- `react` `19.1.0`
- `react-native` `0.81.5`
- `firebase` `^12.12.1`
- `@react-navigation/native` `^7.2.2`
- `@react-navigation/native-stack` `^7.14.12`
- `@react-native-async-storage/async-storage` `2.2.0`

## Estrutura de pastas

```text
crud-firestore/
  src/
    components/
      ConfirmModal.js
      TaskItem.js
    navigation/
      AppNavigator.js
    screens/
      LoginScreen.js
      RegisterScreen.js
      HomeScreen.js
      CreateTaskScreen.js
      EditTaskScreen.js
    services/
      firebaseConfig.js
      authService.js
      taskService.js
```

## Fluxo da tarefa (CRUD)

1. Usuário cria conta ou faz login.
2. Após autenticar, o app abre a tela `Home`.
3. A lista de tarefas é carregada em tempo real do Firestore, filtrando pelo `uid` do usuário logado.
4. O usuário pode:
   - Criar nova tarefa
   - Editar tarefa existente
   - Excluir tarefa (com modal de confirmação)
5. As alterações aparecem automaticamente na listagem.

## Pré-requisitos

- Node.js (LTS recomendado)
- npm
- Conta no Firebase
- Expo Go (celular) ou emulador Android/iOS

## Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2. Adicione um app Web no projeto Firebase para obter as credenciais.
3. Habilite o provedor **Email/Password** em:
   - Authentication > Sign-in method
4. Crie o banco em **Cloud Firestore**.
5. Configure as regras do Firestore para permitir leitura/escrita autenticada por usuário.

### Exemplo de regra (somente dono da tarefa)

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Variáveis de ambiente

As variáveis são lidas em `src/services/firebaseConfig.js` usando `process.env.EXPO_PUBLIC_*`.

Crie um arquivo `.env` na raiz do projeto com base no exemplo abaixo:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=SUA_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
EXPO_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

Observações:

- O arquivo `.env` já está no `.gitignore`.

## Como rodar o projeto

1. Entre na pasta do projeto:

```bash
cd crud-firestore
```

2. Instale as dependências:

```bash
npm install
```

3. Crie e preencha o `.env` com as credenciais do Firebase.

4. Inicie o projeto Expo:

```bash
npm start
```

5. Execute em uma plataforma:

```bash
npm run android
npm run ios
npm run web
```

## Scripts disponíveis

- `npm start`: inicia o Expo
- `npm run android`: abre no Android
- `npm run ios`: abre no iOS
- `npm run web`: abre na versão web

## Possíveis erros comuns

  - Verifique se o `.env` foi criado corretamente e se os nomes das variáveis estão idênticos.

  - Ative o login Email/Password no Firebase Authentication.

  - Ajuste as regras de segurança para permitir acesso ao usuário autenticado.

## Licença

Projeto acadêmico para fins de estudo.
