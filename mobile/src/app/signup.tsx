import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { supabase } from '@/lib/supabase';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function handleSignup() {
    if (!name || !email || !password || !confirmPassword) {
        Alert.alert(
        'Missing information',
        'Please fill out all fields.'
        );
        return;
    }

    if (password !== confirmPassword) {
        Alert.alert(
        'Passwords do not match',
        'Please make sure both passwords are the same.'
        );
        return;
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        Alert.alert('Sign up failed', error.message);
        return;
    }

    if (!data.user) {
        Alert.alert(
        'Sign up failed',
        'We could not create your account.'
        );
        return;
    }

    const { error: profileError } = await supabase
        .from('profiles')
        .insert({
        id: data.user.id,
        name: name,
        });

    if (profileError) {
        Alert.alert(
        'Profile error',
        profileError.message
        );
        return;
    }

    Alert.alert(
        'Account created!',
        'Your RevivALL account has been created.'
    );

    router.replace('/tabs');
    }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Create an Account
          </ThemedText>

          <ThemedText style={styles.subtitle}>
            Join the RevivALL app
          </ThemedText>

          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSignup}
          >
            <ThemedText style={styles.buttonText}>
              Create Account
            </ThemedText>
          </Pressable>

          <Pressable
            style={styles.loginButton}
            onPress={() => router.replace('/login')}
          >
            <ThemedText type="link">
              Already have an account? Sign in
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
  },

  content: {
    padding: 24,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },

  title: {
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    color: '#000',
  },

  button: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonPressed: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },

  loginButton: {
    alignItems: 'center',
    marginTop: 24,
  },
});