import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (optionName: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onSelectOption }) => {
  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.sidebar}>
        {/* Cabeçalho da Sidebar */}
        <View style={styles.sidebarHeader}>
          <Text style={styles.avatar}>🤖</Text>
          <View>
            <Text style={styles.robotName}>Robô ESP32</Text>
            <Text style={styles.robotStatus}>● Sistema Operacional</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Itens do Menu */}
        <View style={styles.menuList}>
          <TouchableOpacity style={styles.menuItem} onPress={() => onSelectOption('Dashboard')}>
            <Text style={styles.menuItemText}>📊 Painel de Sensores</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => onSelectOption('Controle')}>
            <Text style={styles.menuItemText}>🕹️ Controle de Atuadores</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => onSelectOption('Configuracoes')}>
            <Text style={styles.menuItemText}>⚙️ Conexão ESP (Wi-Fi)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => onSelectOption('Historico')}>
            <Text style={styles.menuItemText}>📜 Histórico de Alertas</Text>
          </TouchableOpacity>
        </View>

        {/* Rodapé da Sidebar */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Versão 1.0.0 — Squad Mobile</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 100,
    flexDirection: 'row',
  },
  sidebar: {
    width: '75%',
    backgroundColor: '#0f172a',
    height: '100%',
    padding: 20,
    borderRightWidth: 1,
    borderRightColor: '#334155',
    justifyContent: 'space-between',
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    marginBottom: 20,
  },
  avatar: {
    fontSize: 32,
    marginRight: 12,
  },
  robotName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  robotStatus: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  closeButton: {
    marginLeft: 'auto',
    padding: 6,
  },
  closeText: {
    color: '#94a3b8',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  menuItemText: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 16,
  },
  footerText: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
  },
});