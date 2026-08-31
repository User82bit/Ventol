import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatusBadgeProps {
  label: string;
  status: 'online' | 'offline' | 'warning';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ label, status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'online':
        return { backgroundColor: '#10b981' };
      case 'offline':
        return { backgroundColor: '#ef4444' };
      case 'warning':
        return { backgroundColor: '#f59e0b' };
      default:
        return { backgroundColor: '#64748b' };
    }
  };

  return (
    <View style={[styles.badge, getBadgeStyle()]}>
      <Text style={styles.badgeText}>{label.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});