# 🏋️ GymApp Backend

API REST para aplicación de gestión de rutinas de gimnasio construida con Node.js, Express, PostgreSQL y Prisma ORM.

## 🚀 Tecnologías

- **Node.js** v22+
- **Express** - Framework web
- **PostgreSQL** - Base de datos relacional
- **Prisma** v5 - ORM
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas

## 📋 Características

- ✅ Autenticación JWT con roles (USER/ADMIN)
- ✅ CRUD completo de rutinas de entrenamiento
- ✅ Gestión de ejercicios por grupos musculares
- ✅ Sistema de favoritos
- ✅ Registro de sesiones de entrenamiento con sets detallados
- ✅ Historial completo de entrenamientos

## 🗄️ Modelo de Base de Datos

La base de datos consta de 8 tablas relacionales:

- `users` - Usuarios con autenticación y datos físicos
- `muscle_groups` - Catálogo de grupos musculares
- `exercises` - Catálogo global de ejercicios
- `routines` - Rutinas predefinidas y personalizadas
- `routine_exercises` - Ejercicios dentro de cada rutina
- `workout_sessions` - Historial de entrenamientos
- `workout_sets` - Registro detallado de cada serie
- `favorite_routines` - Relación usuarios-rutinas favoritas

## 📡 Endpoints Principales

### AutenticaciónPOST /api/auth/register - Registrar usuario
POST /api/auth/login    - Iniciar sesión

### UsuariosGET  /api/users/profile - Obtener perfil (requiere auth)
PUT  /api/users/profile - Actualizar perfil (requiere auth)

### EjerciciosGET  /api/exercises                - Listar ejercicios
GET  /api/exercises/muscle-groups  - Listar grupos musculares
POST /api/exercises                - Crear ejercicio (solo admin)

### RutinasGET    /api/routines           - Listar rutinas
GET    /api/routines/:id       - Ver detalle de rutina
POST   /api/routines           - Crear rutina personalizada
DELETE /api/routines/:id       - Eliminar rutina
POST   /api/routines/:id/favorite - Agregar/quitar favorito

### Sesiones de EntrenamientoGET   /api/sessions          - Historial de entrenamientos
POST  /api/sessions          - Iniciar sesión de entrenamiento
POST  /api/sessions/:id/sets - Registrar set
PATCH /api/sessions/:id/finish - Finalizar entrenamiento

## 🛠️ Instalación

### Requisitos Previos
- Node.js v20.19 o superior
- PostgreSQL instalado y corriendo

### Paso 1: Clonar repositorio
```bashgit clone https://github.com/SaulVaz/Aplicacion-Movil-GymApp.git
cd Aplicacion-Movil-GymApp/backend

### Paso 2: Instalar dependencias
```bashnpm install

### Paso 3: Configurar variables de entorno

Crea un archivo `.env` en la raíz con:

```envDATABASE_URL="postgresql://usuario:contraseña@localhost:5432/gymapp_db"
PORT=3000
JWT_SECRET="tu_clave_secreta_super_segura"
JWT_EXPIRES_IN="7d"

### Paso 4: Crear base de datos

```bashCrear base de datos en PostgreSQL
psql -U postgres
CREATE DATABASE gymapp_db;
\q

### Paso 5: Sincronizar esquema y datos iniciales

```bashSincronizar schema con Prisma
npx prisma db pushCargar datos de prueba (opcional)
node prisma/seed.js

### Paso 6: Iniciar servidor

```bashModo desarrollo
npm run devModo producción
npm start

El servidor estará corriendo en `http://localhost:3000`

## 📝 Scripts Disponibles

```bashnpm run dev      # Iniciar en modo desarrollo (nodemon)
npm start        # Iniciar en modo producción
npm run db:push  # Sincronizar schema de Prisma
npm run db:studio # Abrir Prisma Studio

## 🔐 Autenticación

Todos los endpoints (excepto `/auth/register` y `/auth/login`) requieren autenticación mediante JWT.

### Ejemplo de uso:

```javascript// Login
POST /api/auth/login
Content-Type: application/json{
"email": "usuario@ejemplo.com",
"password": "contraseña123"
}// Respuesta
{
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"id": 1,
"name": "Usuario",
"email": "usuario@ejemplo.com",
"role": "USER"
}
}// Usar token en requests posteriores
GET /api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

## 🏗️ Estructura del Proyectobackend/
├── prisma/
│   ├── schema.prisma      # Modelo de datos
│   └── seed.js            # Datos iniciales
├── src/
│   ├── controllers/       # Lógica de negocio
│   ├── middleware/        # Autenticación y validaciones
│   ├── routes/            # Definición de rutas
│   ├── prisma/
│   │   └── client.js      # Cliente Prisma
│   └── index.js           # Punto de entrada
├── .env                   # Variables de entorno (no incluido)
├── .env.example           # Ejemplo de configuración
└── package.json

## 👥 Roles de Usuario

- **USER**: Puede crear rutinas personalizadas, iniciar entrenamientos y gestionar favoritos
- **ADMIN**: Además de lo anterior, puede crear ejercicios globales y rutinas predefinidas

## 🧪 Datos de Prueba

El archivo `seed.js` incluye:
- 3 rutinas predefinidas (Espalda y Bíceps, Pecho y Tríceps, Día de Piernas)
- 19 ejercicios distribuidos en 9 grupos musculares
- 1 usuario de prueba

## 📄 Licencia

MIT

## 👨‍💻 Autor

Saul Vazquez del Rio - [GitHub](https://github.com/SaulVaz)

## 🔗 Enlaces

- [Frontend Repository](../frontend)
- [Repositorio Principal](https://github.com/SaulVaz/Aplicacion-Movil-GymApp)