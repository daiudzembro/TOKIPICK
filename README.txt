
TOKIPICK 

Aplicación web de moda que compara precio, calidad y estilo entre
distintas marcas y arma outfits combinando lo que el usuario ya tiene
en su placard con prendas nuevas.

Está hecha solo con HTML, CSS y JavaScript (sin frameworks ni backend).



 OBJETIVO:

Ayudar a decidir qué comprar sin perder tiempo ni plata:

  - Mostrar prendas de varias marcas (Zara, Mango, Levis, Adidas,
    H&M, etc.) con precio, calidad, rating y un porcentaje de
    "match" con el placard del usuario.
  - Dejar elegir con un sistema de swipe (estilo Tinder): deslizar
    para guardar favoritos.
  - Comparar dos prendas lado a lado (precio, calidad y
    compatibilidad con el placard).
  - Armar outfits combinando top, bottom, calzado y accesorio.
  - Llevar un placard digital (agregar y eliminar prendas propias)
    y un carrito con simulación de compra.

 FORTALEZAS:

  - Cubre un recorrido completo de compra: descubrir (home y
    búsqueda), elegir (swipe), comparar, armar outfits, carrito y
    confirmación de compra.
  - Swipe con arrastre real: la tarjeta se mueve con el mouse o el
    dedo, no es solo un botón.
  - Persistencia de datos: carrito, favoritos, placard, compras y
    swipes del día se guardan en localStorage, así que no se pierden
    al recargar.
  - Placard editable: se pueden agregar prendas propias y
    eliminarlas después (las prendas de ejemplo no se borran).
  - Validación de formularios: login y registro controlan campos
    vacíos, formato de email, largo mínimo de contraseña y que ambas
    coincidan.
  - Diseño consistente y responsive: misma identidad visual en todas
    las pantallas, menú lateral que se convierte en menú desplegable
    en pantallas chicas, y mini carrito lateral accesible desde
    cualquier página.
  - Código ordenado y fácil de mantener: los datos de los productos
    están separados de la lógica (data.js / main.js) y un solo CSS
    sirve a toda la app.
  - Manejo de imágenes faltantes: si una foto no carga, se muestra
    un texto en su lugar en vez de romper la interfaz.
  - Precios en formato argentino (es-AR).
  - Página 404 propia para enlaces inexistentes.


 LIMITACIONES:

  - No hay backend ni base de datos real. Todo se guarda en el
    navegador (localStorage): los datos son locales a cada
    navegador y se pierden si se borra el almacenamiento.
  - El login y el registro son simulados. Solo validan que los
    campos estén completos y bien formados; no existen cuentas
    reales ni se verifica ninguna contraseña.
  - El catálogo es fijo: 14 productos cargados a mano en data.js.
    No se conecta con tiendas ni marcas reales.
  - La compra es una simulación: no hay pasarela de pago ni envío,
    y el botón "Complete purchase" solo registra la compra de forma
    local.
  - Los porcentajes de "match" y "quality" están escritos a mano
    para cada producto. No se calculan a partir del placard real
    del usuario.
  - El chat con Toki no usa inteligencia artificial: responde con
    frases predefinidas elegidas al azar.
  - Solo está en inglés (la opción "Language" del perfil no cambia
    nada).
  - Pensada principalmente para uso demostrativo, no para
    producción.


 DEBILIDADES:

  - Botones y enlaces sin funcionalidad: "Continue with Google",
    "Forgot your Password?" y las opciones del menú Settings
    (Privacy, Passwords, Payment methods, Returns, Language) son
    solo visuales.
  - El texto del pie de página dice "powered by AI", pero la app
    no usa IA, lo cual puede generar una expectativa incorrecta.
  - Sin seguridad real: al no haber servidor, no hay autenticación
    ni protección de datos. No debe usarse para guardar información
    personal.
  - Los datos no se sincronizan entre dispositivos: lo que se
    guarda en la computadora no aparece en el celular.
  - Faltan las fotos del placard (assets/closet/), por lo que esas
    prendas se ven como texto hasta que se agreguen.
  - Placard simple: al agregar una prenda solo se pide nombre y
    categoría, y no se pueden subir fotos ni se analiza color,
    talle o estilo.
  - Sin tests automáticos: no hay pruebas automatizadas que
    verifiquen el funcionamiento.
  - Accesibilidad sin auditar: no se revisó formalmente contraste,
    navegación por teclado ni compatibilidad con lectores de
    pantalla.
  - Un único archivo de JavaScript de más de 1000 líneas (main.js)
    concentra toda la lógica; a medida que la app crezca convendría
    dividirlo por pantalla.