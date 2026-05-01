# ☕ Café Roble — Web de Menú Digital

Sitio web de menú digital para **Café Roble**, con panel de administración integrado.

## 📁 Estructura del proyecto

```
cafe-roble/
├── index.html          ← Página principal (menú + info)
├── data/
│   └── menu-data.json  ← Datos del menú (fuente de verdad para git)
├── css/
│   └── styles.css      ← Estilos globales
├── js/
│   ├── app.js          ← Lógica principal (render, slider, lightbox)
│   └── admin.js        ← Panel de administración
├── README.md
└── .gitignore
```

## 🚀 Cómo usar

### Ver el sitio
Abre `index.html` en cualquier navegador. No requiere servidor.

### Administrar el contenido
1. En la web, presiona el botón **⚙ Administrar** (esquina inferior derecha)
2. Desde el panel puedes:
   - **Agregar / eliminar categorías** del menú
   - **Editar productos**: nombre, precio, descripción, badge, imagen
   - **Subir imágenes** directamente desde tu dispositivo
   - **Gestionar galería** de fotos por categoría
   - **Editar info del negocio**: nombre, dirección, horarios, contacto, promo
   - **Editar el banner** (logo, nombre, subtítulo)
3. Presiona **✔ Guardar y aplicar** para ver los cambios en vivo
4. Presiona **⬇ Exportar JSON** para descargar el archivo actualizado
5. Reemplaza `data/menu-data.json` con el archivo descargado y haz commit

## 🔄 Flujo de trabajo con Git

```bash
# 1. Clona el repositorio
git clone <url-del-repo>

# 2. Edita el contenido desde el panel de admin en el navegador

# 3. Exporta el JSON desde el panel y reemplaza data/menu-data.json

# 4. Sube los cambios
git add .
git commit -m "Actualizar menú: agregar nuevos productos"
git push
```

## 🌐 Deploy gratuito (recomendado)

- **GitHub Pages**: Activa en Settings → Pages → main branch
- **Netlify**: Arrastra la carpeta a netlify.com/drop
- **Vercel**: Importa el repo y despliega automáticamente

## 📝 Notas

- Los datos se guardan en `localStorage` al usar el admin (cambios visibles solo en ese navegador)
- Para persistir cambios para todos: exporta el JSON → reemplaza `data/menu-data.json` → haz commit
- Las imágenes subidas desde el admin se almacenan como base64 en el JSON (pueden hacer el archivo grande; preferir URLs externas para producción)
