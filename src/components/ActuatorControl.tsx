import React from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';

interface ActuatorControlProps {
  name: string;
  value: boolean;
  onValueChange: (newValue: boolean) => void;
}

export const ActuatorControl: React.FC<ActuatorControlProps> = ({ name, value, onValueChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.nameText}>{name}</Text>
      <Switch
        trackColor={{ false: '#334155', true: '#0284c7' }}
        thumbColor={value ? '#38bdf8' : '#94a3b8'}
        ios_backgroundColor="#334155"
        onValueChange={onValueChange} 
        value={value}                 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  nameText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '600',
  },
});
