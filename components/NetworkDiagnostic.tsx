import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { ConnectivityService } from '../services/connectivity';
import { apiService } from '../services/api';

interface NetworkDiagnosticProps {
  onDiagnosticComplete?: (result: boolean) => void;
}

export const NetworkDiagnostic: React.FC<NetworkDiagnosticProps> = ({ onDiagnosticComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const runDiagnostic = async () => {
    setIsRunning(true);
    const diagnosticResults: string[] = [];
    
    try {
      // Test 1: Connectivité de base
      diagnosticResults.push('🔍 Test de connectivité de base...');
      const hasBasicConnectivity = await ConnectivityService.isConnected();
      diagnosticResults.push(hasBasicConnectivity ? '✅ Connectivité de base: OK' : '❌ Connectivité de base: ÉCHEC');

      // Test 2: Test API direct
      diagnosticResults.push('🔍 Test de l\'API principale...');
      try {
        await apiService.getXurDebugInfo();
        diagnosticResults.push('✅ API principale: OK');
      } catch (error) {
        diagnosticResults.push(`❌ API principale: ÉCHEC - ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }

      // Test 3: Test de résolution DNS
      diagnosticResults.push('🔍 Test de résolution DNS...');
      try {
        const response = await fetch('https://dns.google/resolve?name=api.yacine-hamadouche.me', {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
        });
        diagnosticResults.push(response.ok ? '✅ Résolution DNS: OK' : '❌ Résolution DNS: ÉCHEC');
      } catch (error) {
        diagnosticResults.push(`❌ Résolution DNS: ÉCHEC - ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }

      // Test 4: Test HTTPS
      diagnosticResults.push('🔍 Test de connexion HTTPS...');
      try {
        const response = await fetch('https://httpbin.org/status/200', {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
        });
        diagnosticResults.push(response.ok ? '✅ Connexion HTTPS: OK' : '❌ Connexion HTTPS: ÉCHEC');
      } catch (error) {
        diagnosticResults.push(`❌ Connexion HTTPS: ÉCHEC - ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }

      setResults(diagnosticResults);
      
      const isSuccessful = diagnosticResults.some(result => result.includes('✅'));
      onDiagnosticComplete?.(isSuccessful);
      
      // Afficher les résultats dans une alerte
      const summary = diagnosticResults.join('\n');
      Alert.alert(
        'Résultats du diagnostic réseau',
        summary,
        [{ text: 'OK', style: 'default' }]
      );
      
    } catch (error) {
      const errorMessage = `Erreur lors du diagnostic: ${error instanceof Error ? error.message : 'Erreur inconnue'}`;
      diagnosticResults.push(`❌ ${errorMessage}`);
      setResults(diagnosticResults);
      
      Alert.alert(
        'Erreur de diagnostic',
        errorMessage,
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isRunning && styles.buttonDisabled]}
        onPress={runDiagnostic}
        disabled={isRunning}
      >
        <Text style={styles.buttonText}>
          {isRunning ? 'Diagnostic en cours...' : 'Diagnostiquer le réseau'}
        </Text>
      </TouchableOpacity>
      
      {results.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Derniers résultats:</Text>
          {results.map((result, index) => (
            <Text key={index} style={styles.resultText}>
              {result}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  resultText: {
    fontSize: 12,
    marginVertical: 2,
    fontFamily: 'monospace',
    color: '#666666',
  },
});
