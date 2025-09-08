import React from 'react';
import { View, Modal, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES } from '../constants';

interface GeneratingSummaryModalProps {
  visible: boolean;
}

export default function GeneratingSummaryModal({ visible }: GeneratingSummaryModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />
          <Text style={styles.title}>サマリーを生成中...</Text>
          <Text style={styles.subtitle}>しばらくお待ちください</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: 280,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  spinner: {
    marginBottom: 20,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});