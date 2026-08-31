import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { CustomCard } from '../components/CustomCard';
import { StatusBadge } from '../components/StatusBadge';
import { AnimatedPulse } from '../components/AnimatedPulse';
import { ActuatorControl } from '../components/ActuatorControl';
import { SensorData } from '../types/sensorTypes';

const MOCK_SENSORES: SensorData[] = [
  { id: '1', name: 'Sensor de Fumaça (MQ-2)', value: 12, unit: 'PPM', status: 'online', lastUpdated: '10:45:00' },
  { id: '2', name: 'Sensor de Umidade (DHT11)', value: 65, unit: '%', status: 'online', lastUpdated: '10:45:02' },
  { id: '3', name: 'Sensor de Temperatura (DHT11)', value: 24.5, unit: '°C', status: 'online', lastUpdated: '10:45:02' },
  { id: '4', name: 'Sensor de Presença (PIR)', value: 'Detectado', unit: '', status: 'warning', lastUpdated: '10:44:50' },
];

export const DashboardScreen: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSelectMenuOption = (option: string) => {
    setIsSidebarOpen(false);
    alert(`Navegando para: ${option}`);
  };

  return (
    <View style={styles.screenWrapper}>
      {/* Sidebar Interativa */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectOption={handleSelectMenuOption}
      />

      <ScrollView style={styles.container}>
        {/* Cabeçalho com botão Hambúrguer */}
        <Header
          title="🤖 Painel do Robô ESP"
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

        {/* Linha de Status de Conexão */}
        <View style={styles.statusRow}>
          <AnimatedPulse color="#10b981" />
          <StatusBadge label="Conectado ao ESP32" status="online" />
        </View>

        {/* Seção 1: Sensores IoT */}
        <Text style={styles.sectionTitle}>📡 Sensores em Tempo Real</Text>
        {MOCK_SENSORES.map((sensor) => (
          <CustomCard
            key={sensor.id}
            title={sensor.name}
            description={`Leitura: ${sensor.value} ${sensor.unit} | Hora: ${sensor.lastUpdated}`}
            buttonText="Ver Detalhes"
            onPress={() => alert(`Sensor: ${sensor.name}`)}
          />
        ))}

        {/* Seção 2: Atuadores do Robô */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>⚡ Controle de Atuadores</Text>
        <ActuatorControl name="Farol de LED Frontal" initialState={true} />
        <ActuatorControl name="Alarme Sonoro (Buzzer)" initialState={false} />
        <ActuatorControl name="Motor Esquerdo (Tração)" initialState={true} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#38bdf8',
    marginBottom: 10,
  },
});