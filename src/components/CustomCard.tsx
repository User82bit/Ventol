import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface CustomCardProps {
  title: string;
  description: string;
  buttonText?: string;
  onPress?: () => void;
}

export const CustomCard: React.FC<CustomCardProps> = ({
  title,
  description,
  buttonText = 'Ver Detalhes',
  onPress,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {onPress && (
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  description: {
    fontSize: 14,
    color: '#94a3b8',
    marginVertical: 6,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});