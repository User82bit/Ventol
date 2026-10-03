import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface Props {
  label: string;
  onPressIn: () => void;
  onPressOut: () => void;
  active: boolean;
  disabled: boolean;
}

export const ControlButton: React.FC<Props> = ({ label, onPressIn, onPressOut, active, disabled }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        active && styles.activeButton,
        disabled && styles.disabledButton,
      ]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#38bdf8',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 70,
  },
  activeButton: {
    backgroundColor: '#0284c7',
    borderWidth: 2,
    borderColor: '#e0f2fe',
  },
  disabledButton: {
    backgroundColor: '#cbd5e1',
    opacity: 0.5,
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledText: {
    color: '#64748b',
  },
});
