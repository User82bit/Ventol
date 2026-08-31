import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ScrollView, Alert, TouchableOpacity, TextInput, Platform, useColorScheme } from 'react-native';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { CustomCard } from '../components/CustomCard';
import { StatusBadge } from '../components/StatusBadge';
import { AnimatedPulse } from '../components/AnimatedPulse';
import { ActuatorControl } from '../components/ActuatorControl';
import { Joystick } from '../components/Joystick';
import { SensorData } from '../types/sensorTypes';

// Injeção de CSS Puro com Media Profiles válido apenas para o ambiente Web
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const estiloCss = `
    /* Variáveis Globais para Modo Claro (Padrão) */
    :root {
      --cor-fundo: #ffffff;
      --cor-card: #f1f5f9;
      --cor-card-interno: #e2e8f0;
      --cor-texto-principal: #000000;
      --cor-texto-secundario: #334155;
      --cor-destaque: #0284c7;
      --cor-borda: #cbd5e1;
    }

    /* 🌓 Media Profile (Prefers Color Scheme) para detecção de Tema Escuro do Sistema */
    @media (prefers-color-scheme: dark) {
      :root {
        --cor-fundo: #0f172a;
        --cor-card: #1e293b;
        --cor-card-interno: #131b2e;
        --cor-texto-principal: #f8fafc;
        --cor-texto-secundario: #94a3b8;
        --cor-destaque: #38bdf8;
        --cor-borda: #1e293b;
      }
    }
  `;

  const elementoStyle = document.createElement('style');
  elementoStyle.type = 'text/css';
  elementoStyle.appendChild(document.createTextNode(estiloCss));
  document.head.appendChild(elementoStyle);
}

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [farol, setFarol] = useState(true);
  const [buzzer, setBuzzer] = useState(false);
  const [motor, setMotor] = useState(true);
  const [direcao, setDirecao] = useState({ x: 0, y: 0, força: 0 });
  const [cameraIp, setCameraIp] = useState('http://192.168.1'); 
  const [isGamepadConnected, setIsGamepadConnected] = useState(false);

  // Fallback seguro de tema para Mobile usando hooks nativos descritos pelo perfil de mídia
  const perfilDeMidiaSistema = useColorScheme();
  const [alternadorTema, setAlternadorTema] = useState<'system' | 'light' | 'dark'>('system');
  const modoEscuroAtivo = alternadorTema === 'system' ? perfilDeMidiaSistema === 'dark' : alternadorTema === 'dark';

  const statesRef = useRef({ farol, buzzer });
  const isGamepadConnectedRef = useRef(false);

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

  const alternarTemaManual = () => {
    if (modoEscuroAtivo) {
      setAlternadorTema('light');
    } else {
      setAlternadorTema('dark');
    }
  };

  const handleJoystickMove = (data: { x: number; y: number; force: number }) => {
    setDirecao({ x: data.x, y: data.y, força: data.force });
  };

  const handleJoystickStop = () => {
    setDirecao({ x: 0, y: 0, força: 0 });
  };

  // 🌐 GAMEPAD API WEB (Tipagem rigidamente indexada para sumir com os erros das linhas 142-160)
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    let animationId: number;
    let lastFarolButtonState = false;
    let lastBuzzerButtonState = false;

    const handleWebGamepad = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      const gp = gamepads[0]; // Captura direta do índice primário para sanar erro de tipagem array

      if (gp) {
        if (!isGamepadConnectedRef.current) {
          isGamepadConnectedRef.current = true;
          setIsGamepadConnected(true);
        }

        const x = parseFloat((gp.axes[0] || 0).toFixed(2));
        const y = parseFloat((-(gp.axes[1] || 0)).toFixed(2)); 
        const force = parseFloat(Math.min(Math.sqrt(x ** 2 + y ** 2), 1).toFixed(2));

        if (force > 0.15) {
          handleJoystickMove({ x, y, force });
        } else {
          handleJoystickStop();
        }

        if (gp.buttons[0]?.pressed) handleParadaEmergencia();

        const farolPressed = !!gp.buttons[2]?.pressed;
        if (farolPressed && !lastFarolButtonState) {
          setFarol(!statesRef.current.farol);
        }
        lastFarolButtonState = farolPressed;

        const buzzerPressed = !!gp.buttons[1]?.pressed;
        if (buzzerPressed && !lastBuzzerButtonState) {
          setBuzzer(!statesRef.current.buzzer);
        }
        lastBuzzerButtonState = buzzerPressed;
      } else {
        if (isGamepadConnectedRef.current) {
          isGamepadConnectedRef.current = false;
          setIsGamepadConnected(false);
        }
      }

      animationId = requestAnimationFrame(handleWebGamepad);
    };

    animationId = requestAnimationFrame(handleWebGamepad);
    return () => cancelAnimationFrame(animationId);
  }, []);

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

  // Mapeamento de variáveis nativas que conversam com o CSS injetado
  const coresTema = {
    bg: Platform.OS === 'web' ? 'var(--cor-fundo)' : (modoEscuroAtivo ? '#0f172a' : '#ffffff'),
    card: Platform.OS === 'web' ? 'var(--cor-card)' : (modoEscuroAtivo ? '#1e293b' : '#f1f5f9'),
    cardInterno: Platform.OS === 'web' ? 'var(--cor-card-interno)' : (modoEscuroAtivo ? '#131b2e' : '#e2e8f0'),
    texto: Platform.OS === 'web' ? 'var(--cor-texto-principal)' : (modoEscuroAtivo ? '#f8fafc' : '#000000'),
    subtexto: Platform.OS === 'web' ? 'var(--cor-texto-secundario)' : (modoEscuroAtivo ? '#94a3b8' : '#334155'),
    destaque: Platform.OS === 'web' ? 'var(--cor-destaque)' : (modoEscuroAtivo ? '#38bdf8' : '#0284c7'),
    borda: Platform.OS === 'web' ? 'var(--cor-borda)' : (modoEscuroAtivo ? '#1e293b' : '#cbd5e1'),
  };

  return (
    <View style={{ flex: 1, backgroundColor: coresTema.bg }}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onSelectOption={handleSelectMenuOption} />
      
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
        <Header title="🤖 Painel do Robô ESP" onToggleSidebar={() => setIsSidebarOpen(true)} />
        
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, marginTop: 8, paddingHorizontal: 4, width: '100%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ marginRight: 8 }}>
              <AnimatedPulse color={isGamepadConnected ? '#38bdf8' : '#10b981'} />
            </View>
            <StatusBadge 
              label={isGamepadConnected ? `Controle Conectado (${Platform.OS.toUpperCase()})` : "Conectado ao ESP32"} 
              status="online" 
            />
          </View>

          <TouchableOpacity 
            style={{ paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: coresTema.card, borderColor: coresTema.borda }} 
            onPress={alternarTemaManual}
          >
            <Text style={{ fontSize: 13, fontWeight: '700', color: coresTema.texto }}>
              {modoEscuroAtivo ? '☀️ Claro' : '🌙 Escuro'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 📹 SEÇÃO DA CÂMERA */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 12, color: coresTema.destaque }}>📹 Câmera do Semeador</Text>
        <View style={{ height: 220, backgroundColor: '#000000', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: coresTema.borda, marginBottom: 8, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: coresTema.subtexto }}>Stream da Câmera do Robô</Text>
        </View>
        <TextInput 
