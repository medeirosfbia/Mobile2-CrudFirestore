import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from './firebaseConfig';

function mapAuthError(error) {
  const errorCode = error?.code;

  switch (errorCode) {
    case 'auth/invalid-email':
      return 'O email informado não é válido.';
    case 'auth/invalid-api-key':
      return 'A chave do Firebase está invalida. Confira o firebaseConfig.';
    case 'auth/unauthorized-domain':
      return 'Domínio não autorizado no Firebase Auth. Adicione o domínio em Authentication > Settings > Authorized domains.';
    case 'auth/configuration-not-found':
      return 'Configuração do Firebase Auth incompleta ou incorreta.';
    case 'auth/missing-password':
      return 'Informe a senha.';
    case 'auth/weak-password':
      return 'A senha precisa ter pelo menos 6 caracteres.';
    case 'auth/email-already-in-use':
      return 'Esse email já está cadastrado.';
    case 'auth/user-not-found':
      return 'Não existe conta com esse email.';
    case 'auth/wrong-password':
      return 'Senha incorreta.';
    case 'auth/invalid-credential':
      return 'Credenciais inválidas. Verifique email e senha.';
    case 'auth/operation-not-allowed':
      return 'O login por email e senha não está habilitado no Firebase.';
    case 'auth/network-request-failed':
      return 'Falha de rede. Verifique sua conexao.';
    default:
      return error?.message || 'Não foi possível concluir a operação.';
  }
}

export function getAuthErrorMessage(error) {
  return mapAuthError(error);
}

export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function registerWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

export function subscribeAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}
