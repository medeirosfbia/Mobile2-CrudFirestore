import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import CreateTaskScreen from './CreateTaskScreen';
import EditTaskScreen from './EditTaskScreen';
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import { subscribeAuthState } from '../services/authService';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeAuthState((loggedUser) => {
      setUser(loggedUser);
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoadingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Tarefas' }} />
            <Stack.Screen
              name="CreateTask"
              component={CreateTaskScreen}
              options={{ title: 'Criar Tarefa' }}
            />
            <Stack.Screen
              name="EditTask"
              component={EditTaskScreen}
              options={{ title: 'Editar Tarefa' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Criar conta' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
