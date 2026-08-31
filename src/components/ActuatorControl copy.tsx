import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';

interface ActuatorControlProps {
  name: string;
  initialState?: boolean;
  onToggle?: (newState: boolean) => void;
}

export const ActuatorControl: React.FC<ActuatorControlProps> = ({
  name,
  initialState = false,
  onToggle,
}) => {
  const [isEnabled, setIsEnabled] = useState(initialState);

  const handleToggle = (value: boolean) => {
    setIsEnabled(value);
    if (onToggle) onToggle(value);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={[styles.statusText, { color: isEnabled ? '#10b981' : '#64748b' }]}>
          {isEnabled ? 'LIGADO' : 'DESLIGADO'}
        </Text>
      </View>
      <Switch
        trackColor={{ false: '#334155', true: '#0284c7' }}
        thumbColor={isEnabled ? '#38bdf8' : '#cbd5e1'}
        onValueChange={handleToggle}
        value={isEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
});