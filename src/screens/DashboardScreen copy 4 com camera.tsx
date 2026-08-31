import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { CustomCard } from '../components/CustomCard';
import { StatusBadge } from '../components/StatusBadge';
import { AnimatedPulse } from '../components/AnimatedPulse';
import { ActuatorControl } from '../components/ActuatorControl';
import { Joystick } from '../components/Joystick';
import { SensorData } from '../types/sensorTypes';

const MOCK_SENSORES: SensorData[] = [
  { id: '1', name: 'Sensor de Fumaça (MQ-2)', value: 12, unit: 'PPM', status: 'online', lastUpdated: '10:45:00' },
  { id: '2', name: 'Sensor de Umidade (DHT11)', value: 65, unit: '%', status: 'online', lastUpdated: '10:45:02' },
  { id: '3', name: 'Sensor de Temperatura (DHT11)', value: 24.5, unit: '°C', status: 'online', lastUpdated: '10:45:02' },
];

export const DashboardScreen: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [farol, setFarol] = useState(true);
  const [buzzer, setBuzzer] = useState(false);
  const [motor, setMotor] = useState(true);
  const [direcao, setDirecao] = useState({ x: 0, y: 0, força: 0 });
  
  // IP padrão de teste (Substitua pelo IP gerado no app do celular ou ESP32)
  const [cameraIp, setCameraIp] = useState('http://192.168.1'); 

  const handleSelectMenuOption = (option: string) => {
    setIsSidebarOpen(false);
    Alert.alert('Navegação', `Navegando para: ${option}`);
  };

  const handleParadaEmergencia = () => {
    setFarol(false);
    setBuzzer(false);
    setMotor(false);
    setDirecao({ x: 0, y: 0, força: 0 });
    
    Alert.alert(
      '🚨 PARADA DE EMERGÊNCIA',
      'Todos os motores e atuadores foram parados imediatamente!',
      [{ text: 'Entendido', style: 'destructive' }]
    );
  };

  const handleJoystickMove = (data: { x: number; y: number; force: number }) => {
    setDirecao({
      x: data.x,
      y: data.y,
      força: data.force,
    });
  };

  const handleJoystickStop = () => {
    setDirecao({ x: 0, y: 0, força: 0 });
  };

  return (
    <View style={styles.screenWrapper}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onSelectOption={handleSelectMenuOption} />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Header title="🤖 Painel do Robô ESP" onToggleSidebar={() => setIsSidebarOpen(true)} />
        
        <View style={styles.statusRow}>
          <AnimatedPulse color="#10b981" />
          <StatusBadge label="Conectado ao ESP32" status="online" />
        </View>

        {/* 📹 SEÇÃO DA CÂMERA EM TEMPO REAL */}
        <Text style={styles.sectionTitle}>📹 Câmera do Semeador</Text>
        <View style={styles.cameraContainer}>
          <WebView
            source={{ uri: cameraIp }}
            style={styles.videoStream}
            scrollEnabled={false}
            bounces={false}
            allowsInlineMediaPlayback
          />
        </View>
        <TextInput
          style={styles.ipInput}
          onChangeText={setCameraIp}
          value={cameraIp}
          placeholder="Insira o URL de Stream da Câmera"
          placeholderTextColor="#64748b"
        />

        {/* 🕹️ SEÇÃO DO JOYSTICK VIRTUAL */}
        <Text style={styles.sectionTitle}>🕹️ Controle de Movimentação</Text>
        <View style={styles.joystickContainer}>
          <Joystick onMove={handleJoystickMove} onStop={handleJoystickStop} radius={65} />
          <View style={styles.joystickDataView}>
            <Text style={styles.joystickDataText}>Eixo X: {direcao.x.toFixed(2)}</Text>
            <Text style={styles.joystickDataText}>Eixo Y: {direcao.y.toFixed(2)}</Text>
            <Text style={styles.joystickDataText}>Potência: {Math.round(direcao.força * 100)}%</Text>
          </View>
        </View>

        {/* SEÇÃO DE SENSORES */}
        <Text style={styles.sectionTitle}>📡 Sensores em Tempo Real</Text>
        {MOCK_SENSORES.map((sensor) => (
          <CustomCard 
            key={sensor.id} 
            title={sensor.name} 
            description={`Leitura: ${sensor.value} ${sensor.unit}`} 
            buttonText="Ver Detalhes" 
            onPress={() => Alert.alert('Sensor', `Sensor: ${sensor.name}`)} 
          />
        ))}

        {/* SEÇÃO DE ATUADORES */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>⚡ Controle de Atuadores</Text>
        <ActuatorControl name="Farol de LED Frontal" initialState={farol} />
        <ActuatorControl name="Alarme Sonoro (Buzzer)" initialState={buzzer} />
        <ActuatorControl name="Motor Esquerdo (Tração)" initialState={motor} />

        {/* BOTÃO DE EMERGÊNCIA */}
        <TouchableOpacity onPress={handleParadaEmergencia} style={styles.emergencyBtn}>
          <Text style={styles.emergencyBtnText}>🛑 PARADA DE EMERGÊNCIA</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: { flex: 1, backgroundColor: '#0f172a' },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingLeft: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#38bdf8', marginBottom: 10, marginTop: 12 },
  cameraContainer: { height: 220, backgroundColor: '#000000', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#1e293b', marginBottom: 8 },
  videoStream: { flex: 1, backgroundColor: '#000000' },
  ipInput: { backgroundColor: '#1e293b', color: '#f8fafc', padding: 10, borderRadius: 10, marginBottom: 20, fontSize: 13, fontFamily: 'monospace' },
  joystickContainer: { backgroundColor: '#131b2e', borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 20, borderWidth: 1, borderColor: '#1e293b' },
  joystickDataView: { justifyContent: 'center', minWidth: 110 },
  joystickDataText: { color: '#94a3b8', fontSize: 13, fontWeight: '600', fontFamily: 'monospace', marginVertical: 3 },
  emergencyBtn: { backgroundColor: '#dc2626', padding: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 24, borderWidth: 2, borderColor: '#f87171', elevation: 5 },
  emergencyBtnText: { fontSize: 16, fontWeight: '900', color: '#ffffff', letterSpacing: 0.5 },
});
