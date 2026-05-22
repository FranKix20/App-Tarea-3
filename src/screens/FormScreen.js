// src/screens/FormScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Animated,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { FONTS, SPACING, RADIUS } from '../theme';
import ThemeToggle from '../components/ThemeToggle';
import QuizOption from '../components/QuizOption';
import QuizSection from '../components/QuizSection';
import SavedDataModal from '../components/SavedDataModal';

const RECORDS_KEY = '@FormApp:records';

const INITIAL_FORM = {
  nombre: '',
  veAnime: '',
  animeFavorito: '',
  frecuencia: '',
  generoFav: '',
  recomendaria: '',
};

const FRECUENCIA_OPTIONS = [
  { value: 'diario', emoji: '🔥', label: 'Todos los días', sublabel: 'El anime es vida' },
  { value: 'semanal', emoji: '📺', label: 'Varias veces a la semana', sublabel: 'Siempre hay un capítulo pendiente' },
  { value: 'occasional', emoji: '🎲', label: 'Ocasionalmente', sublabel: 'Cuando hay tiempo' },
  { value: 'raramente', emoji: '🐢', label: 'Raramente', sublabel: 'Solo los clásicos de vez en cuando' },
];

const GENERO_OPTIONS = [
  { value: 'shonen', emoji: '⚔️', label: 'Shōnen', sublabel: 'Acción, amistad y poder' },
  { value: 'shojo', emoji: '🌸', label: 'Shōjo', sublabel: 'Romance y drama' },
  { value: 'seinen', emoji: '🧠', label: 'Seinen', sublabel: 'Maduro y complejo' },
  { value: 'isekai', emoji: '🌀', label: 'Isekai', sublabel: 'Otro mundo, otra vida' },
  { value: 'mecha', emoji: '🤖', label: 'Mecha', sublabel: 'Robots gigantes' },
  { value: 'slice_of_life', emoji: '🍵', label: 'Slice of Life', sublabel: 'Vida cotidiana y tranquila' },
  { value: 'terror', emoji: '😱', label: 'Terror / Thriller', sublabel: 'Suspenso e intriga' },
  { value: 'deportes', emoji: '🏆', label: 'Deportes', sublabel: 'Competencia y superación' },
];

const RECOMENDARIA_OPTIONS = [
  { value: 'si', emoji: '🙌', label: 'Sí, totalmente', sublabel: 'Lo recomendaría a todos' },
  { value: 'quizas', emoji: '🤔', label: 'Quizás', sublabel: 'Depende de la persona' },
  { value: 'no', emoji: '🙅', label: 'No realmente', sublabel: 'No es para todos' },
];

export default function FormScreen() {
  const { theme, themeMode } = useTheme();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showRecords, setShowRecords] = useState(false);
  const [records, setRecords] = useState([]);
  const [successAnim] = useState(new Animated.Value(0));
  const favAnim = useRef(new Animated.Value(0)).current;
  const favHeight = useRef(new Animated.Value(0)).current;

  const update = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));

    if (field === 'veAnime') {
      const show = value === 'si';
      Animated.parallel([
        Animated.timing(favAnim, {
          toValue: show ? 1 : 0,
          duration: 280,
          useNativeDriver: false,
        }),
        Animated.spring(favHeight, {
          toValue: show ? 1 : 0,
          tension: 80,
          friction: 12,
          useNativeDriver: false,
        }),
      ]).start();
      if (!show) setForm((prev) => ({ ...prev, animeFavorito: '', veAnime: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = true;
    if (!form.veAnime) newErrors.veAnime = true;
    if (form.veAnime === 'si' && !form.animeFavorito.trim()) newErrors.animeFavorito = true;
    if (form.veAnime === 'si' && !form.frecuencia) newErrors.frecuencia = true;
    if (form.veAnime === 'si' && !form.generoFav) newErrors.generoFav = true;
    if (!form.recomendaria) newErrors.recomendaria = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showSuccess = () => {
    Animated.sequence([
      Animated.spring(successAnim, { toValue: 1, useNativeDriver: true, tension: 80 }),
      Animated.delay(2400),
      Animated.timing(successAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const handleSave = async () => {
    if (!validate()) {
      Alert.alert('Cuestionario incompleto', 'Por favor responde todas las preguntas obligatorias.');
      return;
    }
    setSaving(true);
    try {
      const existing = await AsyncStorage.getItem(RECORDS_KEY);
      const list = existing ? JSON.parse(existing) : [];
      const newRecord = {
        id: Date.now().toString(),
        ...form,
        nombre: form.nombre.trim(),
        animeFavorito: form.animeFavorito.trim(),
        savedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify([newRecord, ...list]));
      setForm(INITIAL_FORM);
      setErrors({});
      Animated.timing(favAnim, { toValue: 0, duration: 250, useNativeDriver: false }).start();
      Animated.timing(favHeight, { toValue: 0, duration: 250, useNativeDriver: false }).start();
      showSuccess();
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const loadRecords = async () => {
    try {
      const data = await AsyncStorage.getItem(RECORDS_KEY);
      setRecords(data ? JSON.parse(data) : []);
    } catch { setRecords([]); }
    setShowRecords(true);
  };

  const deleteRecord = async (id) => {
    try {
      const updated = records.filter((r) => r.id !== id);
      await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify(updated));
      setRecords(updated);
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el registro.');
    }
  };

  const favOpacity = favAnim;
  const favMaxHeight = favHeight.interpolate({ inputRange: [0, 1], outputRange: [0, 200] });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg.primary }]}>
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg.primary}
      />

      {/* Top bar */}
      <View style={[styles.topBar, { borderBottomColor: theme.border.default, backgroundColor: theme.bg.primary }]}>
        <View style={styles.logoRow}>
          <Text style={styles.logoEmoji}>🎌</Text>
          <View>
            <Text style={[styles.appName, { color: theme.text.primary }]}>AnimeQuiz</Text>
            <Text style={[styles.appTagline, { color: theme.accent.primary }]}>Cuestionario</Text>
          </View>
        </View>
        <View style={styles.topActions}>
          <TouchableOpacity
            onPress={loadRecords}
            style={[styles.recordsBtn, { backgroundColor: theme.accent.soft, borderColor: theme.border.default }]}
          >
            <Text style={[styles.recordsBtnText, { color: theme.accent.primary }]}>📋 Respuestas</Text>
          </TouchableOpacity>
          <ThemeToggle />
        </View>
      </View>

      {/* Success Toast */}
      <Animated.View
        style={[
          styles.toast,
          {
            backgroundColor: theme.status.success,
            opacity: successAnim,
            transform: [
              {
                translateY: successAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0],
                }),
              },
            ],
          },
        ]}
        pointerEvents="none"
      >
        <Text style={styles.toastText}>🎉 ¡Respuesta guardada!</Text>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={[styles.heroCard, { backgroundColor: theme.accent.soft, borderColor: theme.border.default }]}>
          <Text style={styles.heroEmoji}>🍜  🗾  ✨</Text>
          <Text style={[styles.heroTitle, { color: theme.text.primary }]}>
            ¿Eres fan del anime?
          </Text>
          <Text style={[styles.heroSub, { color: theme.text.secondary }]}>
            Responde este pequeño cuestionario y cuéntanos sobre tus hábitos animeros 🙌
          </Text>
        </View>

        {/* Q0: Nombre */}
        <QuizSection number="0" title="¿Cómo te llamas?" subtitle="Un apodo está bien también 😄">
          <View style={[
            styles.nameInput,
            {
              backgroundColor: theme.bg.input,
              borderColor: errors.nombre ? theme.border.error : form.nombre ? theme.border.focus : theme.border.default,
              borderWidth: form.nombre ? 1.5 : 1,
            }
          ]}>
            <Text style={styles.nameIcon}>👤</Text>
            <TextInput
              value={form.nombre}
              onChangeText={update('nombre')}
              placeholder="Tu nombre o apodo"
              placeholderTextColor={theme.text.placeholder}
              style={[styles.nameText, { color: theme.text.primary }]}
            />
          </View>
          {errors.nombre ? (
            <Text style={[styles.errorHint, { color: theme.status.error }]}>⚠ Este campo es obligatorio</Text>
          ) : null}
        </QuizSection>

        {/* Q1: ¿Ves anime? */}
        <QuizSection
          number="1"
          title="¿Ves anime?"
          subtitle="Sin juzgar, sea cual sea tu respuesta 👀"
          accent={errors.veAnime ? theme.status.error : undefined}
        >
          <QuizOption
            emoji="🎌"
            label="Sí, soy fan del anime"
            sublabel="Me encantan las series japonesas"
            selected={form.veAnime === 'si'}
            onPress={() => update('veAnime')('si')}
          />
          <QuizOption
            emoji="🤷"
            label="No, no veo anime"
            sublabel="No es lo mío por ahora"
            selected={form.veAnime === 'no'}
            onPress={() => update('veAnime')('no')}
          />
          {errors.veAnime ? (
            <Text style={[styles.errorHint, { color: theme.status.error }]}>⚠ Selecciona una opción</Text>
          ) : null}
        </QuizSection>

        {/* Conditional: Anime favorito */}
        <Animated.View style={{ opacity: favOpacity, maxHeight: favMaxHeight, overflow: 'hidden' }}>
          <QuizSection number="1.1" title="¿Cuál es tu anime favorito?" subtitle="Solo uno… si puedes elegir 😅">
            <View style={[
              styles.nameInput,
              {
                backgroundColor: theme.bg.input,
                borderColor: errors.animeFavorito ? theme.border.error : form.animeFavorito ? theme.border.focus : theme.border.default,
                borderWidth: form.animeFavorito ? 1.5 : 1,
              }
            ]}>
              <Text style={styles.nameIcon}>⭐</Text>
              <TextInput
                value={form.animeFavorito}
                onChangeText={update('animeFavorito')}
                placeholder="Ej: Fullmetal Alchemist, Naruto..."
                placeholderTextColor={theme.text.placeholder}
                style={[styles.nameText, { color: theme.text.primary }]}
              />
            </View>
            {errors.animeFavorito ? (
              <Text style={[styles.errorHint, { color: theme.status.error }]}>⚠ Cuéntanos tu favorito</Text>
            ) : null}
          </QuizSection>
        </Animated.View>

        {/* Q2: Frecuencia (solo si ve anime) */}
        {form.veAnime === 'si' && (
          <QuizSection
            number="2"
            title="¿Con qué frecuencia ves anime?"
            subtitle="Sé honesto/a 😏"
            accent={errors.frecuencia ? theme.status.error : undefined}
          >
            {FRECUENCIA_OPTIONS.map((opt) => (
              <QuizOption
                key={opt.value}
                emoji={opt.emoji}
                label={opt.label}
                sublabel={opt.sublabel}
                selected={form.frecuencia === opt.value}
                onPress={() => update('frecuencia')(opt.value)}
              />
            ))}
            {errors.frecuencia ? (
              <Text style={[styles.errorHint, { color: theme.status.error }]}>⚠ Selecciona una opción</Text>
            ) : null}
          </QuizSection>
        )}

        {/* Q3: Género favorito (solo si ve anime) */}
        {form.veAnime === 'si' && (
          <QuizSection
            number="3"
            title="¿Cuál es tu género favorito?"
            subtitle="El que siempre terminas viendo"
            accent={errors.generoFav ? theme.status.error : undefined}
          >
            {GENERO_OPTIONS.map((opt) => (
              <QuizOption
                key={opt.value}
                emoji={opt.emoji}
                label={opt.label}
                sublabel={opt.sublabel}
                selected={form.generoFav === opt.value}
                onPress={() => update('generoFav')(opt.value)}
              />
            ))}
            {errors.generoFav ? (
              <Text style={[styles.errorHint, { color: theme.status.error }]}>⚠ Selecciona una opción</Text>
            ) : null}
          </QuizSection>
        )}

        {/* Q4: ¿Recomendarías el anime? */}
        <QuizSection
          number={form.veAnime === 'si' ? "4" : "2"}
          title="¿Recomendarías ver anime?"
          subtitle="A alguien que nunca ha visto"
          accent={errors.recomendaria ? theme.status.error : undefined}
        >
          {RECOMENDARIA_OPTIONS.map((opt) => (
            <QuizOption
              key={opt.value}
              emoji={opt.emoji}
              label={opt.label}
              sublabel={opt.sublabel}
              selected={form.recomendaria === opt.value}
              onPress={() => update('recomendaria')(opt.value)}
            />
          ))}
          {errors.recomendaria ? (
            <Text style={[styles.errorHint, { color: theme.status.error }]}>⚠ Selecciona una opción</Text>
          ) : null}
        </QuizSection>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.accent.primary }]}
          onPress={handleSave}
          activeOpacity={0.82}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Guardar respuestas →</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.clearButton, { borderColor: theme.border.default }]}
          onPress={() => {
            setForm(INITIAL_FORM);
            setErrors({});
            Animated.timing(favAnim, { toValue: 0, duration: 250, useNativeDriver: false }).start();
            Animated.timing(favHeight, { toValue: 0, duration: 250, useNativeDriver: false }).start();
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.clearButtonText, { color: theme.text.secondary }]}>
            🗑 Limpiar cuestionario
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <SavedDataModal
        visible={showRecords}
        onClose={() => setShowRecords(false)}
        records={records}
        onDelete={deleteRecord}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  logoEmoji: { fontSize: 26 },
  appName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.black,
    letterSpacing: -0.8,
  },
  appTagline: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  recordsBtn: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
  },
  recordsBtnText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
  },
  toast: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    zIndex: 100,
  },
  toastText: {
    color: '#fff',
    fontWeight: FONTS.weights.bold,
    fontSize: FONTS.sizes.sm,
  },
  scroll: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  heroCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
    letterSpacing: 8,
  },
  heroTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.black,
    letterSpacing: -0.8,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  heroSub: {
    fontSize: FONTS.sizes.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  nameInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 52,
    gap: SPACING.sm,
    borderWidth: 1,
  },
  nameIcon: { fontSize: 18 },
  nameText: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
  },
  errorHint: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  saveButton: {
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md + 4,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 0.3,
  },
  clearButton: {
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  clearButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
});
