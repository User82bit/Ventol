import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface HeaderProps {
  title: string;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onToggleSidebar }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} onPress={onToggleSidebar}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Ecossistema IoT — Robô ESP</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    marginBottom: 12,
  },
  menuButton: {
    padding: 8,
    marginRight: 12,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  menuIcon: {
    fontSize: 20,
    color: '#38bdf8',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
});