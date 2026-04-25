import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ConfirmModal from '../components/ConfirmModal';
import TaskItem from '../components/TaskItem';
import { logout } from '../services/authService';
import { deleteTask, getTasks } from '../services/taskService';

export default function HomeScreen({ navigation, route }) {
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const successMessage = route?.params?.successMessage;

    if (successMessage) {
      Alert.alert('Sucesso', successMessage);
      navigation.setParams({ successMessage: undefined });
    }
  }, [route?.params?.successMessage, navigation]);

  useEffect(() => {
    // Escuta em tempo real as alteracoes da colecao tasks.
    const unsubscribe = getTasks(
      (taskList) => {
        setTasks(taskList);
      },
      (error) => {
        Alert.alert('Erro', error?.message || 'Nao foi possivel carregar as tarefas.');
      }
    );

    return () => unsubscribe();
  }, []);

  function handlePressDelete(task) {
    setSelectedTask(task);
    setIsModalVisible(true);
  }

  async function handleConfirmDelete() {
    if (!selectedTask) {
      return;
    }

    try {
      await deleteTask(selectedTask.id);
      Alert.alert('Sucesso', 'Tarefa excluida com sucesso.');
    } catch (error) {
      Alert.alert('Erro', error?.message || 'Nao foi possivel excluir a tarefa.');
    } finally {
      setSelectedTask(null);
      setIsModalVisible(false);
    }
  }

  function handleCancelDelete() {
    setSelectedTask(null);
    setIsModalVisible(false);
  }

  async function handleLogout() {
    try {
      await logout();
      Alert.alert('Sucesso', 'Logout realizado com sucesso.');
    } catch (error) {
      Alert.alert('Erro', error?.message || 'Nao foi possivel sair da conta.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lista de Tarefas</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateTask')}
        >
          <Text style={styles.createButtonText}>Nova Tarefa</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onEdit={(task) => navigation.navigate('EditTask', { task })}
            onDelete={handlePressDelete}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma tarefa cadastrada.</Text>}
      />

      <ConfirmModal
        visible={isModalVisible}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  logoutButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#6b7280',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  createButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 40,
    fontSize: 16,
  },
});
