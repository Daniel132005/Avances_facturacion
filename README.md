# 🚀 DevLog - Bitácora Diaria de Avances

Un modelo de blog moderno, visualmente atractivo y minimalista para documentar día a día el progreso de tus proyectos con capturas de pantalla, tareas logradas y notas técnicas.

---

## 📁 Estructura del Proyecto

```text
blog-avances/
├── index.html            # Interfaz web principal
├── styles.css            # Estilos modernos con soporte Modo Oscuro/Claro y Glassmorphism
├── app.js                # Lógica dinámica, filtros, buscador, visor Lightbox y asistente
├── data/
│   └── posts.json        # Base de datos ligera con las entradas de cada día
├── assets/
│   └── uploads/          # Carpeta para colocar tus capturas de pantalla
└── README.md             # Guía de uso y despliegue
```

---

## 📸 ¿Cómo agregar un nuevo avance del día?

Tienes **3 formas súper sencillas**:

### Opción 1: Usando el Asistente en la Web (Recomendada)
1. Abre `index.html` en tu navegador (o con Live Server / `npx serve`).
2. Haz clic en el botón superior **"+ Nuevo Avance"**.
3. Llena el formulario con el título, tareas del día y la ruta de tus capturas (por ejemplo `assets/uploads/dia3.png`).
4. Haz clic en **"Descargar posts.json"** y reemplaza el archivo en la carpeta `data/` (o copia el JSON generado).

### Opción 2: Editando directamente `data/posts.json`
Abre `data/posts.json` en tu editor y agrega tu nuevo día en la parte superior:

```json
{
  "id": "dia-3",
  "date": "2026-09-22",
  "dayNumber": 3,
  "title": "Integración de Pasarela de Pagos y Facturación",
  "category": "Backend / Finanzas",
  "tags": ["Facturacion", "Stripe", "API"],
  "summary": "Configuración de webhooks y emisión de facturas electrónicas.",
  "highlights": [
    "Conexión con el endpoint de facturación",
    "Generación automática de PDF",
    "Validación de montos e impuestos"
  ],
  "screenshots": [
    {
      "url": "assets/uploads/factura-preview.png",
      "caption": "Generación de factura de prueba con éxito"
    }
  ],
  "author": "Daniel"
}
```

---

## 🌐 ¿Cómo subir este proyecto a GitHub?

Sigue estos pasos en tu terminal dentro de la carpeta `blog-avances`:

### 1. Crear repositorio en GitHub
Ve a [github.com/new](https://github.com/new) y crea un nuevo repositorio (ejemplo: `blog-avances` o `bitacora-proyecto`).

### 2. Conectar y subir tu código
Abre tu terminal en la carpeta y ejecuta:

```bash
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git branch -M main
git push -u origin main
```

---

## 🚀 Publicar Gratis en GitHub Pages (1 Clic)

Para que tu blog esté en línea y accesible desde cualquier dispositivo:
1. En tu repositorio de GitHub, entra a **Settings** (Configuración) > **Pages**.
2. En **Build and deployment > Source**, selecciona **Deploy from a branch**.
3. En **Branch**, selecciona `main` y carpeta `/(root)`.
4. Haz clic en **Save**. En 1 minuto tendrás tu enlace público tipo:
   `https://tu-usuario.github.io/tu-repositorio/`

---

## 💡 Consejos para las capturas de pantalla
- Guarda las imágenes en la carpeta `assets/uploads/` con nombres ordenados como `dia1-1.png`, `dia2-login.png`.
- Al hacer clic en cualquier captura dentro del blog, se abrirá el **Visor en Pantalla Completa (Lightbox)** para verla en alta resolución con soporte para teclas de flechas y escape.
