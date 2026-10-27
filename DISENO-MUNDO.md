# Luna en Villa Pelón — diseño del mundo y sistemas

## Canon narrativo
Luna visita a sus abuelos durante las vacaciones escolares. Este año está más curiosa: pregunta, escucha, observa y registra la historia local. El juego se nombra **Luna en Villa Pelón**. Villa Pelón es el nombre que aparece en la experiencia narrativa.

## Mapa real como referencia, no como calco
La base de investigación cartográfica es la Mapoteca Digital de la Dirección Provincial de Catastro e Información Territorial de Neuquén, que ofrece un mapa específico de la localidad. También se consulta el plan territorial publicado por el Consejo Federal de Inversiones. La cartografía de Mapoteca indica restricciones de reproducción: este videojuego usa un mapa esquemático original y no copia el plano oficial. Antes de afirmar que calles, picadas o estructuras coinciden exactamente con el terreno, se debe georreferenciar con una fuente cuyo uso lo permita y comprobarla con conocimiento local.

Fuentes:
- Mapoteca Digital provincial: https://dpc.neuquen.gob.ar/Mapa
- Índice de mapas de localidades (incluye San Patricio del Chañar): https://dpc.neuquen.gov.ar/dpcasp/mapoteca_digital/localidades.asp
- Plan territorial CFI: https://www.argentina.gob.ar/sites/default/files/plan_de_ordenamiento_territorial_y_ambiental_para_las_localidades_des_anelo_san_patricio_del_chanar_y_sauzal_bonito_0.pdf
- Información municipal sobre lugares y chacra municipal: https://sanpatricio.gob.ar/nuestra

## Leyes del mundo
- **Urbano:** calles, autos, fachadas, plazas y actividad humana; no plantar hileras de frutales en las veredas por defecto.
- **Rural productivo:** parcelas, cultivos, canales, acequias, cercos, caminos de servicio y labores.
- **Bardas:** relieve rocoso, suelo árido, vegetación escasa y senderos.
- **Picada 21:** corredor de recorrido y conexión; su traza exacta queda pendiente de comprobación cartográfica.
- **Agua:** río → captación/bocatoma → canal → acequia/derivación → parcela. La dirección y la geometría exactas se ajustarán con documentación local.

## Sistemas incluidos en el prototipo
- Mundo de coordenadas grandes con cámara que sigue a Luna.
- Zonas y rótulos contextuales: ribera, pueblo, chacras, bardas y Picada 21.
- Personajes con horarios básicos (abuelo, Rosa y Tomás).
- Dos misiones con objetivos, progreso y recompensa.
- Diálogos y elecciones.
- Objetos, mochila e inventario.
- Reloj acelerado, día/noche, atardecer y clima variable (sol, nubes, viento, lluvia).
- Energía que baja lentamente al caminar y se recupera al pasar el día.
- Cuaderno de Luna con registro de misión, día, clima y objetos.
- Guardado local en el navegador.
- Teclado, botones táctiles y toque/clic sobre el mapa.
- Diseño adaptable para escritorio y teléfono.

## Arquitectura de archivos
- `index.html`: interfaz y paneles.
- `styles.css`: diseño visual responsive.
- `js/data.js`: datos editables del mundo, personajes, horarios, misiones y diálogos.
- `js/game.js`: motor, renderizado, movimiento, reloj, clima, interacciones, progreso y guardado.

## Límites conocidos de esta versión
Este es un prototipo con mapa original esquemático, no un mapa navegable de precisión geográfica. La meteorología es simulada, no un pronóstico. Los personajes y diálogos son ficción. No hay aún colisiones completas para cada edificio, autos animados, ciclo de cultivo real, interiores, audio, misiones ramificadas ni sistema de eventos históricos documentales dentro del juego. Esas capas se añaden después de validar el mapa y las fuentes.

## Principios de rigor
Etiquetar cada contenido de la base narrativa como REAL DOCUMENTADO, MEMORIA/TESTIMONIO, FICCIÓN o IMAGINAMOS. No presentar diálogos ficticios como testimonios históricos. No copiar cartografía protegida sin permiso. No inventar coordenadas o trazas exactas.
