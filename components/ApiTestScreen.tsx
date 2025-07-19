import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { apiService } from '@/services/api';
import Colors from '@/constants/Colors';

export default function ApiTestScreen() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testXurApi = async () => {
    setIsLoading(true);
    setTestResult('Test en cours...');
    
    try {
      const response = await apiService.getXurInventory();
      setTestResult(`✅ Succès!\nCode d'erreur: ${response.ErrorCode}\nDonnées reçues: ${JSON.stringify(response.Response, null, 2)}`);
    } catch (error) {
      setTestResult(`❌ Erreur: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testXurDebug = async () => {
    setIsLoading(true);
    setTestResult('Test debug en cours...');
    
    try {
      const response = await apiService.getXurDebugInfo();
      setTestResult(`🔍 Debug Info:\n${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setTestResult(`❌ Erreur: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test de l'API Xûr</Text>
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={testXurApi}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Test API Xûr</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={testXurDebug}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Test Debug Xûr</Text>
      </TouchableOpacity>

      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>{testResult}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.destiny.dark,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.destiny.ghost,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: Colors.destiny.accent,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.destiny.dark,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
  },
  resultText: {
    color: Colors.destiny.ghost,
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
