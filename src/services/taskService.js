import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

const tasksCollection = collection(db, 'tasks');
const FIRESTORE_TIMEOUT_MS = 10000;

function withTimeout(promise, operationName) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Tempo limite excedido ao tentar ${operationName}.`));
      }, FIRESTORE_TIMEOUT_MS);
    }),
  ]);
}

function mapFirestoreError(error, operationName) {
  const errorCode = error?.code;

  if (errorCode === 'permission-denied') {
    return new Error(
      'Sem permissao no Firestore. Ajuste as regras no Firebase Console para permitir leitura/escrita.'
    );
  }

  if (errorCode === 'unavailable') {
    return new Error('Firestore indisponivel no momento. Verifique sua conexao e tente novamente.');
  }

  if (errorCode === 'unauthenticated') {
    return new Error('Usuario nao autenticado para acessar o Firestore.');
  }

  return new Error(error?.message || `Nao foi possivel ${operationName}.`);
}

function getCurrentUserId() {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    throw new Error('Usuario nao autenticado para acessar o Firestore.');
  }

  return userId;
}

export async function addTask(taskData) {
  const userId = getCurrentUserId();

  try {
    return await withTimeout(
      addDoc(tasksCollection, {
        ...taskData,
        userId,
        createdAt: serverTimestamp(),
      }),
      'salvar tarefa'
    );
  } catch (error) {
    throw mapFirestoreError(error, 'salvar tarefa');
  }
}

export function getTasks(onData, onError) {
  let userId;

  try {
    userId = getCurrentUserId();
  } catch (error) {
    if (onError) {
      onError(error);
    }

    return () => {};
  }

  const tasksQuery = query(tasksCollection, where('userId', '==', userId));

  return onSnapshot(
    tasksQuery,
    (snapshot) => {
      const taskList = snapshot.docs
        .map((taskDoc) => ({
          id: taskDoc.id,
          ...taskDoc.data(),
        }))
        .sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;

          return dateB - dateA;
        });

      onData(taskList);
    },
    (error) => {
      if (onError) {
        onError(error);
      }
    }
  );
}

export async function updateTask(taskId, taskData) {
  const taskRef = doc(db, 'tasks', taskId);
  try {
    return await withTimeout(
      updateDoc(taskRef, {
        ...taskData,
        updatedAt: serverTimestamp(),
      }),
      'atualizar tarefa'
    );
  } catch (error) {
    throw mapFirestoreError(error, 'atualizar tarefa');
  }
}

export async function deleteTask(taskId) {
  const taskRef = doc(db, 'tasks', taskId);
  try {
    return await withTimeout(deleteDoc(taskRef), 'excluir tarefa');
  } catch (error) {
    throw mapFirestoreError(error, 'excluir tarefa');
  }
}
