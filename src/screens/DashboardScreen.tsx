import React, { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView } from '../components/CameraView';
import { initConnections, sendControl } from '../services/robotConnection';
import { CAMERA_STREAM_URL } from '../config/environment';

type MotorPower = -1 | 0 | 1;
type MotorSide = 'left' | 'right';
type DriveMode = 'auto' | 'reverse';
type PressedMotors = Record<MotorSide, boolean>;

interface MotorCardProps {
  side: 'ESQUERDO' | 'DIREITO';
  power: MotorPower;
  pressed: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
}

function MotorCard({ side, power, pressed, onPressIn, onPressOut }: MotorCardProps) {
  const powerLabel = power === 1 ? 'AVANÇANDO' : power === -1 ? 'RECUANDO' : 'PARADO';

  return (
    <View style={styles.motorColumn}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Esteira do motor ${side.toLowerCase()}`}
        accessibilityHint="Mantenha pressionado para acionar esta esteira"
        accessibilityState={{ selected: pressed }}
        style={({ pressed: isTouching }) => [
          styles.motorCard,
          pressed && styles.motorCardActive,
          isTouching && styles.motorCardTouching,
        ]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View style={styles.motorHeader}>
          <View style={[styles.motorStatusDot, power !== 0 && styles.motorStatusActive]} />
        </View>
        <View style={styles.track}>
          <View style={styles.trackRail}>
            {Array.from({ length: 7 }, (_, index) => (
              <View
                key={index}
                style={[
                  styles.trackPad,
                  power !== 0 && styles.trackPadActive,
                ]}
              />
            ))}
          </View>
          <View style={styles.trackCenter}>
            <Text style={[styles.motorSign, power !== 0 && styles.motorSignActive]}>
              {power === 1 ? '+' : power === -1 ? '−' : '0'}
            </Text>
          </View>
          <View style={styles.trackRail}>
            {Array.from({ length: 7 }, (_, index) => (
              <View
                key={index}
                style={[
                  styles.trackPad,
                  power !== 0 && styles.trackPadActive,
                ]}
              />
            ))}
          </View>
        </View>
        <Text style={styles.motorPower}>{powerLabel}</Text>
      </Pressable>
      <Text style={styles.motorCaption}>MOTOR {side}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const [pressedMotors, setPressedMotors] = useState<PressedMotors>({
    left: false,
    right: false,
  });
  const pressedMotorsRef = useRef<PressedMotors>({ left: false, right: false });
  const [driveMode, setDriveMode] = useState<DriveMode>('auto');
  const [distance, setDistance] = useState<string>('--');
  const [isConnected, setIsConnected] = useState(false);
  const { width } = useWindowDimensions();
  const compact = width < 720;
  const leftMotor: MotorPower = pressedMotors.left
    ? (driveMode === 'reverse' ? -1 : 1)
    : pressedMotors.right
      ? (driveMode === 'reverse' ? 1 : -1)
      : 0;
  const rightMotor: MotorPower = pressedMotors.right
    ? (driveMode === 'reverse' ? -1 : 1)
    : pressedMotors.left
      ? (driveMode === 'reverse' ? 1 : -1)
      : 0;

  useEffect(() => {
    initConnections(
      (data) => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.distanceCm !== undefined) {
            setDistance(parsed.distanceCm.toString());
          }
        } catch (error) {
          console.error('Error parsing robot data', error);
        }
      },
      setIsConnected
    );
  }, []);

  const sendMotorState = (motors: PressedMotors, mode: DriveMode) => {
    if (!motors.left && !motors.right) {
      void sendControl(0, 0);
      return;
    }

    const reverse = mode === 'reverse' ? -1 : 1;
    const left = (motors.left ? 1 : -1) * reverse;
    const right = (motors.right ? 1 : -1) * reverse;
    const x = (left - right) / 2;
    const y = (left + right) / 2;
    void sendControl(x, y);
  };

  const updateMotor = (side: MotorSide, pressed: boolean) => {
    const nextMotors = { ...pressedMotorsRef.current, [side]: pressed };
    pressedMotorsRef.current = nextMotors;
    setPressedMotors(nextMotors);
    sendMotorState(nextMotors, driveMode);
  };

  const changeDriveMode = (mode: DriveMode) => {
    setDriveMode(mode);
    sendMotorState(pressedMotorsRef.current, mode);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>VENTOL</Text>
          <Text style={styles.headerSubtitle}>PAINEL DE CONTROLE</Text>
        </View>
        <View style={[styles.connectionBadge, isConnected ? styles.connectedBadge : styles.offlineBadge]}>
          <View style={[styles.connectionDot, isConnected ? styles.connectedDot : styles.offlineDot]} />
          <Text style={[styles.connectionText, isConnected ? styles.connectedText : styles.offlineText]}>
            {isConnected ? 'CONECTADO' : 'OFFLINE'}
          </Text>
        </View>
      </View>

      <View style={[styles.content, compact && styles.contentCompact]}>
        <MotorCard
          side="ESQUERDO"
          power={leftMotor}
          pressed={pressedMotors.left}
          onPressIn={() => updateMotor('left', true)}
          onPressOut={() => updateMotor('left', false)}
        />

        <View style={styles.centerColumn}>
          <View style={styles.cameraFrame}>
            <CameraView streamUrl={CAMERA_STREAM_URL} />
          </View>
          <View style={styles.dashboardFooter}>
            <View style={styles.distanceCard}>
              <View style={styles.distanceIcon}>
                <View style={styles.sensorDot} />
                <View style={styles.sensorWave} />
              </View>
              <View>
                <Text style={styles.distanceLabel}>ULTRASSOM</Text>
                <Text style={styles.distanceValue}>{distance}<Text style={styles.distanceUnit}> cm</Text></Text>
              </View>
            </View>

            <View style={styles.gearSelector}>
              <Text style={styles.gearLabel}>MODO DE CONDUÇÃO</Text>
              <View style={styles.gearOptions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Modo automático"
                  accessibilityState={{ selected: driveMode === 'auto' }}
                  style={[styles.gearButton, driveMode === 'auto' && styles.gearButtonSelected]}
                  onPress={() => changeDriveMode('auto')}
                >
                  <Text style={[styles.gearButtonText, driveMode === 'auto' && styles.gearButtonTextSelected]}>
                    AUTO
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Modo ré"
                  accessibilityState={{ selected: driveMode === 'reverse' }}
                  style={[styles.gearButton, driveMode === 'reverse' && styles.gearButtonSelected]}
                  onPress={() => changeDriveMode('reverse')}
                >
                  <Text style={[styles.gearButtonText, driveMode === 'reverse' && styles.gearButtonTextSelected]}>
                    R
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <MotorCard
          side="DIREITO"
          power={rightMotor}
          pressed={pressedMotors.right}
          onPressIn={() => updateMotor('right', true)}
          onPressOut={() => updateMotor('right', false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 18,
  },
  header: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  brand: {
    color: '#17212b',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 2,
  },
  headerSubtitle: {
    color: '#77818b',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  connectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  connectedBadge: { backgroundColor: '#e6f6ee' },
  offlineBadge: { backgroundColor: '#fceeed' },
  connectionDot: { width: 7, height: 7, borderRadius: 4 },
  connectedDot: { backgroundColor: '#18a66a' },
  offlineDot: { backgroundColor: '#df5b53' },
  connectionText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  connectedText: { color: '#168555' },
  offlineText: { color: '#c34b45' },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 22,
    minHeight: 0,
  },
  contentCompact: { gap: 12 },
  motorColumn: {
    width: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  motorCard: {
    width: '100%',
    flex: 1,
    maxHeight: 340,
    minHeight: 180,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e3e7eb',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#d8dde2',
  },
  motorCardActive: {
    backgroundColor: '#e8f4fb',
    borderColor: '#b5ddf0',
  },
  motorCardTouching: { opacity: 0.86 },
  motorHeader: { alignItems: 'center' },
  motorStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#aab2ba',
  },
  motorStatusActive: { backgroundColor: '#2196c8' },
  track: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  trackRail: {
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  trackPad: {
    width: 12,
    height: 15,
    borderRadius: 5,
    backgroundColor: '#bbc2c9',
  },
  trackPadActive: { backgroundColor: '#6cb9da' },
  trackCenter: {
    width: 42,
    height: 70,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f8f9',
    borderWidth: 1,
    borderColor: '#d6dce1',
  },
  motorSign: { color: '#8a949d', fontSize: 23, fontWeight: '700' },
  motorSignActive: { color: '#177eae' },
  motorPower: {
    color: '#77818a',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  motorCaption: {
    color: '#616b74',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 9,
    letterSpacing: 0.5,
  },
  centerColumn: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: 12,
  },
  cameraFrame: {
    flex: 1,
    minHeight: 150,
    maxHeight: 380,
    backgroundColor: '#32383e',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
  },
  dashboardFooter: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  distanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e7eaed',
  },
  distanceIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#edf7fb',
  },
  sensorDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#2196c8',
  },
  sensorWave: {
    width: 15,
    height: 9,
    marginTop: 3,
    borderTopWidth: 1.5,
    borderColor: '#2196c8',
    borderRadius: 12,
  },
  distanceLabel: {
    color: '#7a858e',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  distanceValue: {
    color: '#17212b',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 1,
  },
  distanceUnit: { color: '#7a858e', fontSize: 11, fontWeight: '600' },
  gearSelector: {
    alignItems: 'flex-end',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e3e8ec',
  },
  gearLabel: {
    color: '#7a858e',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  gearOptions: {
    flexDirection: 'row',
    gap: 4,
  },
  gearButton: {
    minWidth: 42,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f3f5',
    borderRadius: 9,
  },
  gearButtonSelected: { backgroundColor: '#218fbe' },
  gearButtonText: { color: '#53616c', fontSize: 9, fontWeight: '800' },
  gearButtonTextSelected: { color: '#ffffff' },
});
