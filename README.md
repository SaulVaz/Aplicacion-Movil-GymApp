<div align="center">
🏋️ GymApp - Full Stack
### Aplicación completa de gestión de rutinas de gimnasio

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)
[![React Native](https://img.shields.io/badge/react--native-0.81.5-61dafb)](https://reactnative.dev)
[![PostgreSQL](https://img.shields.io/badge/postgresql-15+-316192)](https://www.postgresql.org)

[Características](#-características) • [Tecnologías](#-tecnologías) • [Instalación](#-quick-start) • [Documentación](#-documentación-detallada)

</div>

---

## 📸 Preview

<div align="center">
  <img src="https://github.com/user-attachments/assets/13df9b35-11bf-4efd-84ca-e29d5a2d7c3c" alt="Welcome Screen" width="200"/>
  <img src="https://github.com/user-attachments/assets/e4b15e93-3293-48ce-850e-bac0effd933a" alt="Login Screen" width="200"/>
  <img src="https://github.com/user-attachments/assets/d088b654-9714-4785-9365-110f7288aad8" alt="Routines Screen" width="200"/>
  <img src="https://github.com/user-attachments/assets/d3cd0928-f0f5-4616-8d3c-b60f137866da" alt="Exercises Screen" width="200"/>
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/525e2027-a63f-4e8b-bd56-ae596ed466c7" alt="Profile Screen" width="200"/>
</div>

---

📁 Estructura del Proyecto

```
gym-app/
├── backend/          # 🔧 API REST - Node.js + Express + PostgreSQL + Prisma
├── frontend/         # 📱 App móvil - React Native + Expo
└── README.md         # 📖 Este archivo
```

| Directorio | Descripción | Tecnologías |
|------------|-------------|-------------|
| **[backend/](./backend)** | API REST con autenticación JWT | Node.js, Express, PostgreSQL, Prisma |
| **[frontend/](./frontend)** | App móvil multiplataforma | React Native, Expo, React Navigation |

---

## 🚀 Tecnologías

<table>
<tr>
<td width="50%" valign="top">

### Backend
- **Runtime:** Node.js v20+
- **Framework:** Express
- **Base de datos:** PostgreSQL
- **ORM:** Prisma v5
- **Autenticación:** JWT + bcryptjs
- **Validación:** Express middleware

</td>
<td width="50%" valign="top">

### Frontend
- **Framework:** React Native
- **SDK:** Expo
- **Navegación:** React Navigation
- **HTTP Client:** Axios
- **Storage:** AsyncStorage
- **Iconos:** Ionicons

</td>
</tr>
</table>

---

## ✨ Características

<details>
<summary><b>🔐 Backend API (20+ endpoints)</b></summary>

- ✅ Autenticación JWT con roles (USER/ADMIN)
- ✅ CRUD completo de rutinas de entrenamiento
- ✅ Gestión de ejercicios por grupos musculares
- ✅ Sistema de favoritos
- ✅ Registro de sesiones con sets detallados
- ✅ Historial completo de entrenamientos
- ✅ Validaciones y manejo de errores

</details>

<details>
<summary><b>📱 Frontend Mobile</b></summary>

- ✅ Diseño minimalista (negro/blanco/rojo)
- ✅ Autenticación persistente con AsyncStorage
- ✅ Rutinas predefinidas y personalizadas
- ✅ Catálogo de 19 ejercicios con filtros
- ✅ Creación de rutinas con configuración de sets/reps
- ✅ Entrenamiento en tiempo real con registro de peso
- ✅ Historial de progreso con estadísticas
- ✅ Perfil de usuario personalizable

</details>

---

## 🗄️ Modelo de Base de Datos

El sistema utiliza **8 tablas relacionales** en PostgreSQL:

```
users (autenticación y datos físicos)
  ├─ routines (rutinas personalizadas)
  │   └─ routine_exercises (ejercicios con sets/reps)
  │       └─ exercises (catálogo global)
  │           └─ muscle_groups (grupos musculares)
  ├─ workout_sessions (historial)
  │   └─ workout_sets (sets individuales)
  └─ favorite_routines (favoritos)
```

---

## ⚡ Quick Start

### Requisitos Previos

```bash
Node.js >= 20.19
PostgreSQL >= 15
Expo Go (app móvil para iOS/Android)
```

### 1️⃣ Clonar repositorio

```bash
git clone https://github.com/TU-USUARIO/gym-app.git
cd gym-app
```

### 2️⃣ Backend Setup

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# Crear base de datos
psql -U postgres -c "CREATE DATABASE gymapp_db;"

# Sincronizar schema
npx prisma db push

# (Opcional) Cargar datos de prueba
node prisma/seed.js

# Iniciar servidor
npm run dev
```

✅ Backend corriendo en `http://localhost:3000`

### 3️⃣ Frontend Setup

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar URL del backend en src/services/api.js
# Para emulador Android: http://10.0.2.2:3000/api
# Para dispositivo físico: http://TU_IP_LOCAL:3000/api

# Iniciar Expo
npx expo start
```

📱 Escanea el QR con **Expo Go** desde tu dispositivo móvil

---

## 📚 Documentación Detallada

| Documentación | Descripción |
|---------------|-------------|
| **[Backend README](./backend/README.md)** | Instalación, endpoints, autenticación, ejemplos |
| **[Frontend README](./frontend/README.md)** | Configuración, estructura, componentes, diseño |

---

## 🎨 Paleta de Colores

```css
--negro:        #000000  /* Fondo principal */
--gris-oscuro:  #111111  /* Cards y componentes */
--rojo:         #FF0000  /* Acciones principales */
--blanco:       #FFFFFF  /* Texto principal */
--gris-medio:   #666666  /* Iconos inactivos */
--gris-claro:   #999999  /* Texto secundario */
```

---

## 🔄 Flujo de Usuario

```mermaid
graph LR
    A[Registro/Login] --> B[Dashboard]
    B --> C[Ver Rutinas]
    C --> D[Crear Rutina]
    C --> E[Iniciar Entrenamiento]
    E --> F[Registrar Sets]
    F --> G[Finalizar]
    G --> H[Ver Historial]
```

1. **Autenticación** → Registro o login con JWT
2. **Explorar** → Ver rutinas predefinidas o crear personalizadas
3. **Entrenar** → Seleccionar rutina e iniciar sesión
4. **Registrar** → Peso y repeticiones por cada set
5. **Progreso** → Ver historial y estadísticas

---

## 📡 Endpoints Principales

<details>
<summary><b>Ver lista completa de endpoints</b></summary>

### Autenticación
```http
POST /api/auth/register
POST /api/auth/login
```

### Usuarios
```http
GET  /api/users/profile
PUT  /api/users/profile
```

### Ejercicios
```http
GET  /api/exercises
GET  /api/exercises/muscle-groups
POST /api/exercises (admin)
```

### Rutinas
```http
GET    /api/routines
GET    /api/routines/:id
POST   /api/routines
DELETE /api/routines/:id
POST   /api/routines/:id/favorite
```

### Sesiones
```http
GET   /api/sessions
POST  /api/sessions
POST  /api/sessions/:id/sets
PATCH /api/sessions/:id/finish
```

</details>

---

## 🚧 Roadmap

- [ ] Gráficas de progreso (peso/reps a lo largo del tiempo)
- [ ] Edición de rutinas existentes
- [ ] Temporizador de descanso entre sets
- [ ] Fotos de progreso (antes/después)
- [ ] Compartir rutinas entre usuarios
- [ ] Modo claro/oscuro
- [ ] Notificaciones push
- [ ] Deploy a producción (Railway + Vercel)

---

## 🤝 Contribuciones

Este es un proyecto personal para portafolio. Si encuentras bugs o tienes sugerencias:

1. 🐛 Abre un [Issue](https://github.com/TU-USUARIO/gym-app/issues)
2. 🔧 Crea un Pull Request
3. ⭐ Dale una estrella al repo

---

## 📄 Licencia

[MIT License](./LICENSE) - Libre para usar, modificar y distribuir

---

## 👨‍💻 Autor

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-@Github-181717?style=for-the-badge&logo=github)](https://github.com/SaulVaz)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Linkedin-0077B5?style=for-the-badge&logo=linkedin)](www.linkedin.com/in/saul-vazquez-del-rio)
[![Portfolio](https://img.shields.io/badge/Portfolio-tu--portfolio.com-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white)](https://tu-portfolio.com)

</div>

---

## 🎯 Habilidades Demostradas

Este proyecto full-stack demuestra competencia en:

- ✅ Arquitectura de aplicaciones escalables
- ✅ Diseño e implementación de APIs REST
- ✅ Desarrollo móvil multiplataforma
- ✅ Modelado de bases de datos relacionales
- ✅ Autenticación y seguridad (JWT, bcrypt)
- ✅ UI/UX moderno y accesible
- ✅ Git workflow y versionado
- ✅ Documentación técnica completa

---

<div align="center">

### ⭐ Si este proyecto te pareció útil o interesante, considera darle una estrella

**Desarrollado con ❤️ para demostrar habilidades full-stack**

</div>
