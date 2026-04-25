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
        <View style={styles.titleRow}>
          <Text style={styles.title}>Minhas Tarefas</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{tasks.length}</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>Organize suas atividades e mantenha tudo em dia.</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateTask')}
            activeOpacity={0.85}
          >
            <Text style={styles.createButtonText}>Nova Tarefa</Text>
          </TouchableOpacity>
        </View>
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
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nenhuma tarefa cadastrada</Text>
            <Text style={styles.emptyText}>Crie sua primeira tarefa para comecar.</Text>
          </View>
        }
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
    backgroundColor: '#eef2ff',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    marginBottom: 14,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
  },
  countBadge: {
    minWidth: 34,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
  },
  countBadgeText: {
    color: '#1d4ed8',
    fontWeight: '800',
    fontSize: 14,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 14,
    color: '#475569',
    fontSize: 14,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  logoutButton: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#334155',
    fontWeight: '700',
  },
  createButton: {
    flex: 2,
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#15803d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 26,
    paddingHorizontal: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#1e293b',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 14,
  },
});
