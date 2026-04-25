import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { addTask } from '../services/taskService';

export default function CreateTaskScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function handleSaveTask() {
    if (isSaving) {
      return;
    }

    if (!title.trim()) {
      Alert.alert('Validacao', 'O titulo e obrigatorio.');
      return;
    }

    try {
      setIsSaving(true);

      await addTask({
        title: title.trim(),
        description: description.trim(),
      });

      navigation.navigate('Home', {
        successMessage: 'Tarefa criada com sucesso.',
      });
    } catch (error) {
      Alert.alert('Erro', error?.message || 'Nao foi possivel criar a tarefa.');
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
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={handleSaveTask}
        disabled={isSaving}
      >
        <Text style={styles.saveButtonText}>{isSaving ? 'Salvando...' : 'Salvar Tarefa'}</Text>
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
  saveButton: {
    marginTop: 20,
    backgroundColor: '#16a34a',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
