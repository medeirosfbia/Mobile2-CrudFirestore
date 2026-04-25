import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
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
      <Text style={styles.label}>Titulo *</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o titulo da tarefa"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Descricao</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Digite uma descricao (opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity
        style={[styles.updateButton, isSaving && styles.updateButtonDisabled]}
        onPress={handleUpdateTask}
        disabled={isSaving}
      >
        <Text style={styles.updateButtonText}>{isSaving ? 'Atualizando...' : 'Atualizar Tarefa'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  updateButton: {
    marginTop: 20,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  updateButtonDisabled: {
    opacity: 0.7,
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
