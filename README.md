🏋️ GymApp - Full Stack
Aplicación completa de gestión de rutinas de gimnasio con backend REST API y aplicación móvil multiplataforma.

📸 Preview


📁 Estructura del Proyecto
gym-app/
├── backend/          # API REST - Node.js + Express + PostgreSQL
├── frontend/         # App móvil - React Native + Expo
└── README.md         # Este archivo

/backend - API REST con autenticación JWT y base de datos relacional
/frontend - Aplicación móvil multiplataforma (iOS/Android)


🚀 Tecnologías
Backend

Node.js - Runtime JavaScript
Express - Framework web
PostgreSQL - Base de datos relacional
Prisma ORM - Object-Relational Mapping
JWT - Autenticación con tokens
bcryptjs - Hash de contraseñas

Frontend

React Native - Framework móvil
Expo - Toolchain y SDK
React Navigation - Navegación entre pantallas
Axios - Cliente HTTP
AsyncStorage - Persistencia local
Ionicons - Iconos vectoriales


✨ Características
Backend API

✅ Autenticación JWT con roles (USER/ADMIN)
✅ CRUD completo de rutinas de entrenamiento
✅ Gestión de ejercicios por grupos musculares
✅ Sistema de favoritos
✅ Registro de sesiones de entrenamiento con sets detallados
✅ Historial completo de entrenamientos
✅ 20+ endpoints REST documentados

Frontend Mobile

✅ Diseño minimalista (negro/blanco/rojo)
✅ Autenticación persistente
✅ Rutinas predefinidas y personalizadas
✅ Catálogo de ejercicios con filtros
✅ Creación de rutinas con configuración detallada
✅ Entrenamiento en tiempo real
✅ Historial de progreso
✅ Perfil con estadísticas


🗄️ Modelo de Base de Datos
El sistema utiliza 8 tablas relacionales en PostgreSQL:

users - Usuarios con autenticación y datos físicos
muscle_groups - Catálogo de grupos musculares
exercises - Catálogo global de ejercicios
routines - Rutinas predefinidas y personalizadas
routine_exercises - Ejercicios dentro de cada rutina
workout_sessions - Historial de entrenamientos
workout_sets - Registro detallado de cada serie
favorite_routines - Relación usuarios-rutinas favoritas


⚡ Quick Start
Requisitos Previos

Node.js v20.19 o superior
PostgreSQL instalado y corriendo
Expo Go (para probar la app móvil)

1️⃣ Clonar el repositorio
bashgit clone https://github.com/TU-USUARIO/gym-app.git
cd gym-app
2️⃣ Configurar Backend
bashcd backend

# Instalar dependencias
npm install

# Crear archivo .env (ver backend/.env.example)
cp .env.example .env

# Editar .env con tus credenciales de PostgreSQL
# DATABASE_URL="postgresql://usuario:password@localhost:5432/gymapp_db"

# Crear base de datos
psql -U postgres -c "CREATE DATABASE gymapp_db;"

# Sincronizar schema
npx prisma db push

# (Opcional) Cargar datos de prueba
node prisma/seed.js

# Iniciar servidor
npm run dev
El servidor estará corriendo en http://localhost:3000
3️⃣ Configurar Frontend
bashcd frontend

# Instalar dependencias
npm install

# Configurar URL del backend en src/services/api.js
# Para emulador Android: http://10.0.2.2:3000/api
# Para dispositivo físico: http://TU_IP_LOCAL:3000/api

# Iniciar Expo
npx expo start
Escanea el QR con Expo Go desde tu dispositivo móvil.

📚 Documentación Detallada

Backend README - Instalación, endpoints, ejemplos de API
Frontend README - Configuración, estructura, diseño


🎨 Diseño
La aplicación utiliza un esquema de colores minimalista y moderno:

Negro (#000) - Fondo principal
Gris oscuro (#111) - Cards y componentes
Rojo (#FF0000) - Acciones principales y acentos
Blanco (#FFF) - Texto principal
Grises (#666, #999) - Texto secundario


🔄 Flujo de Usuario

Registro/Login → Autenticación con JWT
Explorar rutinas → Ver predefinidas o crear personalizadas
Iniciar entrenamiento → Seleccionar rutina
Registrar progreso → Peso y repeticiones por set
Ver historial → Estadísticas y progreso


🚧 Roadmap
Funcionalidades planeadas:

 Gráficas de progreso con peso/repeticiones
 Editar rutinas existentes
 Temporizador de descanso entre sets
 Fotos de progreso (antes/después)
 Compartir rutinas entre usuarios
 Modo oscuro/claro
 Notificaciones push
 Deploy a producción


🤝 Contribuciones
Este es un proyecto personal para portafolio. Si encuentras algún bug o tienes sugerencias, siéntete libre de abrir un issue.

📄 Licencia
MIT License - ver LICENSE para más detalles.

👨‍💻 Autor
SaulVaz

GitHub: SaulVaz
LinkedIn: www.linkedin.com/in/saul-vazquez-del-rio
Portfolio: 


🙏 Agradecimientos
Proyecto desarrollado como parte de mi portafolio de desarrollo full-stack, demostrando habilidades en:

Arquitectura de aplicaciones full-stack
Diseño de APIs REST
Desarrollo móvil multiplataforma
Bases de datos relacionales
Autenticación y seguridad
UI/UX moderno y funcional


⭐ Si este proyecto te resultó útil o interesante, considera darle una estrella en GitHub.
