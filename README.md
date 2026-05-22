# Tarea Primera app
<div align="center">

| | |
|---|---|
| **Alumno** | Franco Ariel Quintumán Cofré |
| **Profesor** | Hector Eduardo Cifuentes Mella |
| **Materia** | Computación Web y Móvil |
| **Sección** | 303 |

</div>

---

# 🎌 AnimeQuiz App

Una aplicación móvil construida con **React Native + Expo** que funciona como cuestionario interactivo sobre hábitos de consumo de anime. Los datos se guardan localmente en el dispositivo del usuario.

---

## 📱 Ver la app en tu celular

Esta app corre directamente en tu teléfono usando **Expo Go**, sin necesidad de instalar ningún APK ni pasar por una tienda de apps.

### Pasos:

1. Descarga **Expo Go** en tu celular:
   - [Android — Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS — App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Escanea el siguiente QR con la app de Expo Go:

<p align="center">
  <img src="QrExpoGo.png" alt="QR Expo Go" width="220"/>
</p>

> El QR abre el Snack de Expo donde está alojado el proyecto. No necesitas cuenta ni configuración adicional.

---

## 🧠 ¿Qué hace la app?

AnimeQuiz es un cuestionario de selección múltiple con las siguientes preguntas:

| # | Pregunta | Tipo |
|---|----------|------|
| 0 | ¿Cómo te llamas? | Texto libre |
| 1 | ¿Ves anime? | Opción única (Sí / No) |
| 1.1 | ¿Cuál es tu anime favorito? | Texto libre *(solo aparece si respondiste "Sí")* |
| 2 | ¿Con qué frecuencia ves anime? | Opción única *(solo si ve anime)* |
| 3 | ¿Cuál es tu género favorito? | Opción única *(solo si ve anime)* |
| 4 | ¿Recomendarías ver anime? | Opción única |

Las respuestas se guardan localmente en el dispositivo. Se pueden consultar en cualquier momento desde el botón **📋 Respuestas** y también se pueden eliminar individualmente.

---

## ✨ Funcionalidades

- **Cuestionario interactivo** con tarjetas de selección animadas
- **Lógica condicional**: la pregunta del anime favorito y las preguntas de frecuencia/género solo aparecen si el usuario responde que sí ve anime, con animación de expansión suave
- **Tema claro / oscuro** con toggle animado, persistido entre sesiones
- **Validación de campos** con mensajes de error inline
- **Guardado local** con `AsyncStorage` — los datos permanecen aunque cierres la app
- **Modal de respuestas guardadas** con opción de eliminar cada registro
- **Toast de confirmación** animado al guardar exitosamente

---

## 🗂️ Estructura del proyecto

```
src/
├── components/
│   ├── QuizOption.js       # Tarjeta de opción seleccionable con animaciones
│   ├── QuizSection.js      # Contenedor de sección con número y título
│   ├── SavedDataModal.js   # Modal que muestra las respuestas guardadas
│   └── ThemeToggle.js      # Switch animado de tema claro/oscuro
├── context/
│   └── ThemeContext.js     # Contexto global de tema con persistencia
├── screens/
│   └── FormScreen.js       # Pantalla principal con toda la lógica del quiz
└── theme/
    └── index.js            # Tokens de diseño: colores, tipografía, espaciado
App.js                      # Punto de entrada, envuelve la app en ThemeProvider
package.json
```

---

## 🛠️ ¿Cómo se construyó?

### Tecnologías utilizadas

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React Native | 0.73.4 | Framework base |
| Expo | ~50.0.0 | Entorno de desarrollo y ejecución |
| AsyncStorage | 1.21.0 | Persistencia local de datos |
| React Animated API | (incluida en RN) | Animaciones de UI |

No se utilizaron librerías de UI externas — todos los componentes fueron construidos desde cero con `StyleSheet` de React Native.

---

### Decisiones de arquitectura

**Contexto de tema (`ThemeContext`)**
El tema se maneja con React Context para que todos los componentes accedan a los colores sin prop drilling. Al cambiar el tema, se persiste en `AsyncStorage` con la clave `@FormApp:theme` para recordarlo entre sesiones.

**Tokens de diseño (`theme/index.js`)**
Todos los valores visuales (colores, tamaños de fuente, espaciados, radios de borde) están centralizados como constantes. Hay dos objetos de tema (`LIGHT_THEME` y `DARK_THEME`) que se intercambian según el modo activo.

**Animaciones sin conflicto de drivers**
React Native tiene dos formas de ejecutar animaciones: el **driver nativo** (corre en el hilo de UI, muy fluido) y el **driver JS** (corre en JavaScript, necesario para interpolar colores). En `QuizOption.js` se separaron en dos `Animated.Value` independientes:
- `scaleAnim` → `useNativeDriver: true` (solo maneja `transform: scale`)
- `colorAnim` → `useNativeDriver: false` (maneja `backgroundColor` y `borderColor`)

Esto evita el error `"Attempting to run JS driven animation on animated node that has been moved to native"`.

**Lógica condicional animada**
La sección del anime favorito usa dos valores animados (`favAnim` para opacidad y `favHeight` para altura máxima) que se disparan simultáneamente con `Animated.parallel` cuando el usuario selecciona "Sí veo anime", creando una transición de expansión suave.

**Almacenamiento de respuestas**
Cada respuesta se guarda como un objeto JSON en AsyncStorage bajo la clave `@FormApp:records`, acumulando un array de registros con timestamp. La lectura y escritura se hace con `async/await` dentro de bloques `try/catch`.

---

## 🎨 Sistema de diseño

La app usa una paleta cálida en tonos naranja/terra con soporte completo de modo oscuro:

| Token | Light | Dark |
|-------|-------|------|
| Fondo principal | `#FFF8F3` | `#0D0A08` |
| Acento primario | `#D4541A` | `#F07840` |
| Tarjeta | `#FFFFFF` | `#1E1914` |
| Texto principal | `#1C1410` | `#F5EDE6` |

---

## 📦 Dependencias

```json
{
  "@react-native-async-storage/async-storage": "1.21.0",
  "expo": "~50.0.0",
  "expo-status-bar": "~1.11.1",
  "react": "18.2.0",
  "react-native": "0.73.4",
  "react-native-safe-area-context": "4.8.2",
  "react-native-screens": "~3.29.0"
}
```

---

## ⚠️ Notas

- Los datos se guardan **solo en el dispositivo local** de cada usuario. No hay backend ni sincronización entre dispositivos.
- La app fue desarrollada y probada en **Expo Snack** con Expo Go. No ha sido compilada como APK/IPA standalone.
- Los emojis pueden verse ligeramente diferentes entre iOS y Android ya que cada sistema operativo tiene su propio set de emojis.

---

<p align="center">Hecho con ❤️ y React Native</p>
