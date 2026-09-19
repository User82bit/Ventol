import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { CameraView } from '../components/CameraView';
import { ControlButton } from '../components/ControlButton';
import { MovementDirection } from '../types/robot';
import { initConnections, sendControl } from '../services/robotConnection';
import { CAMERA_STREAM_URL } from '../config/environment';

export const DashboardScreen: React.FC = () => {
  const [activeDirection, setActiveDirection] = useState<MovementDirection>(null);
  const [distance, setDistance] = useState<string>('--');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    initConnections(
      (data) => {
        // Assuming data is a JSON string containing distanceCm
        try {
          const parsed = JSON.parse(data);
          if (parsed.distanceCm !== undefined) {
            setDistance(parsed.distanceCm.toString());
          }
        } catch (e) {
          console.error("Error parsing robot data", e);
        }
      },
      setIsConnected
    );
  }, []);

  const handlePress = (direction: MovementDirection) => {
    if (activeDirection !== null && activeDirection !== direction) return;
    setActiveDirection(direction);
    
    let x = 0, y = 0;
    if (direction === 'forward') y = 1;
    else if (direction === 'backward') y = -1;
    else if (direction === 'left') x = -1;
    else if (direction === 'right') x = 1;
    
    sendControl(x, y);
  };

  const handleRelease = () => {
    setActiveDirection(null);
    sendControl(0, 0); // Stop
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.status}>
          {isConnected ? '● ROBÔ CONECTADO' : '● OFFLINE'}
        </Text>
      </View>

      <CameraView streamUrl={CAMERA_STREAM_URL} />

      <Text style={styles.distance}>DISTÂNCIA: {distance}CM</Text>

      <View style={styles.controls}>
        <View style={styles.column}>
          <ControlButton
            label="ESQUERDA"
            onPressIn={() => handlePress('left')}
            onPressOut={handleRelease}
            active={activeDirection === 'left'}
            disabled={activeDirection !== null && activeDirection !== 'left'}
          />
          <ControlButton
            label="DIREITA"
            onPressIn={() => handlePress('right')}
            onPressOut={handleRelease}
            active={activeDirection === 'right'}
            disabled={activeDirection !== null && activeDirection !== 'right'}
          />
        </View>

        <View style={styles.column}>
          <ControlButton
            label="FRENTE"
            onPressIn={() => handlePress('forward')}
            onPressOut={handleRelease}
            active={activeDirection === 'forward'}
            disabled={activeDirection !== null && activeDirection !== 'forward'}
          />
          <ControlButton
            label="TRÁS"
            onPressIn={() => handlePress('backward')}
            onPressOut={handleRelease}
            active={activeDirection === 'backward'}
            disabled={activeDirection !== null && activeDirection !== 'backward'}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  header: { marginBottom: 20 },
  status: { color: '#10b981', fontWeight: 'bold' },
  distance: { color: '#ffffff', fontSize: 20, textAlign: 'center', marginVertical: 20, fontWeight: 'bold' },
  controls: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { gap: 20 },
});
