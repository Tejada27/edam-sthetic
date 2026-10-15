# 🌸 Respaldo de Diseño y Paleta de Colores - Versión 1 (Rosa Nude & Dorado)
**Proyecto:** Edam sthetic (Cosmiatría & Cuidado de la Piel)  
**Fecha de Respaldo:** 12 de Octubre, 2026

Este documento contiene la especificación completa del diseño, tipografías, códigos hexadecimales y clases de Tailwind CSS utilizados en la primera propuesta visual de Edam sthetic, guardado como referencia y repuesto por si se desea alternar o reutilizar este estilo en el futuro.

---

## 🎨 1. Paleta de Colores (Estilo Soft Rose & Warm Gold)

### Fondos Principales (Cremas y Marfil)
* **Fondo Principal de la Aplicación:** `#FDFBF7` (`bg-[#FDFBF7]`)
* **Fondo Secundario / Secciones Alternas:** `#FAF7F2` (`bg-[#FAF7F2]`)
* **Blanco Puro para Tarjetas:** `#FFFFFF` (`bg-white`)
* **Bordes Sutiles:** `#E7E5E4` / `#E5E7EB` (`border-stone-200/80`)

### Acentos Rosa Empolvado / Nude Blush (Femenino, Delicado)
* **Rosa Principal (Botones, Destacados):** `#E11D48` (`text-rose-600`, `bg-rose-600`)
* **Rosa Oscuro (Textos principales en títulos):** `#BE123C` (`text-rose-700`)
* **Rosa Muy Suave (Fondos de tarjetas y etiquetas):** `#FFF1F2` (`bg-rose-50`, `border-rose-200`)
* **Rosa Resalte (Bordes y selecciones):** `#FECDD3` (`border-rose-300`, `selection:bg-rose-200`)
* **Rosa Profundo (Textos en alertas):** `#881337` (`text-rose-900`)

### Acentos Dorados y Ámbar (Lujo & Calidez)
* **Dorado Suave / Champagne (Detalles de iconos):** `#FDE68A` (`text-amber-200`, `text-amber-300`)
* **Ámbar Cálido (Etiquetas de advertencia / preparación):** `#D97706` (`text-amber-600`)
* **Ámbar Profundo (Textos de confianza):** `#92400E` (`text-amber-800`)
* **Fondo Dorado Claro:** `#FFFBEB` (`bg-amber-50`, `border-amber-200/60`)

### Textos y Contraste Neutro
* **Títulos y Textos Principales:** `#1C1917` (`text-stone-900`)
* **Textos Secundarios:** `#44403C` (`text-stone-700`)
* **Párrafos descriptivos:** `#78716C` (`text-stone-500` / `text-stone-600`)
* **Botones Oscuros de Lujo:** `#1C1917` (`bg-stone-900`, `hover:bg-black`) con texto en `#FFFBEB` (`text-amber-50`)

---

## 🖋️ 2. Tipografía y Estilos Visuales
* **Tipografía de Títulos (Serif Elegante):** `'Playfair Display', Georgia, serif`
  * Otorga sensación de editorial de alta gama, spa boutique y sofisticación.
* **Tipografía de Contenido y Botones (Sans-serif Limpia):** `'Plus Jakarta Sans', system-ui, sans-serif`
  * Legibilidad clínica y moderna, óptima para lectura en móviles.

---

## 📐 3. Componentes y Distribución
1. **Navbar:**
   - Logotipo circular con gradiente `from-rose-200 via-rose-100 to-amber-100`.
   - Botón de reserva en tono piedra oscuro y texto ámbar suave.
   - Pestaña para alternar con la Agenda de la Especialista.
2. **Hero:**
   - Título principal con combinación de serifa clásica e itálica rosa empolvada: *"La armonía y el brillo que tu piel merece"*.
   - Marco de fotografía flotante con degradado de fondo en `from-rose-200/50 to-amber-100/50`.
3. **Sobre Mí:**
   - Tarjetas de bioseguridad y cosmecéutica con iconos en `bg-rose-50` y `bg-amber-50`.
4. **Catálogo de Servicios:**
   - Filtros de categorías tipo cápsula (`rounded-full`).
   - Tarjetas con etiqueta de tiempo en ámbar y precios destacados.
   - Botón interactivo "Ver Cuidados" con modal de recomendaciones previas y post-tratamiento.
5. **Recomendaciones Previas:**
   - 4 pilares: Suspender ácidos, cero sol 48h, rostro limpio e hidratación previa.
6. **Modal de Reserva (5 pasos):**
   - Tratamiento -> Horario en bloques -> Ficha técnica -> Pago por transferencia -> Confirmación.
7. **Agenda:**
   - Vista para la especialista con control de estados, visor de comprobantes y fichas clínicas editables.

---
*Fin del respaldo de la Versión 1.*
