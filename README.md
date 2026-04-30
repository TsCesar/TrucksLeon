# TrucksLeón International — Web Corporativa Premium

Página web pública corporativa para **TrucksLeón International**, empresa especializada en la gestión integral de vehículos industriales en el mercado europeo.

> Este proyecto es una **web pública**. No incluye login, dashboard, área privada, carrito, ecommerce ni panel de administración. El objetivo es captar clientes, presentar los servicios y facilitar el contacto.

---

## Stack

| Tecnología | Versión | Uso |
|---|---|---|
| [Next.js](https://nextjs.org) | 15 (App Router) | Framework principal |
| [TypeScript](https://typescriptlang.org) | 5 | Tipado estático |
| [Tailwind CSS](https://tailwindcss.com) | 3 | Estilos |
| [next-intl](https://next-intl-docs.vercel.app) | 3 | Internacionalización (i18n) |
| [Motion](https://motion.dev) | 11 | Animaciones |
| [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) | — | Validación de formulario |
| [Resend](https://resend.com) | 4 | Envío de emails |

---

## Instalación

Requiere Node.js 18 o superior.

```bash
# Instalar Node.js (si no está instalado):
winget install OpenJS.NodeJS.LTS

# Clonar el repositorio y entrar a la carpeta:
cd trucksleon-premium

# Instalar dependencias:
npm install
```

---

## Variables de entorno

Copia `.env.example` a `.env.local` y rellena los valores:

```bash
cp .env.example .env.local
```

| Variable | Descripción |
|---|---|
| `RESEND_API_KEY` | Clave API de Resend para envío de emails |
| `CONTACT_TO_EMAIL` | Dirección de destino de los mensajes del formulario |
| `CONTACT_FROM_EMAIL` | Dirección de envío (debe estar verificada en Resend) |

Si `RESEND_API_KEY` no está configurada, el formulario funciona igualmente pero en lugar de enviar el email lo imprime en la consola. Esto permite trabajar en local sin configurar Resend.

---

## Comandos

```bash
# Desarrollo local con hot reload:
npm run dev

# Compilar para producción:
npm run build

# Iniciar servidor de producción (requiere build previo):
npm run start

# Revisar errores de código:
npm run lint
```

La aplicación en desarrollo está disponible en `http://localhost:3000`.

---

## Multidioma (i18n)

La web soporta 5 idiomas con prefijo de locale obligatorio en la URL:

| Idioma | URL base |
|---|---|
| Español | `/es` |
| Inglés | `/en` |
| Neerlandés | `/nl` |
| Alemán | `/de` |
| Francés | `/fr` |

Las traducciones están en `src/messages/{locale}.json`. Todo el texto visible de la web está en esos archivos — no hay texto hardcodeado en los componentes.

El idioma por defecto es `es`. La redirección desde `/` a `/es` la gestiona el middleware de next-intl en `middleware.ts` (en la raíz del proyecto).

---

## Formulario de contacto

El formulario de la página `/contacto` envía un POST a `/api/contact` con los siguientes campos:

| Campo | Tipo | Descripción |
|---|---|---|
| `name` | string | Nombre completo |
| `email` | string | Email de contacto |
| `phone` | string | Teléfono |
| `company` | string (opcional) | Empresa |
| `message` | string | Mensaje |
| `consent` | boolean | Aceptación de la política de privacidad |
| `locale` | string | Idioma desde el que se contacta |
| `honeypot` | string (oculto) | Campo anti-spam, debe estar vacío |

Medidas de seguridad activas:
- Validación en cliente con Zod y React Hook Form
- Validación en servidor con Zod antes de procesar nada
- Campo honeypot oculto (los bots lo rellenan, los usuarios reales no)
- Rate limiting por IP: máximo 5 peticiones por minuto
- Los emails se envían desde el servidor (nunca desde el navegador)
- Las claves API no se exponen al cliente

El email que recibe la empresa incluye: nombre, email, teléfono, empresa, idioma, mensaje, fecha y origen.

---

## Rutas disponibles

```
/es                    — Home
/es/quienes-somos      — Quiénes Somos
/es/servicios          — Servicios
/es/vehiculos          — Vehículos (catálogo en FASE 2)
/es/vehiculos-entregados — Vehículos entregados
/es/proceso            — Proceso de trabajo
/es/europa             — Presencia europea
/es/novedades          — Novedades (contenido en FASE 2)
/es/contacto           — Contacto
/api/contact           — POST endpoint del formulario
```

Las mismas rutas están disponibles para `/en`, `/nl`, `/de` y `/fr`.

---

## Hosting y dominio

Esta web está diseñada para publicarse en un dominio real. Es compatible con cualquier hosting que soporte Node.js:

- **Vercel** (recomendado para Next.js — despliegue automático desde GitHub)
- **Servidor VPS** con Node.js y PM2
- **Servidor dedicado** con Ubuntu + Nginx como proxy inverso
- Cualquier plataforma compatible con aplicaciones Node.js

Para Vercel:
1. Conectar el repositorio de GitHub
2. Configurar las variables de entorno en el panel de Vercel
3. Despliegue automático en cada push a `main`

El dominio final será `trucksleon.com` o similar. Durante el desarrollo local, la web corre en `http://localhost:3000`.

---

## Imágenes y assets

```
public/
  images/
    brand/
      logo-trucksleon.png       — Logo oficial (descargado de trucksleon.com)
      logo-trucksleon-alt.png   — Logo alternativo
    hero/
      hero-truck-main.png       — Imagen de fondo del hero
    delivered/
      delivered-01.png ... delivered-08.png — Vehículos entregados
```

Todas las imágenes usan el componente `next/image` para optimización automática.

---

## FASE 2 — Pendiente

Lo que queda para la siguiente fase:

- [ ] Hero cinematográfico con vídeo de fondo (componente `VideoBackground` ya preparado)
- [ ] Catálogo de vehículos con filtros por categoría, marca y precio
- [ ] Sección de novedades con CMS o Markdown
- [ ] Página "Quiénes Somos" completa con fotos del equipo
- [ ] Mapa interactivo de presencia europea
- [ ] Integración de Google Analytics o Plausible
- [ ] Páginas de política de privacidad y aviso legal
- [ ] Optimización de Core Web Vitals y Lighthouse
- [ ] Rate limiting con Redis/Upstash para producción real
- [ ] Ajuste fino de la CSP según proveedor de hosting y analytics
- [ ] Posible traducción de slugs de URL por idioma
