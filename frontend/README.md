# 🏋️ GymApp Frontend

Aplicación móvil multiplataforma para gestión de rutinas de gimnasio construida con React Native y Expo.

## 🚀 Tecnologías

- **React Native** - Framework móvil
- **Expo** - Toolchain y SDK
- **React Navigation** - Navegación entre pantallas
- **Axios** - Cliente HTTP
- **AsyncStorage** - Almacenamiento local
- **Ionicons** - Iconos vectoriales

## 📋 Características

- ✅ Autenticación con JWT
- ✅ Diseño minimalista (negro/blanco/rojo)
- ✅ Gestión de rutinas predefinidas y personalizadas
- ✅ Catálogo de ejercicios con filtros por grupo muscular
- ✅ Sistema de favoritos
- ✅ Creación de rutinas personalizadas con múltiples ejercicios
- ✅ Entrenamiento en tiempo real con registro de sets
- ✅ Historial completo de entrenamientos
- ✅ Perfil de usuario con estadísticas
- ✅ Eliminación de rutinas propias con validaciones
- ✅ Modals personalizados sin dependencias externas

## 🛠️ Instalación

### Requisitos Previos
- Node.js v20+
- Expo Go instalado en tu dispositivo móvil (Android/iOS)
- Backend corriendo en `http://localhost:3000` o deployed

### Paso 1: Clonar repositorio
```bash
git clone https://github.com/SaulVaz/Aplicacion-Movil-GymApp.git
cd Aplicacion-Movil-GymApp/frontend
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Configurar conexión con backend

Abre `src/services/api.js` y configura la URL del backend:

```javascript
// Para emulador de Android
const API_URL = 'http://10.0.2.2:3000/api';

// Para dispositivo físico en la misma red
const API_URL = 'http://TU_IP_LOCAL:3000/api';

// Para backend en producción
const API_URL = 'https://tu-backend.com/api';
```

### Paso 4: Iniciar la aplicación

```bash
# Iniciar servidor de desarrollo
npx expo start

# O directamente en Android
npx expo start --android

# O directamente en iOS (requiere macOS)
npx expo start --ios
```

Escanea el QR con **Expo Go** desde tu dispositivo móvil.

## 📝 Scripts Disponibles

```bash
npm start          # Iniciar Expo
npx expo start --android  # Abrir en Android
npx expo start --ios      # Abrir en iOS
npx expo start --web      # Abrir en navegador
```

## 🏗️ Estructura del Proyecto
frontend/
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── WelcomeScreen.js      # Pantalla inicial
│   │   │   ├── LoginScreen.js        # Inicio de sesión
│   │   │   └── RegisterScreen.js     # Registro
│   │   └── main/
│   │       ├── RoutinesScreen.js     # Lista de rutinas
│   │       ├── RoutineDetailScreen.js # Detalle de rutina
│   │       ├── CreateRoutineScreen.js # Crear rutina
│   │       ├── WorkoutScreen.js      # Entrenamiento en vivo
│   │       ├── ExercisesScreen.js    # Catálogo de ejercicios
│   │       ├── SessionsScreen.js     # Historial
│   │       └── ProfileScreen.js      # Perfil de usuario
│   ├── navigation/
│   │   └── AppNavigator.js           # Configuración de navegación
│   ├── services/
│   │   └── api.js                    # Cliente API REST
│   └── context/
│       └── AuthContext.js            # Estado global de autenticación
├── app.json
├── package.json
└── index.js

## 🎨 Diseño

La aplicación utiliza un esquema de colores minimalista:
- **Negro** (#000000) - Fondo principal
- **Gris oscuro** (#111111) - Cards y elementos
- **Rojo** (#FF0000) - Acentos y acciones principales
- **Blanco** (#FFFFFF) - Texto principal
- **Gris** (#666666, #999999) - Texto secundario

## 🔄 Flujo de la Aplicación

### Autenticación
1. Pantalla de bienvenida
2. Login o Registro
3. Token JWT guardado en AsyncStorage

### Gestión de Rutinas
1. Ver rutinas predefinidas y personalizadas
2. Filtrar por favoritos
3. Crear nuevas rutinas seleccionando ejercicios
4. Configurar sets, reps y descanso por ejercicio
5. Eliminar rutinas propias (no predefinidas)

### Entrenamiento
1. Seleccionar rutina
2. Iniciar sesión de entrenamiento
3. Registrar peso y repeticiones por cada set
4. Sistema de progreso automático
5. Finalizar o cancelar entrenamiento

### Historial
1. Ver todas las sesiones completadas
2. Detalles de cada entrenamiento
3. Estadísticas de progreso

## 🔐 Autenticación

La app utiliza JWT almacenado en AsyncStorage. El token se envía automáticamente en cada request mediante interceptores de Axios:

```javascript
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

## 📦 Dependencias Principales

```json
{
  "@react-navigation/native": "^7.1.28",
  "@react-navigation/native-stack": "^7.12.0",
  "@react-navigation/bottom-tabs": "^7.13.0",
  "axios": "^1.13.5",
  "@react-native-async-storage/async-storage": "2.2.0",
  "react-native-safe-area-context": "~5.6.0",
  "react-native-screens": "~4.16.0",
  "expo": "~54.0.33"
}
```

## 🚧 Funcionalidades Futuras

- [ ] Gráficas de progreso (peso/reps a lo largo del tiempo)
- [ ] Editar rutinas existentes
- [ ] Temporizador de descanso entre sets
- [ ] Fotos de progreso (antes/después)
- [ ] Compartir rutinas entre usuarios
- [ ] Modo claro/oscuro
- [ ] Notificaciones push
- [ ] Soporte offline

## 📄 Licencia

MIT

## 👨‍💻 Autor

Saul Vazquez del Rio - [GitHub](https://github.com/SaulVaz)

## 🔗 Enlaces

- [Backend Repository](../backend)
- [Repositorio Principal](https://github.com/SaulVaz/Aplicacion-Movil-GymApp)