import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity, TextInput, Platform, Switch } from 'react-native';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { CustomCard } from '../components/CustomCard';
import { StatusBadge } from '../components/StatusBadge';
import { AnimatedPulse } from '../components/AnimatedPulse';
import { ActuatorControl } from '../components/ActuatorControl';
import { Joystick } from '../components/Joystick';
import { SensorData } from '../types/sensorTypes';

let GamepadControllerMobile: any = null;
if (Platform.OS !== 'web') {
  try {
    GamepadControllerMobile = require('react-native-gamepad-controller').default;
  } catch (e) {
    console.log("Ignorando biblioteca móvel no ambiente Web.");
  }
}

const MOCK_SENSORES: SensorData[] = [
  { id: '1', name: 'Sensor de Fumaça (MQ-2)', value: 12, unit: 'PPM', status: 'online', lastUpdated: '10:45:00' },
  { id: '2', name: 'Sensor de Umidade (DHT11)', value: 65, unit: '%', status: 'online', lastUpdated: '10:45:02' },
  { id: '3', name: 'Sensor de Temperatura (DHT11)', value: 24.5, unit: '°C', status: 'online', lastUpdated: '10:45:02' },
];

export const DashboardScreen: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 1. CARREGAR TEMA: Isolado via Platform.select para blindar o empacotador da Web
  useEffect(() => {
    const carregarTemaUniversal = Platform.select({
      web: () => {
        try {
          const temaSalvo = localStorage.getItem('@preferencia_tema');
          if (temaSalvo !== null) setIsDarkMode(temaSalvo === 'escuro');
        } catch (e) { console.log(e); }
      },
      default: async () => {
        try {
          const AsyncStorage = require('@react-native-async-storage/async-storage').default;
          const temaSalvo = await AsyncStorage.getItem('@preferencia_tema');
          if (temaSalvo !== null) setIsDarkMode(temaSalvo === 'escuro');
        } catch (e) { console.log(e); }
      }
    });

    carregarTemaUniversal();
  }, []);

  // 2. SALVAR TEMA: Sem misturar escopos de código para evitar travamento estático
  const alternarTema = async () => {
    const novoModo = !isDarkMode;
    setIsDarkMode(novoModo);
    const valorTema = novoModo ? 'escuro' : 'claro';

    const salvarTemaUniversal = Platform.select({
      web: () => {
        try { localStorage.setItem('@preferencia_tema', valorTema); } catch (e) { console.log(e); }
      },
      default: async () => {
        try {
          const AsyncStorage = require('@react-native-async-storage/async-storage').default;
          await AsyncStorage.setItem('@preferencia_tema', valorTema);
        } catch (e) { console.log(e); }
      }
    });

    salvarTemaUniversal();
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [farol, setFarol] = useState(true);
  const [buzzer, setBuzzer] = useState(false);
  const [motor, setMotor] = useState(true);
  const [direcao, setDirecao] = useState({ x: 0, y: 0, força: 0 });
  const [cameraIp, setCameraIp] = useState('http://192.168.1'); 
  const [isGamepadConnected, setIsGamepadConnected] = useState(false);

  const statesRef = useRef({ farol, buzzer });
  useEffect(() => {
    statesRef.current = { farol, buzzer };
  }, [farol, buzzer]);

  const handleSelectMenuOption = (option: string) => {
    setIsSidebarOpen(false);
    if (Platform.OS === 'web') {
      alert(`Navegando para: ${option}`);
    } else {
      Alert.alert('Navegação', `Navegando para: ${option}`);
    }
  };

  const handleParadaEmergencia = () => {
    setFarol(false);
    setBuzzer(false);
    setMotor(false);
    setDirecao({ x: 0, y: 0, força: 0 });
    
    if (Platform.OS === 'web') {
      alert('🚨 PARADA DE EMERGÊNCIA\nTodos os motores e atuadores foram parados imediatamente!');
    } else {
      Alert.alert(
        '🚨 PARADA DE EMERGÊNCIA',
        'Todos os motores e atuadores foram parados imediatamente!',
        [{ text: 'Entendido', style: 'destructive' }]
      );
    }
  };

  const handleJoystickMove = (data: { x: number; y: number; force: number }) => {
    setDirecao({ x: data.x, y: data.y, força: data.force });
  };

  const handleJoystickStop = () => {
    setDirecao({ x: 0, y: 0, força: 0 });
  };

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    let animationId: number;
    
    const handleWebGamepad = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      const gp = gamepads[0]; 
      
      if (gp) {
        if (!isGamepadConnected) setIsGamepadConnected(true);
        const x = parseFloat((gp.axes[0] || 0).toFixed(2));
        const y = parseFloat((-(gp.axes[1] || 0)).toFixed(2)); 
        const force = parseFloat(Math.min(Math.sqrt(x ** 2 + y ** 2), 1).toFixed(2));
        if (force > 0.15) {
          handleJoystickMove({ x, y, force });
        } else {
          handleJoystickStop();
        }
        if (gp.buttons[0]?.pressed) handleParadaEmergencia();
        if (gp.buttons[2]?.pressed) setFarol(statesRef.current.farol);
        if (gp.buttons[1]?.pressed) setBuzzer(statesRef.current.buzzer);
      } else {
        if (isGamepadConnected) setIsGamepadConnected(false);
      }
      animationId = requestAnimationFrame(handleWebGamepad);
    };
    
    animationId = requestAnimationFrame(handleWebGamepad);
    return () => cancelAnimationFrame(animationId);
  }, [isGamepadConnected]);

  const handleGamepadDataMobile = (data: any) => {
    if (data.connected !== isGamepadConnected) setIsGamepadConnected(data.connected);
    if (!data.connected) return;
    const axes = data.axes || [];
    const x = parseFloat((axes[0] || 0).toFixed(2));
    const y = parseFloat((-(axes[1] || 0)).toFixed(2));
    const force = parseFloat(Math.min(Math.sqrt(x ** 2 + y ** 2), 1).toFixed(2));
    if (force > 0.15) {
      handleJoystickMove({ x, y, force });
    } else {
      handleJoystickStop();
    }
    const buttons = data.buttons || [];
    if (buttons[0]?.pressed) handleParadaEmergencia();
    if (buttons[2]?.justPressed) setFarol(!statesRef.current.farol);
    if (buttons[1]?.justPressed) setBuzzer(!statesRef.current.buzzer);
  };

  return (
    <View style={[styles.screenWrapper, isDarkMode ? styles.fundoEscuro : styles.fundoClaro]}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onSelectOption={handleSelectMenuOption} />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Header title="🤖 Painel do Robô ESP" onToggleSidebar={() => setIsSidebarOpen(true)} />
        
        <View style={styles.themeToggleRow}>
          <Text style={{ color: '#f8fafc', fontWeight: 'bold' }}>
            {isDarkMode ? 'Modo Escuro' : 'Modo Claro'}
          </Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkMode ? '#2f60d4' : '#f4f3f4'}
            onValueChange={alternarTema}
            value={isDarkMode}
          />
        </View>

        <View style={styles.statusRow}>
          <AnimatedPulse color={isGamepadConnected ? '#38bdf8' : '#10b981'} />
          <StatusBadge 
            label={isGamepadConnected ? `Controle Conectado (${Platform.OS.toUpperCase()})` : "Conectado ao ESP32"} 
            status="online" 
          />
        </View>

        <Text style={styles.sectionTitle}>📹 Câmera do Semeador</Text>
        <View style={styles.cameraContainer}>
          <Text style={{color: '#94a3b8'}}>Stream da Câmera do Robô</Text>
        </View>
        <TextInput style={styles.ipInput} onChangeText={setCameraIp} value={cameraIp} placeholder="Insira o URL de Stream da Câmera" placeholderTextColor="#64748b" />

        <Text style={styles.sectionTitle}>🕹️ Controle de Movimentação</Text>
        <View style={styles.joystickContainer}>
          <Joystick onMove={handleJoystickMove} onStop={handleJoystickStop} radius={65} />
          <View style={styles.joystickDataView}>
            <Text style={styles.joystickDataText}>Eixo X: {direcao.x.toFixed(2)}</Text>
            <Text style={styles.joystickDataText}>Eixo Y: {direcao.y.toFixed(2)}</Text>
            <Text style={styles.joystickDataText}>Potência: {Math.round(direcao.força * 100)}%</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>📡 Sensores em Tempo Real</Text>
        {MOCK_SENSORES.map((sensor) => (
          <CustomCard 
            key={sensor.id} 
            title={sensor.name} 
            description={`Leitura: ${sensor.value} ${sensor.unit}`} 
            buttonText="Ver Detalhes" 
            onPress={() => handleSelectMenuOption(sensor.name)}
          />
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>⚡ Controle de Atuadores</Text>
        <ActuatorControl name="Farol de LED Frontal" value={farol} onValueChange={setFarol} />
        <ActuatorControl name="Alarme Sonoro (Buzzer)" value={buzzer} onValueChange={setBuzzer} />
        <ActuatorControl name="Motor Esquerdo (Tração)" value={motor} onValueChange={setMotor} />

        <TouchableOpacity 
          onPress={handleParadaEmergencia} 
          style={styles.emergencyBtn}
          accessibilityLabel="Parada de emergência. Desliga imediatamente todos os motores e atuadores do robô"
          accessibilityRole="button"
        >
          <Text style={styles.emergencyBtnText}>🛑 PARADA DE EMERGÊNCIA</Text>
        </TouchableOpacity>
      </ScrollView>

      {Platform.OS !== 'web' && GamepadControllerMobile && (
        <GamepadControllerMobile onData={handleGamepadDataMobile} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: { flex: 1 },
  fundoEscuro: { backgroundColor: '#0f172a' },
  fundoClaro: { backgroundColor: '#1e293b' },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },themeToggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10, paddingHorizontal: 4 },statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingLeft: 4 },sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#38bdf8', marginBottom: 10, marginTop: 12 },cameraContainer: { height: 220, backgroundColor: '#000000', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#1e293b', marginBottom: 8, justifyContent: 'center', alignItems: 'center' },ipInput: { backgroundColor: '#1e293b', color: '#f8fafc', padding: 10, borderRadius: 10, marginBottom: 20, fontSize: 13, fontFamily: 'monospace' },joystickContainer: { backgroundColor: '#131b2e', borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 20, borderWidth: 1, borderColor: '#1e293b' },joystickDataView: { justifyContent: 'center', minWidth: 110 },joystickDataText: { color: '#94a3b8', fontSize: 13, fontWeight: '600', fontFamily: 'monospace', marginVertical: 3 },emergencyBtn: { backgroundColor: '#dc2626', padding: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 24, borderWidth: 2, borderColor: '#f87171', minHeight: 48, minWidth: 48 },emergencyBtnText: { fontSize: 16, fontWeight: '900', color: '#ffffff', letterSpacing: 0.5 }});