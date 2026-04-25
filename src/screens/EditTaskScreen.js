import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { updateTask } from '../services/taskService';

export default function EditTaskScreen({ route, navigation }) {
  const { task } = route.params;
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [isSaving, setIsSaving] = useState(false);

  async function handleUpdateTask() {
    if (isSaving) {
      return;
    }

    if (!title.trim()) {
      Alert.alert('Validacao', 'O titulo e obrigatorio.');
      return;
    }

    try {
      setIsSaving(true);

      await updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
      });

      navigation.navigate('Home', {
        successMessage: 'Tarefa atualizada com sucesso.',
      });
    } catch (error) {
      Alert.alert('Erro', error?.message || 'Nao foi possivel atualizar a tarefa.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.helperText}>Edite os campos abaixo para atualizar a tarefa.</Text>

        <Text style={styles.label}>Titulo *</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o titulo da tarefa"
          placeholderTextColor="#94a3b8"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Descricao</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Digite uma descricao (opcional)"
          placeholderTextColor="#94a3b8"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
        />

        <TouchableOpacity
          style={[styles.updateButton, isSaving && styles.updateButtonDisabled]}
          onPress={handleUpdateTask}
          disabled={isSaving}
          activeOpacity={0.85}
        >
          <Text style={styles.updateButtonText}>{isSaving ? 'Atualizando...' : 'Atualizar Tarefa'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff6ff',
    padding: 16,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  helperText: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0f172a',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  updateButton: {
    marginTop: 22,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  updateButtonDisabled: {
    opacity: 0.65,
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
