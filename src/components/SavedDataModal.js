// src/components/SavedDataModal.js
import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS, SPACING, RADIUS } from '../theme';

const GENRE_LABELS = {
  shonen: 'Shōnen',
  shojo: 'Shōjo',
  seinen: 'Seinen',
  isekai: 'Isekai',
  mecha: 'Mecha',
  slice_of_life: 'Slice of life',
  terror: 'Terror / Thriller',
  deportes: 'Deportes',
};

const FREQ_LABELS = {
  diario: 'Todos los días',
  semanal: 'Varias veces a la semana',
  occasional: 'Ocasionalmente',
  raramente: 'Raramente',
};

export default function SavedDataModal({ visible, onClose, records, onDelete }) {
  const { theme } = useTheme();

  const confirmDelete = (id, name) => {
    Alert.alert(
      'Eliminar respuesta',
      `¿Eliminar la respuesta de "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(id) },
      ]
    );
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString('es-CL', {
        day: '2-digit', month: '2-digit', year: '2-digit',
        hour: '2-digit', minute: '2-digit',
      });
    } catch { return iso; }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.bg.primary }]}>
        <View style={[styles.header, { borderBottomColor: theme.border.default }]}>
          <View>
            <Text style={[styles.title, { color: theme.text.primary }]}>📋 Respuestas guardadas</Text>
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
              {records.length} {records.length === 1 ? 'respuesta' : 'respuestas'} en el dispositivo
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: theme.bg.secondary }]}
          >
            <Text style={[styles.closeIcon, { color: theme.text.primary }]}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {records.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🎌</Text>
              <Text style={[styles.emptyTitle, { color: theme.text.primary }]}>Sin respuestas aún</Text>
              <Text style={[styles.emptyText, { color: theme.text.secondary }]}>
                Completa el cuestionario y guarda tu primera respuesta.
              </Text>
            </View>
          ) : (
            records.map((record, index) => (
              <View
                key={record.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.bg.card,
                    borderColor: theme.border.default,
                    shadowColor: theme.shadow.color,
                  },
                ]}
              >
                <View style={[styles.cardHeader, { borderBottomColor: theme.border.default }]}>
                  <View style={[styles.badge, { backgroundColor: theme.accent.soft }]}>
                    <Text style={[styles.badgeText, { color: theme.accent.primary }]}>#{index + 1}</Text>
                  </View>
                  <Text style={[styles.cardName, { color: theme.text.primary }]}>
                    {record.nombre || 'Anónimo'}
                  </Text>
                  <View style={[styles.animeTag, { backgroundColor: record.veAnime === 'si' ? '#FFF0E8' : theme.bg.secondary }]}>
                    <Text style={{ fontSize: 12 }}>{record.veAnime === 'si' ? '🎌 Sí ve' : '❌ No ve'}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => confirmDelete(record.id, record.nombre || 'este registro')}
                    style={[styles.deleteBtn, { backgroundColor: theme.bg.secondary }]}
                  >
                    <Text style={{ color: theme.status.error, fontSize: 14 }}>🗑</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.cardBody}>
                  {record.veAnime === 'si' && record.animeFavorito ? (
                    <Row icon="⭐" label="Anime favorito" value={record.animeFavorito} theme={theme} />
                  ) : null}
                  {record.frecuencia ? (
                    <Row icon="📅" label="Frecuencia" value={FREQ_LABELS[record.frecuencia] || record.frecuencia} theme={theme} />
                  ) : null}
                  {record.generoFav ? (
                    <Row icon="🎭" label="Género favorito" value={GENRE_LABELS[record.generoFav] || record.generoFav} theme={theme} />
                  ) : null}
                  {record.recomendaria ? (
                    <Row icon="💬" label="¿Recomendaría?" value={record.recomendaria === 'si' ? 'Sí' : record.recomendaria === 'quizas' ? 'Quizás' : 'No'} theme={theme} />
                  ) : null}
                  <Row icon="🕐" label="Guardado" value={formatDate(record.savedAt)} theme={theme} />
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function Row({ icon, label, value, theme }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldIcon}>{icon}</Text>
      <View style={styles.fieldContent}>
        <Text style={[styles.fieldLabel, { color: theme.text.secondary }]}>{label}</Text>
        <Text style={[styles.fieldValue, { color: theme.text.primary }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  title: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold, letterSpacing: -0.5 },
  subtitle: { fontSize: FONTS.sizes.sm, marginTop: 2 },
  closeButton: {
    width: 36, height: 36, borderRadius: RADIUS.pill,
    alignItems: 'center', justifyContent: 'center',
  },
  closeIcon: { fontSize: 16, fontWeight: FONTS.weights.bold },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  empty: { alignItems: 'center', paddingTop: SPACING.xxl * 2, gap: SPACING.sm },
  emptyIcon: { fontSize: 52, marginBottom: SPACING.xs },
  emptyTitle: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold },
  emptyText: { fontSize: FONTS.sizes.sm, textAlign: 'center', lineHeight: 20 },
  card: {
    borderRadius: RADIUS.lg, borderWidth: 1, marginBottom: SPACING.md,
    overflow: 'hidden', shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8, shadowOpacity: 0.06, elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center',
    padding: SPACING.md, borderBottomWidth: StyleSheet.hairlineWidth, gap: SPACING.sm,
  },
  badge: {
    borderRadius: RADIUS.pill, paddingHorizontal: SPACING.sm, paddingVertical: 2,
  },
  badgeText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, letterSpacing: 0.5 },
  cardName: { flex: 1, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.semibold },
  animeTag: { borderRadius: RADIUS.pill, paddingHorizontal: 8, paddingVertical: 3 },
  deleteBtn: {
    width: 32, height: 32, borderRadius: RADIUS.pill,
    alignItems: 'center', justifyContent: 'center',
  },
  cardBody: { padding: SPACING.md, gap: SPACING.sm },
  field: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
  fieldIcon: { fontSize: 14, marginTop: 2, width: 20, textAlign: 'center' },
  fieldContent: { flex: 1 },
  fieldLabel: {
    fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.medium,
    letterSpacing: 0.3, textTransform: 'uppercase',
  },
  fieldValue: { fontSize: FONTS.sizes.sm, marginTop: 1, lineHeight: 18 },
});
