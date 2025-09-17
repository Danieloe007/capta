# Business Dates API

API REST para calcular fechas hábiles en Colombia, teniendo en cuenta días festivos nacionales, horarios laborales y zona horaria local.

## 🚀 URL de Despliegue

**API en producción:** https://zedwzajfol.execute-api.us-east-2.amazonaws.com/prod/

## 📋 Descripción

Esta API calcula fechas hábiles considerando:
- **Días laborales**: Lunes a viernes
- **Horario laboral**: 8:00 AM - 5:00 PM (hora de Colombia)
- **Horario de almuerzo**: 12:00 PM - 1:00 PM
- **Festivos colombianos**: Consultados desde API externa
- **Zona horaria**: America/Bogota (conversión automática a UTC)

## 🛠️ Tecnologías

- **TypeScript** - Lenguaje principal
- **AWS CDK** - Infraestructura como código
- **AWS Lambda** - Función serverless
- **API Gateway** - REST API
- **Node.js 20.x** - Runtime
- **date-fns** - Manipulación de fechas
- **date-fns-tz** - Manejo de zonas horarias

## 📡 Uso de la API

### Endpoint
```
GET https://zedwzajfol.execute-api.us-east-2.amazonaws.com/prod/
```

### Parámetros (Query String)
- `days` (opcional): Número de días hábiles a sumar (entero positivo)
- `hours` (opcional): Número de horas hábiles a sumar (entero positivo)  
- `date` (opcional): Fecha inicial en UTC (ISO 8601 con Z). Si no se provee, usa la hora actual de Colombia

**Nota**: Al menos uno de `days` o `hours` debe ser proporcionado.

### Ejemplos de Uso

#### 1. Sumar días y horas
```bash
curl "https://zedwzajfol.execute-api.us-east-2.amazonaws.com/prod/?days=1&hours=2"
```
**Respuesta:**
```json
{"date":"2025-09-18T15:00:00.000Z"}
```

#### 2. Solo horas
```bash
curl "https://zedwzajfol.execute-api.us-east-2.amazonaws.com/prod/?hours=8"
```

#### 3. Con fecha específica
```bash
curl "https://zedwzajfol.execute-api.us-east-2.amazonaws.com/prod/?days=1&date=2025-01-17T22:00:00.000Z"
```

#### 4. Error - Sin parámetros
```bash
curl "https://zedwzajfol.execute-api.us-east-2.amazonaws.com/prod/"
```
**Respuesta:**
```json
{
  "error": "InvalidParameters",
  "message": "At least one of \"days\" or \"hours\" must be provided."
}
```

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │───▶│  AWS Lambda     │───▶│ External APIs   │
│                 │    │                 │    │ (Holidays)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📦 Instalación y Desarrollo Local

### Prerrequisitos
- Node.js 18+ 
- AWS CLI configurado
- AWS CDK CLI

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/business-dates-api.git
cd business-dates-api
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar pruebas locales
```bash
npx ts-node test-local.ts
```

### 4. Desplegar a AWS
```bash
# Bootstrap CDK (solo la primera vez)
npx cdk bootstrap

# Desplegar
npx cdk deploy
```

## 🧪 Pruebas

El proyecto incluye una suite completa de 25 pruebas que cubren:

- ✅ Todos los ejemplos de la especificación técnica
- ✅ Validación de parámetros y manejo de errores
- ✅ Casos límite (horarios extremos, festivos, fines de semana)
- ✅ Horario de almuerzo y transiciones de días
- ✅ Múltiples días/horas y combinaciones

```bash
# Ejecutar todas las pruebas
npx ts-node test-local.ts
```

## 📁 Estructura del Proyecto

```
business-dates-api/
├── bin/
│   └── business-dates-api.ts      # Punto de entrada CDK
├── lib/
│   └── business-dates-stack.ts    # Definición del stack CDK
├── src/
│   ├── handler.ts                 # Handler de Lambda
│   ├── services/
│   │   └── date.service.ts        # Lógica de cálculo de fechas
│   ├── utils/
│   │   └── holidays.ts            # Consulta de festivos
│   └── types/
│       └── index.ts               # Tipos TypeScript
├── test-local.ts                  # Suite de pruebas
├── package.json
├── tsconfig.json
├── cdk.json
└── README.md
```

## 🔧 Reglas de Negocio

### Horarios Laborales
- **Días**: Lunes a viernes
- **Horas**: 8:00 AM - 5:00 PM (Colombia)
- **Almuerzo**: 12:00 PM - 1:00 PM (no laboral)

### Ajustes Automáticos
- Si la fecha inicial está fuera del horario laboral, se ajusta al momento laboral más cercano hacia atrás
- Los fines de semana se saltan automáticamente
- Los festivos colombianos se excluyen del cálculo

### Zona Horaria
- **Cálculos internos**: America/Bogota
- **Respuesta**: UTC (ISO 8601 con Z)

## 🌐 Festivos Colombianos

Los festivos se consultan dinámicamente desde:
```
https://content.capta.co/Recruitment/WorkingDays.json
```

## 📊 Ejemplos de Casos de Uso

| Escenario | Input | Output Esperado |
|-----------|-------|-----------------|
| Viernes 5PM + 1 hora | `hours=1&date=2025-01-17T22:00:00Z` | Lunes 9:00 AM COL |
| Sábado + 1 hora | `hours=1&date=2025-01-18T19:00:00Z` | Lunes 9:00 AM COL |
| Martes 3PM + 1 día + 3 horas | `days=1&hours=3&date=2025-01-14T20:00:00Z` | Jueves 10:00 AM COL |
| 8 horas laborales | `hours=8&date=2025-01-13T13:00:00Z` | Mismo día 5:00 PM COL |

## 🚨 Códigos de Estado HTTP

- **200 OK**: Cálculo exitoso
- **400 Bad Request**: Parámetros inválidos o faltantes
- **503 Service Unavailable**: Error al consultar festivos

## 👨‍💻 Desarrollo

### Scripts Disponibles
```bash
# Pruebas locales
npm run test:local

# Compilar TypeScript
npm run build

# Desplegar
npm run deploy

# Destruir stack
npm run destroy
```

### Variables de Entorno
- `NODE_OPTIONS`: `--enable-source-maps` (para debugging)

## 📄 Licencia

MIT License

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

- **Autor**: [Tu Nombre]
- **Email**: [tu.email@ejemplo.com]
- **LinkedIn**: [Tu perfil de LinkedIn]

---

⭐ Si este proyecto te fue útil, ¡no olvides darle una estrella!