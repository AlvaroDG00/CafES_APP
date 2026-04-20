# ☕ CafES App - Gestión Digital de Cafetería (Frontend)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Airtable](https://img.shields.io/badge/Airtable-18BFFF?style=for-the-badge&logo=Airtable&logoColor=white)

¡Bienvenido al repositorio Frontend de **CafES App**! Este proyecto nace con el objetivo de digitalizar y agilizar los procesos de pedido y gestión en las cafeterías escolares.

---

## 🚀 Sobre el Proyecto

Esta aplicación es el resultado de nuestro **Proyecto Final de Grado en DAM (Desarrollo de Aplicaciones Multiplataforma)**. 

El sistema permite al alumnado y al personal docente realizar pedidos de forma remota. Esto resuelve un problema logístico real: reduce drásticamente las colas durante los recreos y optimiza el flujo de trabajo del personal de la cafetería, mejorando la experiencia de toda la comunidad educativa.

## ✨ Características Principales

* **📱 Interfaz Mobile-First:** Experiencia de usuario diseñada específicamente para ser utilizada de forma cómoda y rápida desde smartphones.
* **🔄 Gestión de Pedidos en Tiempo Real:** Comunicación fluida y sin latencia entre el cliente (estudiantes/profesores) y el servidor (cafetería).
* **💳 Pasarela de Pago Integrada:** Sistema de pago seguro con tarjeta visual interactiva para tramitar los pedidos sin necesidad de efectivo.
* **⚙️ Panel de Administración y Cocina:** Interfaz dedicada para que el personal de la cafetería pueda visualizar, aceptar, preparar y finalizar los pedidos entrantes.
* **🎨 Diseño Moderno:** Estética limpia, accesible y profesional construida íntegramente con TailwindCSS y Lucide React.

---

## 🛠️ Stack Tecnológico (Frontend)

* **Core:** React.js con Vite y TypeScript.
* **Estilos:** TailwindCSS (para un diseño ágil y completamente responsive).
* **Enrutamiento:** React Router DOM.
* **Peticiones HTTP:** Axios (conectado a una API REST propia en Node.js).
* **Base de Datos (Vía API):** Airtable.

---

## ⚙️ Instalación y Uso Local

Si deseas probar el proyecto en tu entorno local, sigue estos pasos:

1. **Clona el repositorio:**
   ```bash
   git clone [https://github.com/AlvaroDG00/CafES_APP.git](https://github.com/AlvaroDG00/CafES_APP.git)
   cd CafES_APP

2. **Instala las dependencias:**
   Al ejecutar este comando, NPM leerá el archivo package.json y descargará automáticamente todas las librerías necesarias.
   ```bash
   npm install

4. **Configura las variables de entorno**
   Crea un archivo .env en la raíz de tu proyecto y añade la ruta de conexión al servidor Backend:
   ```bash
   VITE_API_URL=http://localhost:5000/api

6. **Inicia el servidor**
   ```bash
   npm run dev

##👨‍💻 Autores Originales
Proyecto Final de Grado - DAM

Este proyecto fue desarrollado inicialmente por:

AlvaroDG00

Ruthsangar

AriVazcor

Desarrollado en equipo como parte de nuestro portafolio profesional para demostrar habilidades en el desarrollo de interfaces modernas, experiencia de usuario (UX/UI) y consumo de APIs REST.
