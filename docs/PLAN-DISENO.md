# Plan de diseño — Pequeños Sueños

## Concepto: "la ventana en arco"
El logo vive bajo un arcoíris sobre una nube. Ese arco es el gesto de la marca y
se vuelve el sistema de layout: las fotos e ilustraciones de producto se enmarcan
en **ventanas con remate de arco** (como el arcoíris), las categorías son arcos de
colores y los bloques de la portada se separan con **bordes de nube** suaves.
Nada de tarjetas rectangulares genéricas ni degradados por defecto.

## Paleta (sacada del logo y del perfil de Instagram)
| Rol | Nombre | Hex | Uso |
|---|---|---|---|
| Fondo | Crema nube | `#FBF6EF` | Fondo general (el crema del logo) |
| Superficie | Papel | `#FFFDF9` | Tarjetas, formularios, panel |
| Texto | Cacao | `#4A3438` | Texto principal (el marrón del lema), 10.6:1 sobre crema |
| Acción | Rosa empolvado hondo | `#A8495A` | Botones y enlaces (5.6:1 con texto blanco) |
| Acento | Lila | `#E4D9F0` / `#6B5594` | Fondos suaves / texto de acento |
| Acento | Salvia | `#DDE6D5` / `#4F6447` | Confianza, "disponible" |
| Acento | Durazno | `#F8E2C4` | Anuncio, ofertas suaves |

Los tonos claros (rosa `#F3D9D6`, lila, salvia, durazno) solo van como fondo; el
texto siempre es cacao o un tono hondo con contraste ≥ 4.5:1.

## Tipografía (autohospedada con `next/font/local`)
- **Fraunces Soft** (variable, eje SOFT al máximo): títulos. Serifa redondeada,
  cálida, con personalidad editorial; evoca la "Sueños" caligráfica sin caer en
  una script ilegible.
- **Fraunces itálica**: palabras de acento dentro de los títulos ("también es *soñar*").
- **Nunito** (variable): texto, botones, formularios, panel y gráficas. Sus
  terminales redondas repiten las letras de "PEQUEÑOS" del logo.

## Layout
- Escritorio: retícula de 12 columnas, máximo 1240 px, mucho aire.
- Celular primero: menú en hoja inferior, barra de compra fija en la ficha, botón
  de WhatsApp que se corre hacia arriba cuando hay barra fija.
- Portada: anuncio → cabecera → héroe con arcoíris que se dibuja (único momento
  animado, desactivado con `prefers-reduced-motion`) → compra por edad (arcos) →
  recién llegados → banner bautizo → look → confianza → historias destacadas
  (Plan de pago, Soñadores, Quiénes somos) → seguimiento → suscripción.

## Principios
1. Tierna, no infantil: pastel solo en superficies, tipografía adulta y editorial.
2. El producto manda: ilustraciones/fotos grandes, texto corto.
3. Siempre un camino a WhatsApp (así compra hoy su clientela).
4. Accesible por defecto: foco visible, 44 px, contraste AA.
5. Datos desconocidos se marcan `TODO(CLIENTE)`, nunca se inventan.

## Revisión contra el brief (opciones descartadas)
- Degradado arcoíris de fondo en el héroe: descartado por genérico; en su lugar,
  el arco del logo dibujado en trazo sobre crema plano.
- Fuente script para títulos: descartada, ilegible en celular y demasiado "infantil".
- Tarjeta rectangular con sombra para productos: descartada por verse a plantilla;
  se usa la ventana en arco sin sombra.

## Gráficas del panel (skill `dataviz`)
Paleta categórica de 3 (método de pago), validada con `validate_palette.js`
(`docs/validacion-paleta-graficas.txt`): rosa `#C8506A`, lila `#6B58C4`,
durazno tostado `#BD7F14`, sobre la superficie `#FFFDF9`. Series únicas usan el
rosa. Cada gráfica tiene leyenda (si hay 2+ series), tooltip y tabla alternativa.
El sitio es solo en modo claro (decisión de marca), por eso no hay variante oscura.
