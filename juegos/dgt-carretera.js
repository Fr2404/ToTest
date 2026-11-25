/* ToTest · Juego «Al volante con el Profe Cono»
   Tus respuestas conducen el coche: aciertas → maniobra correcta; fallas → temeridad y te salvas por los pelos;
   tercer fallo → siniestro total. */
(function(){
window.ToTestGames=window.ToTestGames||{};

/* ---------- Preguntas: la correcta siempre es o[0] (se barajan al mostrar) ---------- */
const QS=[
 {sc:"peatones",intro:"¡Paso de peatones a la vista! Y hay alguien esperando…",q:"Una persona espera para cruzar por el paso de peatones. ¿Qué haces?",
  o:["Detenerme y dejarle cruzar","Tocar el claxon para que espere","Acelerar y pasar antes de que baje"],
  ok:"¡Eso es! El peatón cruza tan feliz y tú no sales en las noticias.",ko:"Le has dado tal susto que acaba de batir el récord olímpico de salto hacia atrás.",
  rule:"En un paso de peatones señalizado, el peatón tiene prioridad: si está cruzando o a punto de hacerlo, debes detenerte y dejarle pasar."},
 {sc:"stop",intro:"Cruce con señal de STOP. No se ve a nadie… o eso parece.",q:"Llegas a un STOP y aparentemente no viene nadie. ¿Qué debes hacer?",
  o:["Detenerme por completo en la línea y después continuar","Reducir mucho y pasar si no viene nadie","Parar solo si veo que viene alguien"],
  ok:"Parada total. Y mira: sí que venía alguien. El STOP sabe cosas.",ko:"STOP no significa «Sigue Tranquilamente, Ojalá no Pase nada».",
  rule:"El STOP obliga a detenerse siempre por completo, venga o no venga nadie, y a ceder el paso a quien circula por la otra vía."},
 {sc:"semaforo",intro:"El semáforo cambia a ámbar… ¡decisión rápida!",q:"El semáforo se pone en ámbar fijo y puedes frenar con seguridad antes de la línea. ¿Qué haces?",
  o:["Detenerme","Acelerar para pasar antes de que se ponga en rojo","Seguir igual: el ámbar es como el verde"],
  ok:"Bien frenado. El ámbar no es un «verde con prisas».",ko:"Modo rally activado en pleno centro. El de la derecha casi se traga el volante.",
  rule:"El ámbar fijo obliga a detenerse, salvo que estés tan cerca que no puedas frenar con seguridad. Pasar en rojo es una infracción grave: 200 € y 4 puntos."},
 {sc:"glorieta",intro:"Glorieta a la vista. Ahí dentro hay coches dando vueltas…",q:"Vas a entrar en una glorieta. ¿Quién tiene prioridad?",
  o:["Los vehículos que ya circulan por dentro","Los que van a entrar","El que llegue primero"],
  ok:"Cedes, esperas tu hueco y entras. Elegancia sobre ruedas.",ko:"Has entrado como si la glorieta fuera tuya. El de dentro te ha dedicado un concierto de claxon.",
  rule:"En las glorietas, salvo señal que diga otra cosa, tienen preferencia los vehículos que ya circulan dentro: quien entra cede el paso."},
 {sc:"velocidad",lim:30,intro:"Entras en la ciudad: calle con un solo carril por sentido.",q:"Calle urbana con un único carril por sentido. ¿Cuál es la velocidad máxima genérica?",
  o:["30 km/h","50 km/h","40 km/h"],
  ok:"30 clavados. El radar te ha mirado y se ha aburrido.",ko:"¡FLASH! Sales tan bien en la foto que te la mandan a casa… con la multa.",
  rule:"Desde 2021: 20 km/h en calles de plataforma única (acera y calzada al mismo nivel), 30 km/h con un carril por sentido y 50 km/h con dos o más."},
 {sc:"velocidad",lim:90,intro:"Sales a una carretera convencional.",q:"¿Cuál es la velocidad máxima genérica de un turismo en carretera convencional?",
  o:["90 km/h","100 km/h","110 km/h"],
  ok:"90 y a disfrutar del paisaje.",ko:"¡FLASH! Has salido en más fotos que en tu graduación.",
  rule:"Desde 2019, el límite genérico para turismos y motos en carretera convencional es 90 km/h."},
 {sc:"velocidad",lim:120,intro:"Entras en la autovía.",q:"¿Cuál es la velocidad máxima de un turismo en autopista o autovía?",
  o:["120 km/h","130 km/h","140 km/h"],
  ok:"120, ni uno más. Viaje rápido y sin sustos.",ko:"¡FLASH! Ibas tan rápido que el radar ha pedido una segunda opinión.",
  rule:"En autopistas y autovías, turismos y motos pueden ir como máximo a 120 km/h, salvo que una señal indique otra cosa."},
 {sc:"adelantar",intro:"Un camión lento delante… y la línea del centro es continua.",q:"Vas detrás de un camión lento y la línea central es continua. ¿Puedes adelantarlo?",
  o:["No, no puedo pisar ni cruzar la línea continua","Sí, si no viene nadie de frente","Sí, si lo hago muy rápido"],
  ok:"Paciencia premiada: el camión se desvía y la carretera es toda tuya.",ko:"El de enfrente ha visto pasar su vida entera… y la tuya también.",
  rule:"La línea continua no se puede pisar ni cruzar. Hay excepciones muy concretas, y adelantar a un camión no es una de ellas."},
 {sc:"ambulancia",intro:"¡Sirenas! Una ambulancia se acerca por detrás.",q:"Una ambulancia en servicio urgente (sirena y luces) viene detrás. ¿Qué haces?",
  o:["Facilitarle el paso: apartarme a la derecha o detenerme si hace falta","Acelerar para que no me alcance","Seguir igual: ya me adelantará"],
  ok:"Te apartas y la ambulancia pasa como un rayo. Heroicidad sin capa.",ko:"La ambulancia lleva medio kilómetro pegada a tu maletero cantándote el «ni-no ni-no».",
  rule:"Los vehículos prioritarios en servicio urgente tienen preferencia: hay que facilitarles el paso, normalmente apartándose a la derecha y deteniéndose si es necesario."},
 {sc:"lluvia",intro:"Empieza a llover y llevas un coche delante.",q:"Con lluvia, ¿qué haces con la distancia de seguridad respecto al coche de delante?",
  o:["Aumentarla","Mantenerla igual","Reducirla para ver mejor sus luces"],
  ok:"El de delante frena de golpe… y tú, a tu ritmo y con margen de sobra.",ko:"Has frenado tan justo que podías leerle la pegatina de la ITV.",
  rule:"Con el suelo mojado se tarda más en frenar, así que la distancia de seguridad debe ser mayor."},
 {sc:"alcohol",intro:"Control de alcoholemia. Toca soplar.",q:"¿Qué tasa de alcohol en aire espirado no puede superar un conductor novel?",
  o:["0,15 mg/l","0,25 mg/l","0,50 mg/l"],
  ok:"«Negativo, buen viaje». El agente casi te aplaude.",ko:"Te has saltado el control haciendo eses entre los conos. Los agentes no se han reído.",
  rule:"Noveles (menos de 2 años de carnet) y profesionales: 0,15 mg/l en aire (0,3 g/l en sangre). Resto de conductores: 0,25 mg/l en aire (0,5 g/l en sangre)."},
 {sc:"movil",intro:"Te suena el móvil…",q:"Te llaman mientras conduces. ¿Puedes coger el móvil con la mano un momento?",
  o:["No, nunca sujetándolo con la mano","Sí, si estoy parado en un semáforo","Sí, si es una llamada corta"],
  ok:"Ni caso al móvil. La llamada puede esperar; la farola no se aparta.",ko:"Mientras decías «¿sí, dígame?», el coche se ha ido a la acera por su cuenta.",
  rule:"Está prohibido usar el móvil sujetándolo con la mano al conducir, también parado en un semáforo o atasco: 200 € y 6 puntos. Solo manos libres, sin auriculares."},
 {sc:"balon",intro:"Calle con coches aparcados… ¡un balón sale rodando!",q:"Un balón sale a la calzada entre los coches aparcados. ¿Qué haces?",
  o:["Frenar y extremar la precaución: puede salir un niño detrás","Esquivar el balón y seguir","Tocar el claxon y mantener la velocidad"],
  ok:"Frenas, el peque recupera su balón y te saluda. Momento anuncio de la DGT.",ko:"El niño ha salido detrás del balón y has hecho un eslalon digno de los Juegos de Invierno.",
  rule:"Si hay indicios de niños (un balón, un colegio, un parque), modera la velocidad e incluso detente: detrás del balón suele venir un niño."},
 {sc:"luces",intro:"Es de noche y llevas las luces largas. Viene un coche de frente.",q:"De noche llevas las luces largas y se acerca un coche de frente. ¿Qué haces?",
  o:["Cambiar a luces de cruce (cortas) para no deslumbrarle","Mantener las largas, que se vea bien","Hacerle ráfagas para avisar de que voy"],
  ok:"Cortas puestas: el otro conductor sigue viendo la carretera y no las estrellas.",ko:"Le has deslumbrado tanto que ha visto la luz al final del túnel… sin túnel.",
  rule:"Hay que cambiar las luces largas por las de cruce al cruzarse con otro vehículo (o al seguirlo de cerca) para no deslumbrar."}
,
 {sc:"peatones",intro:"Paso de peatones… y el coche de delante va lentísimo.",q:"¿Está permitido adelantar en un paso de peatones señalizado?",
  o:["No, está prohibido","Sí, si no hay nadie cruzando","Sí, si el otro coche va muy lento"],
  ok:"Ni adelantas ni te la juegas: el paso de cebra no es una pista de despegue.",ko:"Has acelerado en el paso justo cuando salía alguien. Casi le cambias el peinado.",
  rule:"Está prohibido adelantar en los pasos para peatones señalizados, aunque no veas a nadie cruzando."},
 {sc:"derecha",intro:"Cruce sin ninguna señal ni semáforo. Se acerca un coche por tu derecha.",q:"En un cruce sin señalizar, ¿quién tiene preferencia?",
  o:["El vehículo que viene por mi derecha","Yo, porque voy recto","El que vaya más rápido"],
  ok:"Le cedes el paso y te saluda con la mano. Educación vial nivel experto.",ko:"Has pasado como si fuera tu cumpleaños. El de la derecha te ha regalado un pitido.",
  rule:"En los cruces sin señalizar hay que ceder el paso a los vehículos que se acercan por la derecha."},
 {sc:"ambar",intro:"Semáforo en ámbar intermitente y un coche cruzando…",q:"¿Qué significa un semáforo en ámbar intermitente?",
  o:["Puedo pasar, pero con mucha precaución y cediendo el paso si toca","Debo detenerme siempre, como en rojo","Que está averiado y tengo preferencia"],
  ok:"Miras, cedes a quien toca y pasas. De manual.",ko:"Has leído «ámbar intermitente» como «barra libre». El del cruce no opina lo mismo.",
  rule:"El ámbar intermitente obliga a extremar la precaución y, si corresponde, a ceder el paso, pero no obliga a detenerse."},
 {sc:"glorieta",intro:"Glorieta de dos carriles. Vas a salir por la próxima salida.",q:"En una glorieta de dos carriles vas a salir por la próxima salida. ¿Por dónde circulas?",
  o:["Por el carril exterior (derecho)","Por el carril interior (izquierdo)","Por cualquiera, da igual"],
  ok:"Carril de fuera y salida limpia. Ni un volantazo.",ko:"Has ido por dentro y has salido cruzando en diagonal. El de fuera aún se lo está contando a su familia.",
  rule:"Si vas a salir por la próxima salida, circula por el carril exterior. Desde un carril interior hay que pasar antes, con tiempo, al exterior."},
 {sc:"glorieta",intro:"Ya estás en la glorieta y te toca salir.",q:"¿Qué intermitente usas para salir de una glorieta?",
  o:["El derecho","El izquierdo","Ninguno: ya se ve que salgo"],
  ok:"Intermitente derecho a tiempo: los demás saben lo que haces. Telepatía vial.",ko:"Sin avisar… el de detrás ha tenido que adivinarlo. No ha acertado.",
  rule:"Para salir de una glorieta hay que señalizar con el intermitente derecho con antelación suficiente."},
 {sc:"velocidad",lim:20,intro:"Calle de plataforma única: acera y calzada al mismo nivel.",q:"¿Cuál es la velocidad máxima genérica en una calle de plataforma única (acera y calzada al mismo nivel)?",
  o:["20 km/h","30 km/h","10 km/h"],
  ok:"20, a paso de paseo. Los vecinos te saludan desde el balcón.",ko:"¡FLASH! Ibas tan rápido por una calle peatonal que hasta las palomas han puesto una queja.",
  rule:"En calles de plataforma única el límite genérico es 20 km/h; con un carril por sentido, 30; con dos o más, 50."},
 {sc:"velocidad",lim:50,intro:"Avenida con dos carriles por sentido.",q:"Vía urbana con dos o más carriles por sentido. ¿Cuál es la velocidad máxima genérica?",
  o:["50 km/h","60 km/h","40 km/h"],
  ok:"50 y semáforos en verde de rebote. Día de suerte.",ko:"¡FLASH! El radar de la avenida ya te tiene en favoritos.",
  rule:"En vías urbanas con dos o más carriles por sentido, el límite genérico es 50 km/h."},
 {sc:"adelantar",intro:"Curva cerrada sin visibilidad y un camión lento delante.",q:"¿Puedes adelantar en una curva de visibilidad reducida?",
  o:["No, está prohibido","Sí, si lo hago rápido","Sí, si toco el claxon antes"],
  ok:"Esperas a la recta, el camión se aparta y adelantas sin dramas.",ko:"Detrás de la curva venía alguien. Por suerte tiene buenos frenos… y mejores reflejos.",
  rule:"Está prohibido adelantar en curvas y cambios de rasante con visibilidad reducida: no ves si viene alguien de frente."},
 {sc:"ambulancia",intro:"Luces azules por el retrovisor…",q:"¿Qué indican unas luces azules intermitentes en el vehículo que viene detrás?",
  o:["Que es un vehículo prioritario en servicio urgente y debo facilitarle el paso","Que es un vehículo especial lento","Nada: son de decoración"],
  ok:"Te apartas a tiempo y la urgencia llega a su destino. Bien hecho.",ko:"«Decoración», dice. La policía no ha opinado lo mismo.",
  rule:"Las luces azules (o azules y rojas) intermitentes indican un vehículo prioritario en servicio urgente: hay que facilitarle el paso."},
 {sc:"lluvia",intro:"Mucha agua en la calzada… el volante va raro.",q:"Con lluvia notas que el volante «flota» (aquaplaning). ¿Qué haces?",
  o:["Soltar el acelerador poco a poco, sin frenar de golpe, y sujetar firme el volante","Frenar a fondo","Acelerar para salir del charco"],
  ok:"El coche recupera agarre y tú, la calma.",ko:"Frenazo sobre el agua: casi haces un triple axel de patinaje artístico.",
  rule:"En aquaplaning las ruedas pierden contacto con el suelo: suelta el acelerador suavemente, no frenes bruscamente y mantén el volante recto."},
 {sc:"lluvia",intro:"Llueve a cántaros y apenas se ve nada.",q:"Llueve muchísimo y la visibilidad es muy baja. ¿Qué luz adicional puedes encender?",
  o:["La antiniebla trasera","Las luces largas","Las de emergencia, sin detenerme"],
  ok:"Antiniebla trasera: el de detrás te ve y mantiene la distancia.",ko:"Con las largas bajo la tromba has visto… cortinas de agua. Y el de delante, tu cara de susto.",
  rule:"La antiniebla trasera se usa con niebla espesa, lluvia muy intensa, nevada o nubes densas de polvo o humo. Con lluvia fuerte las largas reflejan en el agua y ves peor."},
 {sc:"alcohol",intro:"Control de alcoholemia en la salida del pueblo.",q:"¿Cuál es la tasa máxima de alcohol en aire espirado para un conductor general (ni novel ni profesional)?",
  o:["0,25 mg/l","0,50 mg/l","0,15 mg/l"],
  ok:"Sabes la cifra… y no la has rozado. «Buen viaje».",ko:"Has hecho eses entre los conos. El agente ya está sacando el talonario.",
  rule:"Conductores en general: 0,25 mg/l en aire (0,5 g/l en sangre). Noveles y profesionales: 0,15 mg/l en aire (0,3 g/l en sangre)."},
 {sc:"alcohol",intro:"Un agente te hace señas para que pares y soples.",q:"Un agente te pide que hagas la prueba de alcoholemia. ¿Puedes negarte?",
  o:["No: negarse es un delito","Sí, si no he bebido nada","Sí, pero solo me ponen una multa leve"],
  ok:"Soplas, sale 0,00 y en dos minutos estás en marcha.",ko:"Te has intentado escapar entre los conos. Mala idea: esto ya es Código Penal.",
  rule:"Negarse a las pruebas de alcohol o drogas es delito: prisión de 6 meses a 1 año y retirada del permiso de 1 a 4 años."},
 {sc:"movil",intro:"Te pones los auriculares para escuchar música…",q:"¿Puedes conducir con auriculares conectados al móvil para escuchar música?",
  o:["No, está prohibido","Sí, con un solo oído","Sí, si el volumen es bajo"],
  ok:"Música por los altavoces del coche y oídos atentos a la carretera.",ko:"Con los auriculares no has oído nada… y el coche se ha ido a ver la acera.",
  rule:"Está prohibido conducir con cascos o auriculares conectados al móvil o a aparatos de sonido. Solo valen manos libres que no los usen."},
 {sc:"balon",intro:"Zona escolar a la hora de salida…",q:"Pasas por delante de un colegio a la hora de salida. ¿Qué haces?",
  o:["Moderar la velocidad y estar preparado para detenerme","Pasar rápido antes de que salgan","Tocar el claxon para avisar"],
  ok:"Despacio y atento: el peque cruza a por su balón y todo en orden.",ko:"Ibas con prisa y te ha salido un peque por delante. Eslalon de emergencia.",
  rule:"En zonas con niños (colegios, parques) hay que moderar la velocidad e incluso detenerse: pueden aparecer de repente."},
 {sc:"luces",intro:"Entras en un túnel.",q:"Entras en un túnel. ¿Qué luces debes llevar como mínimo?",
  o:["Las de cruce (cortas)","Solo las de posición","Ninguna si el túnel está iluminado"],
  ok:"Cortas encendidas: te ven y ves. Túnel superado.",ko:"Has entrado a oscuras y el de enfrente te ha visto en el último segundo.",
  rule:"En los túneles es obligatorio llevar al menos las luces de cruce, aunque estén iluminados."},
 {sc:"luces",intro:"De noche, vas detrás de otro coche a poca distancia.",q:"De noche vas detrás de otro coche a poca distancia. ¿Qué luces llevas?",
  o:["Las de cruce (cortas)","Las largas","Las antiniebla delanteras"],
  ok:"Cortas: el de delante no va cegado por sus retrovisores.",ko:"Con las largas le has convertido los retrovisores en focos de discoteca.",
  rule:"Si sigues de cerca a otro vehículo de noche, usa las luces de cruce para no deslumbrarle por los retrovisores."}
];
const ROUND=30,ALLOWED=3,EXAM_MIN=30;
QS.push({"sc": "ceda", "sign": "ceda", "okA": null, "koA": null, "intro": "¡Señal a la vista! ¿La conoces?", "q": "¿Qué significa esta señal?", "o": ["Ceder el paso a los vehículos de la vía a la que me acerco", "Detenerme siempre por completo", "Tengo preferencia en el cruce"], "ok": "Cedes, el de la otra vía pasa tranquilo y después vas tú.", "ko": "Has pasado como si el triángulo fuera decoración. El del cruce no lo ha visto así.", "rule": "Ceda el paso: debes dejar pasar a los vehículos de la vía a la que te incorporas. A diferencia del STOP, solo hay que detenerse si hace falta."},
{"sc": "senal", "sign": "dirprohibida", "okA": "turn", "koA": "contra", "intro": "¡Señal a la vista! ¿La conoces?", "q": "¿Qué significa esta señal circular roja con una franja blanca?", "o": ["Dirección prohibida: no puedo entrar en ese sentido", "Calle sin salida", "Prohibido estacionar"], "ok": "Te desvías por la calle de la derecha. Nada de entrar a contramano.", "ko": "Has entrado en dirección prohibida… y venía uno de frente. Volantazo de película.", "rule": "Dirección prohibida: prohíbe entrar a todos los vehículos en ese sentido."},
{"sc": "senal", "sign": "circprohibida", "okA": "turn", "koA": "multa", "intro": "¡Señal a la vista! ¿La conoces?", "q": "¿Qué significa esta señal circular blanca con borde rojo y sin nada dentro?", "o": ["Circulación prohibida para todos los vehículos en ambos sentidos", "Fin de todas las prohibiciones", "Zona de velocidad libre"], "ok": "Ni un metro más: te desvías. Esa calle no es para coches.", "ko": "Has entrado igualmente. La policía local te esperaba con una sonrisa y una multa.", "rule": "Circulación prohibida: ningún vehículo puede circular por esa vía, en ningún sentido."},
{"sc": "adelantar", "sign": "noadelantar", "okA": null, "koA": null, "intro": "¡Señal a la vista! ¿La conoces?", "q": "¿Qué significa esta señal?", "o": ["Prohibido adelantar", "Prohibido circular a coches", "Doble sentido de circulación"], "ok": "Te quedas detrás hasta que se acabe la prohibición. Paciencia de campeón.", "ko": "Has adelantado bajo la señal… y el de enfrente casi se come tu retrovisor.", "rule": "Prohibido adelantar: no puedes adelantar a vehículos de motor (salvo motos de dos ruedas) hasta que termine la prohibición."},
{"sc": "senal", "sign": "curvader", "okA": "slow", "koA": "skid", "intro": "¡Señal a la vista! ¿La conoces?", "q": "¿Qué indica esta señal triangular?", "o": ["Peligro: curva peligrosa hacia la derecha", "Obligatorio girar a la derecha", "Fin de la autovía"], "ok": "Reduces antes de la curva y la tomas como en un anuncio.", "ko": "Has entrado en la curva sin frenar. Las ruedas aún están chillando.", "rule": "Señal de peligro: curva peligrosa hacia la derecha. Adapta la velocidad antes de llegar."},
{"sc": "balon", "sign": "ninos", "okA": null, "koA": null, "intro": "¡Señal a la vista! ¿La conoces?", "q": "¿Qué indica esta señal?", "o": ["Peligro: proximidad de un lugar frecuentado por niños", "Paso de peatones", "Calle residencial"], "ok": "Vas despacio y atento: el peque recupera su balón sin sustos.", "ko": "No has levantado el pie… y un peque ha salido corriendo detrás del balón.", "rule": "Peligro por la proximidad de un lugar frecuentado por niños, como un colegio o un parque. Modera la velocidad."},
{"sc": "peatones", "sign": "pasopeatones", "okA": null, "koA": null, "intro": "¡Señal a la vista! ¿La conoces?", "q": "¿Qué indica esta señal triangular?", "o": ["Peligro: proximidad de un paso para peatones", "Prohibido el paso a peatones", "Zona peatonal"], "ok": "Llegas despacio y el peatón cruza tranquilo.", "ko": "Te ha pillado por sorpresa el paso de peatones. El peatón todavía tiembla.", "rule": "Señal de peligro: anuncia un paso para peatones cercano. Prepárate para detenerte."},
{"sc": "senal", "sign": "noestacionar", "okA": "pass", "koA": "park", "intro": "¡Señal a la vista! ¿La conoces?", "q": "¿Qué significa esta señal azul con borde rojo y una franja roja?", "o": ["Prohibido estacionar, pero puedo parar un momento", "Prohibido parar y estacionar", "Aparcamiento reservado"], "ok": "Sigues sin aparcar. Aquí no se queda nadie.", "ko": "Has aparcado justo debajo. La grúa ya venía de camino.", "rule": "Prohibido estacionar: no puedes dejar el coche aparcado, pero sí detenerte un momento (por ejemplo, para que alguien baje)."},
{"sc": "senal", "sign": "noparar", "okA": "pass", "koA": "park", "intro": "¡Señal a la vista! ¿La conoces?", "q": "¿Qué significa esta señal azul con borde rojo y un aspa roja?", "o": ["Prohibido parar y estacionar", "Solo prohibido estacionar", "Cruce peligroso"], "ok": "Ni paras ni aparcas: sigues tu camino.", "ko": "Has parado «solo un segundito». El agente no cree en los segunditos.", "rule": "Prohibido parar y estacionar: no puedes ni detenerte ni aparcar en ese tramo."},
{"sc": "senal", "sign": "vmin60", "okA": "pass", "koA": "slowhonk", "intro": "¡Señal a la vista! ¿La conoces?", "q": "¿Qué significa esta señal circular azul con un 60?", "o": ["Velocidad mínima obligatoria de 60 km/h", "Velocidad máxima de 60 km/h", "Velocidad aconsejada de 60 km/h"], "ok": "Por encima de 60 y fluyendo con el tráfico.", "ko": "Ibas a paso de caracol. El camión de detrás te ha dedicado una sinfonía de claxon.", "rule": "Señal azul circular con un número: velocidad mínima obligatoria. No puedes ir más despacio salvo que el tráfico o el tiempo lo impidan."},
{"sc": "senal", "sign": "finlim", "okA": "pass", "koA": "slowhonk", "intro": "¡Señal a la vista! ¿La conoces?", "q": "¿Qué significa esta señal blanca con un 50 gris y rayas negras?", "o": ["Fin de la limitación de velocidad de 50 km/h", "Velocidad máxima de 50 km/h", "Velocidad mínima de 50 km/h"], "ok": "Fin del 50: vuelves al límite genérico de la vía.", "ko": "Seguías a 20 sin motivo. Los de detrás ya estaban organizando una pancarta.", "rule": "Fin de limitación: termina el límite indicado y vuelve a regir el límite genérico de la vía."},
{"sc": "senal", "sign": "prioridad", "okA": "pass", "koA": "slowhonk", "intro": "¡Señal a la vista! ¿La conoces?", "q": "¿Qué significa esta señal cuadrada azul con una flecha blanca y otra roja?", "o": ["Tengo prioridad sobre los que vienen de frente en el estrechamiento", "Debo ceder el paso a los que vienen de frente", "Doble sentido de circulación"], "ok": "Pasas tú primero y el de enfrente espera. Todo en orden.", "ko": "Te has parado a esperar sin motivo y la cola de detrás ha empezado a pitar.", "rule": "Prioridad respecto al sentido contrario: en el paso estrecho pasas tú primero (flecha blanca, la tuya)."},
{"sc": "senal", "sign": "obras", "okA": "slow", "koA": "skid", "intro": "¡Señal a la vista! ¿La conoces?", "q": "¿Qué indica esta señal triangular?", "o": ["Peligro: obras", "Peligro: desprendimientos", "Zona de trabajo agrícola"], "ok": "Despacio entre los conos. Los operarios te lo agradecen.", "ko": "Has entrado en las obras a toda pastilla. Los conos han salido volando.", "rule": "Peligro por obras en la vía: reduce la velocidad y presta atención a la señalización provisional."},
{"sc": "senal", "sign": "nogiroizq", "okA": "pass", "koA": "contra", "intro": "¡Señal a la vista! ¿La conoces?", "q": "¿Qué significa esta señal?", "o": ["Prohibido girar a la izquierda", "Obligatorio girar a la izquierda", "Curva peligrosa a la izquierda"], "ok": "Sigues recto. El giro prohibido, para otro día.", "ko": "Has girado a la izquierda igualmente… y te has metido en el carril de los que vienen de frente.", "rule": "Prohibido girar a la izquierda en la próxima intersección."},
{"sc": "senal", "sign": "sentidoder", "okA": "turn", "koA": "contra", "intro": "¡Señal a la vista! ¿La conoces?", "q": "¿Qué significa esta señal circular azul con una flecha blanca hacia la derecha?", "o": ["Sentido obligatorio: solo puedo seguir hacia la derecha", "Recomendado girar a la derecha", "Prohibido girar a la derecha"], "ok": "Giras a la derecha, como manda la flecha.", "ko": "Has seguido recto contra la señal y te has encontrado con uno de cara.", "rule": "Las señales azules circulares son de obligación: aquí, solo puedes seguir en el sentido de la flecha."},
{"sc": "senal", "sign": "deslizante", "okA": "slow", "koA": "skid", "intro": "¡Señal a la vista! ¿La conoces?", "q": "¿Qué indica esta señal triangular con un coche y líneas onduladas?", "o": ["Peligro: pavimento deslizante", "Peligro: carretera con baches", "Zona de lavado de coches"], "ok": "Suave con el volante y con el freno. Agarre perfecto.", "ko": "Has frenado de golpe sobre el asfalto resbaladizo y has hecho un baile involuntario.", "rule": "Pavimento deslizante: evita frenazos y volantazos, y reduce la velocidad."},
{"sc": "senal", "sign": "autopista", "okA": "pass", "koA": "slowhonk", "intro": "¡Señal a la vista! ¿La conoces?", "q": "¿Qué indica esta señal cuadrada azul?", "o": ["Entrada a una autopista: empiezan sus normas", "Fin de la autopista", "Área de servicio"], "ok": "Entras en la autopista con sus normas en la cabeza.", "ko": "Has frenado en plena incorporación. Los de detrás no esperaban un parón.", "rule": "Autopista: indica que empieza una autopista y que se aplican sus normas especiales."},
{"sc": "senal", "sign": "hielo", "okA": "slow", "koA": "skid", "intro": "¡Señal a la vista! ¿La conoces?", "q": "¿Qué indica esta señal triangular con un copo de nieve?", "o": ["Peligro: posible hielo o nieve", "Zona de esquí", "Peligro: viento fuerte"], "ok": "Despacito y con marchas largas. Ni un patinazo.", "ko": "Has pisado una placa de hielo a toda velocidad. Patinaje artístico sin entrenador.", "rule": "Peligro por posible hielo o nieve: reduce la velocidad y evita maniobras bruscas."},
{"sc": "senal", "sign": "aconsejada", "okA": "slow", "koA": "skid", "intro": "¡Señal a la vista! ¿La conoces?", "q": "¿Qué significa esta señal cuadrada azul con un 70?", "o": ["Velocidad aconsejada de 70 km/h (recomendada, no obligatoria)", "Velocidad máxima obligatoria de 70 km/h", "Velocidad mínima de 70 km/h"], "ok": "Haces caso al consejo y la curva sale perfecta.", "ko": "Has ignorado el consejo y la curva te ha dado un buen susto.", "rule": "Las señales cuadradas azules con un número indican velocidad aconsejada: no es obligatoria, pero conviene respetarla."},
{"sc": "senal", "sign": "estrechamiento", "okA": "slow", "koA": "skid", "intro": "¡Señal a la vista! ¿La conoces?", "q": "¿Qué indica esta señal triangular?", "o": ["Peligro: estrechamiento de la calzada", "Fin de carril", "Puente levadizo"], "ok": "Reduces, miras y pasas por el estrechamiento sin rozar nada.", "ko": "Has llegado al estrechamiento demasiado rápido y casi te dejas un retrovisor.", "rule": "Peligro: la calzada se estrecha más adelante. Reduce la velocidad y presta atención a los de frente."});
QS.forEach((q,i)=>q.id=i);
const SIGNS={"ceda": "<path d=\"M7 13 Q4 9 9 9 H91 Q96 9 93 13 L54 88 Q50 94 46 88 Z\" fill=\"#fff\" stroke=\"#c8341f\" stroke-width=\"10\" stroke-linejoin=\"round\"/>", "stop": "<path d=\"M30 4 H70 L96 30 V70 L70 96 H30 L4 70 V30 Z\" fill=\"#fff\"/><path d=\"M31.5 8 H68.5 L92 31.5 V68.5 L68.5 92 H31.5 L8 68.5 V31.5 Z\" fill=\"#c8341f\"/><text x=\"50\" y=\"59\" text-anchor=\"middle\" font-family=\"Arial,Helvetica,sans-serif\" font-weight=\"bold\" font-size=\"25\" fill=\"#fff\" letter-spacing=\"-1\">STOP</text>", "dirprohibida": "<circle cx=\"50\" cy=\"50\" r=\"47\" fill=\"#c8341f\" stroke=\"#fff\" stroke-width=\"3\"/><rect x=\"16\" y=\"41\" width=\"68\" height=\"18\" fill=\"#fff\"/>", "circprohibida": "<circle cx=\"50\" cy=\"50\" r=\"43\" fill=\"#fff\" stroke=\"#c8341f\" stroke-width=\"11\"/><circle cx=\"50\" cy=\"50\" r=\"48.5\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2\"/>", "noadelantar": "<circle cx=\"50\" cy=\"50\" r=\"43\" fill=\"#fff\" stroke=\"#c8341f\" stroke-width=\"11\"/><circle cx=\"50\" cy=\"50\" r=\"48.5\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2\"/><g transform=\"translate(36 54) scale(1.05)\"><path d=\"M-12 -6 L-8 -14 H8 L12 -6 Z\" fill=\"#c8341f\"/><rect x=\"-14\" y=\"-7\" width=\"28\" height=\"11\" rx=\"3\" fill=\"#c8341f\"/><rect x=\"-13\" y=\"3\" width=\"6\" height=\"5\" rx=\"1\" fill=\"#c8341f\"/><rect x=\"7\" y=\"3\" width=\"6\" height=\"5\" rx=\"1\" fill=\"#c8341f\"/><rect x=\"-9\" y=\"-12\" width=\"18\" height=\"5\" rx=\"1\" fill=\"#fff\"/></g><g transform=\"translate(64 54) scale(1.05)\"><path d=\"M-12 -6 L-8 -14 H8 L12 -6 Z\" fill=\"#16181c\"/><rect x=\"-14\" y=\"-7\" width=\"28\" height=\"11\" rx=\"3\" fill=\"#16181c\"/><rect x=\"-13\" y=\"3\" width=\"6\" height=\"5\" rx=\"1\" fill=\"#16181c\"/><rect x=\"7\" y=\"3\" width=\"6\" height=\"5\" rx=\"1\" fill=\"#16181c\"/><rect x=\"-9\" y=\"-12\" width=\"18\" height=\"5\" rx=\"1\" fill=\"#fff\"/></g>", "curvader": "<path d=\"M50 9 L92 83 Q94 88 88 88 H12 Q6 88 8 83 Z\" fill=\"#fff\" stroke=\"#c8341f\" stroke-width=\"9\" stroke-linejoin=\"round\"/><path d=\"M45 80 V60 Q45 46 58 44\" fill=\"none\" stroke=\"#16181c\" stroke-width=\"8\"/><path d=\"M55 33 L70 44 L55 55 Z\" fill=\"#16181c\"/>", "ninos": "<path d=\"M50 9 L92 83 Q94 88 88 88 H12 Q6 88 8 83 Z\" fill=\"#fff\" stroke=\"#c8341f\" stroke-width=\"9\" stroke-linejoin=\"round\"/><g transform=\"translate(40 72) scale(1.15)\" fill=\"#16181c\" stroke=\"#16181c\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"2\" cy=\"-22\" r=\"4.2\" stroke=\"none\"/><path d=\"M0 -16 L-2 -3\" stroke-width=\"6.5\" fill=\"none\"/><path d=\"M-2 -3 L-6 8 M-2 -3 L5 7 L6 10\" stroke-width=\"4.5\" fill=\"none\"/><path d=\"M0 -14 L-7 -7 M0 -14 L6 -8 L8 -4\" stroke-width=\"3.5\" fill=\"none\"/></g><g transform=\"translate(60 74) scale(0.95)\" fill=\"#16181c\" stroke=\"#16181c\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"2\" cy=\"-22\" r=\"4.2\" stroke=\"none\"/><path d=\"M0 -16 L-2 -3\" stroke-width=\"6.5\" fill=\"none\"/><path d=\"M-2 -3 L6 8 M-2 -3 L-5 7 L-6 10\" stroke-width=\"4.5\" fill=\"none\"/><path d=\"M0 -14 L-7 -7 M0 -14 L6 -8 L8 -4\" stroke-width=\"3.5\" fill=\"none\"/></g><rect x=\"55\" y=\"49\" width=\"6\" height=\"7\" rx=\"1\" fill=\"#16181c\"/>", "pasopeatones": "<path d=\"M50 9 L92 83 Q94 88 88 88 H12 Q6 88 8 83 Z\" fill=\"#fff\" stroke=\"#c8341f\" stroke-width=\"9\" stroke-linejoin=\"round\"/><g transform=\"translate(50 68) scale(1.2)\" fill=\"#16181c\" stroke=\"#16181c\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"2\" cy=\"-22\" r=\"4.2\" stroke=\"none\"/><path d=\"M0 -16 L-2 -3\" stroke-width=\"6.5\" fill=\"none\"/><path d=\"M-2 -3 L-6 8 M-2 -3 L5 7 L6 10\" stroke-width=\"4.5\" fill=\"none\"/><path d=\"M0 -14 L-7 -7 M0 -14 L6 -8 L8 -4\" stroke-width=\"3.5\" fill=\"none\"/></g><rect x=\"30\" y=\"78\" width=\"5\" height=\"4\" fill=\"#16181c\"/><rect x=\"39\" y=\"78\" width=\"5\" height=\"4\" fill=\"#16181c\"/><rect x=\"48\" y=\"78\" width=\"5\" height=\"4\" fill=\"#16181c\"/><rect x=\"57\" y=\"78\" width=\"5\" height=\"4\" fill=\"#16181c\"/><rect x=\"66\" y=\"78\" width=\"5\" height=\"4\" fill=\"#16181c\"/>", "noestacionar": "<circle cx=\"50\" cy=\"50\" r=\"43\" fill=\"#1f4fd1\" stroke=\"#c8341f\" stroke-width=\"11\"/><circle cx=\"50\" cy=\"50\" r=\"48.5\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2\"/><path d=\"M22 22 L78 78\" stroke=\"#c8341f\" stroke-width=\"10\"/>", "noparar": "<circle cx=\"50\" cy=\"50\" r=\"43\" fill=\"#1f4fd1\" stroke=\"#c8341f\" stroke-width=\"11\"/><circle cx=\"50\" cy=\"50\" r=\"48.5\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2\"/><path d=\"M22 22 L78 78 M78 22 L22 78\" stroke=\"#c8341f\" stroke-width=\"10\"/>", "vmin60": "<circle cx=\"50\" cy=\"50\" r=\"47\" fill=\"#1f4fd1\" stroke=\"#fff\" stroke-width=\"3\"/><text x=\"50\" y=\"65.12\" text-anchor=\"middle\" font-family=\"Arial,Helvetica,sans-serif\" font-weight=\"bold\" font-size=\"42\" fill=\"#fff\">60</text>", "finlim": "<circle cx=\"50\" cy=\"50\" r=\"46\" fill=\"#fff\" stroke=\"#16181c\" stroke-width=\"2\"/><text x=\"50\" y=\"64.4\" text-anchor=\"middle\" font-family=\"Arial,Helvetica,sans-serif\" font-weight=\"bold\" font-size=\"40\" fill=\"#8f959e\">50</text><path d=\"M13 89 L77 7\" stroke=\"#16181c\" stroke-width=\"1.6\"/><path d=\"M18 88 L78 12\" stroke=\"#16181c\" stroke-width=\"1.6\"/><path d=\"M23 87 L79 17\" stroke=\"#16181c\" stroke-width=\"1.6\"/><path d=\"M28 86 L80 22\" stroke=\"#16181c\" stroke-width=\"1.6\"/><path d=\"M33 85 L81 27\" stroke=\"#16181c\" stroke-width=\"1.6\"/><path d=\"M38 84 L82 32\" stroke=\"#16181c\" stroke-width=\"1.6\"/><path d=\"M43 83 L83 37\" stroke=\"#16181c\" stroke-width=\"1.6\"/>", "prioridad": "<rect x=\"4\" y=\"4\" width=\"92\" height=\"92\" rx=\"9\" fill=\"#1f4fd1\" stroke=\"#fff\" stroke-width=\"3\"/><path d=\"M38 82 V36 H28 L42 16 L56 36 H46 V82 Z\" fill=\"#fff\"/><path d=\"M62 22 V54 H56 L66 70 L76 54 H70 V22 Z\" fill=\"#c8341f\"/>", "obras": "<path d=\"M50 9 L92 83 Q94 88 88 88 H12 Q6 88 8 83 Z\" fill=\"#fff\" stroke=\"#c8341f\" stroke-width=\"9\" stroke-linejoin=\"round\"/><g fill=\"#16181c\" stroke=\"#16181c\" stroke-linecap=\"round\"><circle cx=\"40\" cy=\"42\" r=\"4.5\" stroke=\"none\"/><path d=\"M41 48 L47 62\" stroke-width=\"7\" fill=\"none\"/><path d=\"M47 62 L40 76 M47 62 L54 76\" stroke-width=\"5\" fill=\"none\"/><path d=\"M42 52 L56 58\" stroke-width=\"4\" fill=\"none\"/><path d=\"M56 50 L66 76\" stroke-width=\"3\" fill=\"none\"/><path d=\"M62 74 L72 78 L66 80Z\" stroke=\"none\"/><path d=\"M64 82 Q72 66 82 82 Z\" stroke=\"none\"/></g>", "nogiroizq": "<circle cx=\"50\" cy=\"50\" r=\"43\" fill=\"#fff\" stroke=\"#c8341f\" stroke-width=\"11\"/><circle cx=\"50\" cy=\"50\" r=\"48.5\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2\"/><path d=\"M58 80 V52 Q58 42 48 42 H40\" fill=\"none\" stroke=\"#16181c\" stroke-width=\"9\"/><path d=\"M42 30 L26 42 L42 54 Z\" fill=\"#16181c\"/><path d=\"M20 20 L80 80\" stroke=\"#c8341f\" stroke-width=\"9\"/>", "sentidoder": "<circle cx=\"50\" cy=\"50\" r=\"47\" fill=\"#1f4fd1\" stroke=\"#fff\" stroke-width=\"3\"/><path d=\"M18 43 H56 V28 L82 50 L56 72 V57 H18 Z\" fill=\"#fff\"/>", "deslizante": "<path d=\"M50 9 L92 83 Q94 88 88 88 H12 Q6 88 8 83 Z\" fill=\"#fff\" stroke=\"#c8341f\" stroke-width=\"9\" stroke-linejoin=\"round\"/><g transform=\"translate(50 52) scale(1.25)\"><path d=\"M-12 -6 L-8 -14 H8 L12 -6 Z\" fill=\"#16181c\"/><rect x=\"-14\" y=\"-7\" width=\"28\" height=\"11\" rx=\"3\" fill=\"#16181c\"/><rect x=\"-13\" y=\"3\" width=\"6\" height=\"5\" rx=\"1\" fill=\"#16181c\"/><rect x=\"7\" y=\"3\" width=\"6\" height=\"5\" rx=\"1\" fill=\"#16181c\"/><rect x=\"-9\" y=\"-12\" width=\"18\" height=\"5\" rx=\"1\" fill=\"#fff\"/></g><path d=\"M40 64 q-5 5 0 10 q5 5 0 10 M60 64 q-5 5 0 10 q5 5 0 10\" fill=\"none\" stroke=\"#16181c\" stroke-width=\"3\"/>", "autopista": "<rect x=\"4\" y=\"4\" width=\"92\" height=\"92\" rx=\"9\" fill=\"#1f4fd1\" stroke=\"#fff\" stroke-width=\"3\"/><path d=\"M14 88 L40 38 H47 L44 88 Z\" fill=\"#fff\"/><path d=\"M56 88 L53 38 H60 L86 88 Z\" fill=\"#fff\"/><rect x=\"12\" y=\"28\" width=\"76\" height=\"10\" fill=\"#fff\"/><rect x=\"12\" y=\"38\" width=\"76\" height=\"3\" fill=\"#1f4fd1\"/><rect x=\"20\" y=\"41\" width=\"6\" height=\"8\" fill=\"#fff\"/><rect x=\"74\" y=\"41\" width=\"6\" height=\"8\" fill=\"#fff\"/>", "hielo": "<path d=\"M50 9 L92 83 Q94 88 88 88 H12 Q6 88 8 83 Z\" fill=\"#fff\" stroke=\"#c8341f\" stroke-width=\"9\" stroke-linejoin=\"round\"/><g stroke=\"#16181c\" stroke-width=\"4\" stroke-linecap=\"round\"><g transform=\"rotate(0 50 60)\"><path d=\"M50 60 V40 M50 46 L44 41 M50 46 L56 41\"/></g><g transform=\"rotate(60 50 60)\"><path d=\"M50 60 V40 M50 46 L44 41 M50 46 L56 41\"/></g><g transform=\"rotate(120 50 60)\"><path d=\"M50 60 V40 M50 46 L44 41 M50 46 L56 41\"/></g><g transform=\"rotate(180 50 60)\"><path d=\"M50 60 V40 M50 46 L44 41 M50 46 L56 41\"/></g><g transform=\"rotate(240 50 60)\"><path d=\"M50 60 V40 M50 46 L44 41 M50 46 L56 41\"/></g><g transform=\"rotate(300 50 60)\"><path d=\"M50 60 V40 M50 46 L44 41 M50 46 L56 41\"/></g></g>", "aconsejada": "<rect x=\"4\" y=\"4\" width=\"92\" height=\"92\" rx=\"9\" fill=\"#1f4fd1\" stroke=\"#fff\" stroke-width=\"3\"/><text x=\"50\" y=\"65.84\" text-anchor=\"middle\" font-family=\"Arial,Helvetica,sans-serif\" font-weight=\"bold\" font-size=\"44\" fill=\"#fff\">70</text>", "estrechamiento": "<path d=\"M50 9 L92 83 Q94 88 88 88 H12 Q6 88 8 83 Z\" fill=\"#fff\" stroke=\"#c8341f\" stroke-width=\"9\" stroke-linejoin=\"round\"/><path d=\"M36 82 V64 L44 50 V36 M64 82 V64 L56 50 V36\" fill=\"none\" stroke=\"#16181c\" stroke-width=\"6\"/>", "glorieta": "<circle cx=\"50\" cy=\"50\" r=\"47\" fill=\"#1f4fd1\" stroke=\"#fff\" stroke-width=\"3\"/><g fill=\"none\" stroke=\"#fff\" stroke-width=\"8\"><path d=\"M71.45872598765163 64.68070430827092 A26 26 0 0 0 64.04785995257163 28.121754394994692\"/><path d=\"M26.494124307556408 61.11187688607957 A26 26 0 0 0 61.793499157065014 73.17139136159733\"/><path d=\"M52.274973569425605 24.099720170268142 A26 26 0 0 0 24.04433582933642 48.48227227088293\"/></g><path d=\"M56.474603227580964 23.259061460273884 L72.7198747780653 25.71423308326805 L65.46760384479286 37.00906710922392 Z\" fill=\"#fff\"/><path d=\"M69.81435040219952 69.08899680650786 L59.49366120007154 81.8725835426477 L53.40513540428739 69.91020238346582 Z\" fill=\"#fff\"/><path d=\"M23.519001540964933 57.466927182756905 L17.694449471440844 42.10426762665354 L31.094257466228036 42.88775666060107 Z\" fill=\"#fff\"/>", "s13": "<rect x=\"4\" y=\"4\" width=\"92\" height=\"92\" rx=\"9\" fill=\"#1f4fd1\" stroke=\"#fff\" stroke-width=\"3\"/><path d=\"M50 12 L88 84 H12 Z\" fill=\"#fff\"/><rect x=\"26\" y=\"74\" width=\"6\" height=\"5\" fill=\"#16181c\"/><rect x=\"36\" y=\"74\" width=\"6\" height=\"5\" fill=\"#16181c\"/><rect x=\"46\" y=\"74\" width=\"6\" height=\"5\" fill=\"#16181c\"/><rect x=\"56\" y=\"74\" width=\"6\" height=\"5\" fill=\"#16181c\"/><rect x=\"66\" y=\"74\" width=\"6\" height=\"5\" fill=\"#16181c\"/><g transform=\"translate(50 66) scale(1.05)\" fill=\"#16181c\" stroke=\"#16181c\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"2\" cy=\"-22\" r=\"4.2\" stroke=\"none\"/><path d=\"M0 -16 L-2 -3\" stroke-width=\"6.5\" fill=\"none\"/><path d=\"M-2 -3 L-6 8 M-2 -3 L5 7 L6 10\" stroke-width=\"4.5\" fill=\"none\"/><path d=\"M0 -14 L-7 -7 M0 -14 L6 -8 L8 -4\" stroke-width=\"3.5\" fill=\"none\"/></g>"};
const SIGNIMG={};const signSrc=k=>k.startsWith("v:")?SIGNS.circprohibida+`<text x="50" y="${k.length>4?64:65}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="bold" font-size="${k.length>5?34:40}" fill="#16181c">${k.slice(2)}</text>`:SIGNS[k];
function getSign(k){if(!SIGNIMG[k]){const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">${signSrc(k)}</svg>`);SIGNIMG[k]=im}return SIGNIMG[k]}
for(const k in SIGNS)getSign(k);["v:?","v:20","v:30","v:50","v:90","v:120"].forEach(getSign);
const signSVG=k=>`<svg viewBox="0 0 100 100" role="img" aria-label="Señal de la pregunta">${SIGNS[k]}</svg>`;


const CSS=`
.gv{--road:#3b3f46;--yel:#ffcf33}
.gv-head{background:#16181c;color:#fff;padding:14px max(5vw,16px)}
.gv-head .wrap{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.gv-head a{color:#fff;text-decoration:none;font-weight:700;min-height:44px;display:inline-flex;align-items:center}
.gv-head h1{font-size:clamp(22px,3.4vw,30px)}
.gv-tools{display:flex;gap:8px}
.gv-tools button{min-height:44px;min-width:44px;border-radius:22px;border:1.5px solid #4a4f58;background:#23262c;color:#fff;cursor:pointer;font-size:16px;padding:0 14px}
.gv-main{max-width:880px;margin:0 auto;padding:18px max(3vw,10px) 40px}
.gv-hud{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:10px;font-weight:700}
.gv-road{flex:1 1 200px;height:12px;border-radius:6px;background:var(--line);position:relative;overflow:visible}
.gv-road i{position:absolute;left:0;top:0;bottom:0;border-radius:6px;background:var(--c-dgt);transition:width .5s}
.gv-road b{position:absolute;top:50%;width:22px;height:14px;margin:-7px 0 0 -11px;border-radius:4px;background:#e23b3b;border:2px solid #16181c;transition:left .5s}
.gv-clock{font-family:"Archivo Black",sans-serif;font-weight:400;font-size:18px;white-space:nowrap;padding:4px 10px;border-radius:6px;background:#16181c;color:#fff}.gv-clock.low{background:#b42318}
.gv-warn{color:#b42318;font-size:14px;margin-left:4px}
.gv-lives{display:flex;gap:6px;align-items:center;white-space:nowrap}
.gv-lives span{width:22px;height:22px;border-radius:50%;background:#18a058;display:inline-block;border:2px solid #16181c}
.gv-lives span.off{background:#b42318;position:relative}
.gv-lives span.off::after{content:"";position:absolute;inset:8px -3px;background:#16181c;transform:rotate(45deg)}
.gv-stage{position:relative;border-radius:10px;overflow:hidden;border:3px solid #16181c;background:#5aa156}
.gv-stage canvas{display:block;width:100%;height:auto;image-rendering:pixelated}
.gv-speed{position:absolute;top:10px;right:10px;background:rgba(22,24,28,.82);color:#fff;border-radius:10px;padding:6px 10px;text-align:center;font-family:"Archivo Black",sans-serif;line-height:1}
.gv-speed b{font-size:26px;display:block;font-weight:400}.gv-speed small{font-family:"Atkinson Hyperlegible",sans-serif;font-size:12px}
.gv-stamp{position:absolute;left:50%;top:38%;transform:translate(-50%,-50%) rotate(-8deg);font-family:"Archivo Black",sans-serif;font-size:clamp(26px,6vw,52px);color:#fff;padding:6px 18px;border:5px solid #fff;border-radius:10px;background:#e0731a;box-shadow:0 8px 0 rgba(0,0,0,.3);white-space:nowrap;pointer-events:none;animation:gvStamp .35s cubic-bezier(.2,1.6,.5,1)}
.gv-stamp.bad{background:#b42318}.gv-stamp.good{background:#18794e}
@keyframes gvStamp{from{transform:translate(-50%,-50%) rotate(-8deg) scale(2.2);opacity:0}}
.gv-box{position:relative;margin-top:-6px;background:#fffdf4;color:#16181c;border:4px solid #16181c;border-radius:12px;box-shadow:inset 0 0 0 3px #ffcf33,0 6px 0 rgba(0,0,0,.18);padding:16px 18px 16px 112px;min-height:150px}
.gv-cono{position:absolute;left:10px;bottom:10px;width:92px;height:120px}
.gv-cono.talk{animation:gvBob .35s ease-in-out infinite alternate}
.gv-cono svg{width:100%;height:100%}.gv-cono .mo{opacity:0}.gv-cono.talk .mo{animation:kvMo .26s steps(1) infinite}.gv-cono.talk .mc{animation:kvMc .26s steps(1) infinite}.gv-cono .lid{opacity:0;animation:kvLid 3.8s steps(1) infinite}
@keyframes kvMo{0%{opacity:1}50%{opacity:0}}@keyframes kvMc{0%{opacity:0}50%{opacity:1}}@keyframes kvLid{0%,93%{opacity:0}94%,100%{opacity:1}}
@keyframes gvBob{to{transform:translateY(-4px) rotate(-2deg)}}
.gv-name{position:absolute;top:-16px;left:104px;background:#16181c;color:#ffcf33;font-family:"Archivo Black",sans-serif;font-size:14px;padding:3px 12px;border-radius:6px}
.gv-txt{font-size:18px;line-height:1.45;min-height:52px;margin:0}
.gv-txt b{color:#b42318}.gv-rule{display:block;margin-top:8px;font-size:16px;color:#3c4249;border-left:4px solid #e0731a;padding-left:10px}
.gv-opts{display:grid;gap:8px;margin-top:12px}
.gv-sign{float:right;width:96px;height:96px;margin:0 0 8px 12px;filter:drop-shadow(0 3px 0 rgba(0,0,0,.25))}.gv-sign svg{width:100%;height:100%}
@media(max-width:600px){.gv-sign{float:none;margin:8px auto 0;width:88px;height:88px}}
.gv-opt{display:flex;gap:10px;align-items:center;text-align:left;min-height:48px;padding:8px 14px;border-radius:8px;border:2.5px solid #16181c;background:#fff;color:#16181c;font:700 16px/1.3 "Atkinson Hyperlegible",sans-serif;cursor:pointer;box-shadow:0 3px 0 #16181c;transition:transform .08s}
.gv-opt:hover{transform:translateY(-2px)}.gv-opt:active{transform:translateY(2px);box-shadow:none}
.gv-opt kbd{flex:none;width:28px;height:28px;border-radius:6px;background:#ffcf33;display:grid;place-items:center;font:400 14px "Archivo Black",sans-serif;border:2px solid #16181c}
.gv-timer{height:8px;border-radius:4px;background:#e4e1d6;margin-top:12px;overflow:hidden}.gv-timer i{display:block;height:100%;background:#18794e}
.gv-next{display:inline-flex;align-items:center;gap:6px;margin-top:12px;min-height:46px;padding:8px 18px;border:0;border-radius:8px;background:#16181c;color:#fff;font:700 16px "Atkinson Hyperlegible",sans-serif;cursor:pointer}
.gv-next::after{content:"▼";font-size:12px;animation:gvBlink .7s steps(2) infinite}
@keyframes gvBlink{50%{opacity:0}}
.gv-end ul{margin:10px 0 0;padding-left:20px;font-size:15px}.gv-end li{margin-bottom:8px}
.gv-end .big{font-family:"Archivo Black",sans-serif;font-size:clamp(30px,6vw,44px);line-height:1}
.gv-help{color:var(--soft);font-size:14px;margin:12px 0 0;text-align:center}
@media(max-width:600px){.gv-box{padding:56px 12px 14px}.gv-cono{left:auto;right:8px;top:-62px;bottom:auto;width:64px;height:84px}.gv-name{left:12px}.gv-txt{font-size:17px}}
@media(prefers-reduced-motion:reduce){.gv-cono.talk,.gv-stamp,.gv-next::after{animation:none}}
`;

const CONO="<svg viewBox=\"0 0 96 128\" aria-hidden=\"true\" shape-rendering=\"crispEdges\"><ellipse cx=\"48.0\" cy=\"123\" rx=\"34.56\" ry=\"5\" fill=\"rgba(0,0,0,.2)\"/><rect x=\"32\" y=\"0\" width=\"12\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"44\" y=\"0\" width=\"12\" height=\"4\" fill=\"#333c57\"/><rect x=\"56\" y=\"0\" width=\"12\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"28\" y=\"4\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"32\" y=\"4\" width=\"36\" height=\"4\" fill=\"#333c57\"/><rect x=\"68\" y=\"4\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"28\" y=\"8\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"32\" y=\"8\" width=\"28\" height=\"4\" fill=\"#333c57\"/><rect x=\"60\" y=\"8\" width=\"4\" height=\"4\" fill=\"#ffcd75\"/><rect x=\"64\" y=\"8\" width=\"4\" height=\"4\" fill=\"#333c57\"/><rect x=\"68\" y=\"8\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"32\" y=\"12\" width=\"12\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"44\" y=\"12\" width=\"12\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"56\" y=\"12\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"60\" y=\"12\" width=\"4\" height=\"4\" fill=\"#ffcd75\"/><rect x=\"64\" y=\"12\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"36\" y=\"16\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"40\" y=\"16\" width=\"16\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"56\" y=\"16\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"60\" y=\"16\" width=\"4\" height=\"4\" fill=\"#ffcd75\"/><rect x=\"32\" y=\"20\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"36\" y=\"20\" width=\"12\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"48\" y=\"20\" width=\"4\" height=\"4\" fill=\"#d9661a\"/><rect x=\"52\" y=\"20\" width=\"4\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"56\" y=\"20\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"60\" y=\"20\" width=\"4\" height=\"4\" fill=\"#ffcd75\"/><rect x=\"32\" y=\"24\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"36\" y=\"24\" width=\"4\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"40\" y=\"24\" width=\"16\" height=\"4\" fill=\"#f4f4f4\"/><rect x=\"56\" y=\"24\" width=\"4\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"60\" y=\"24\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"28\" y=\"28\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"32\" y=\"28\" width=\"4\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"36\" y=\"28\" width=\"20\" height=\"4\" fill=\"#f4f4f4\"/><rect x=\"56\" y=\"28\" width=\"4\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"60\" y=\"28\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"28\" y=\"32\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"32\" y=\"32\" width=\"20\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"52\" y=\"32\" width=\"8\" height=\"4\" fill=\"#d9661a\"/><rect x=\"60\" y=\"32\" width=\"4\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"64\" y=\"32\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"24\" y=\"36\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"28\" y=\"36\" width=\"24\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"52\" y=\"36\" width=\"8\" height=\"4\" fill=\"#d9661a\"/><rect x=\"60\" y=\"36\" width=\"4\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"64\" y=\"36\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"24\" y=\"40\" width=\"20\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"44\" y=\"40\" width=\"8\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"52\" y=\"40\" width=\"20\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"20\" y=\"44\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"24\" y=\"44\" width=\"4\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"28\" y=\"44\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"32\" y=\"44\" width=\"8\" height=\"4\" fill=\"#f4f4f4\"/><rect x=\"40\" y=\"44\" width=\"16\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"56\" y=\"44\" width=\"8\" height=\"4\" fill=\"#f4f4f4\"/><rect x=\"64\" y=\"44\" width=\"8\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"20\" y=\"48\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"24\" y=\"48\" width=\"4\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"28\" y=\"48\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"32\" y=\"48\" width=\"4\" height=\"4\" fill=\"#f4f4f4\"/><rect x=\"36\" y=\"48\" width=\"8\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"44\" y=\"48\" width=\"8\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"52\" y=\"48\" width=\"8\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"60\" y=\"48\" width=\"4\" height=\"4\" fill=\"#f4f4f4\"/><rect x=\"64\" y=\"48\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"68\" y=\"48\" width=\"4\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"72\" y=\"48\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"16\" y=\"52\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"20\" y=\"52\" width=\"8\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"28\" y=\"52\" width=\"16\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"44\" y=\"52\" width=\"8\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"52\" y=\"52\" width=\"16\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"68\" y=\"52\" width=\"4\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"72\" y=\"52\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"16\" y=\"56\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"20\" y=\"56\" width=\"36\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"56\" y=\"56\" width=\"16\" height=\"4\" fill=\"#d9661a\"/><rect x=\"72\" y=\"56\" width=\"4\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"76\" y=\"56\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"12\" y=\"60\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"16\" y=\"60\" width=\"16\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"32\" y=\"60\" width=\"4\" height=\"4\" fill=\"#5e3a1c\"/><rect x=\"36\" y=\"60\" width=\"24\" height=\"4\" fill=\"#8b5a2b\"/><rect x=\"60\" y=\"60\" width=\"4\" height=\"4\" fill=\"#5e3a1c\"/><rect x=\"64\" y=\"60\" width=\"8\" height=\"4\" fill=\"#d9661a\"/><rect x=\"72\" y=\"60\" width=\"4\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"76\" y=\"60\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"12\" y=\"64\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"16\" y=\"64\" width=\"12\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"28\" y=\"64\" width=\"40\" height=\"4\" fill=\"#5e3a1c\"/><rect x=\"68\" y=\"64\" width=\"8\" height=\"4\" fill=\"#d9661a\"/><rect x=\"76\" y=\"64\" width=\"4\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"80\" y=\"64\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"8\" y=\"68\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"12\" y=\"68\" width=\"48\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"60\" y=\"68\" width=\"16\" height=\"4\" fill=\"#d9661a\"/><rect x=\"76\" y=\"68\" width=\"4\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"80\" y=\"68\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"8\" y=\"72\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"12\" y=\"72\" width=\"48\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"60\" y=\"72\" width=\"20\" height=\"4\" fill=\"#d9661a\"/><rect x=\"80\" y=\"72\" width=\"4\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"84\" y=\"72\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"4\" y=\"76\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"8\" y=\"76\" width=\"52\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"60\" y=\"76\" width=\"20\" height=\"4\" fill=\"#d9661a\"/><rect x=\"80\" y=\"76\" width=\"4\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"84\" y=\"76\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"4\" y=\"80\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"8\" y=\"80\" width=\"4\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"12\" y=\"80\" width=\"72\" height=\"4\" fill=\"#f4f4f4\"/><rect x=\"84\" y=\"80\" width=\"4\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"88\" y=\"80\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"0\" y=\"84\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"4\" y=\"84\" width=\"4\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"8\" y=\"84\" width=\"76\" height=\"4\" fill=\"#f4f4f4\"/><rect x=\"84\" y=\"84\" width=\"4\" height=\"4\" fill=\"#d9661a\"/><rect x=\"88\" y=\"84\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"0\" y=\"88\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"4\" y=\"88\" width=\"60\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"64\" y=\"88\" width=\"24\" height=\"4\" fill=\"#d9661a\"/><rect x=\"88\" y=\"88\" width=\"4\" height=\"4\" fill=\"#ff8a1f\"/><rect x=\"92\" y=\"88\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"0\" y=\"92\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"4\" y=\"92\" width=\"92\" height=\"4\" fill=\"#ffa35c\"/><rect x=\"0\" y=\"96\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"4\" y=\"96\" width=\"92\" height=\"4\" fill=\"#e0731a\"/><rect x=\"0\" y=\"100\" width=\"4\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"4\" y=\"100\" width=\"92\" height=\"4\" fill=\"#e0731a\"/><rect x=\"4\" y=\"104\" width=\"92\" height=\"4\" fill=\"#1a1c2c\"/><g class=\"lid\"><rect x=\"28\" y=\"40\" width=\"16\" height=\"12\" fill=\"#ff8a1f\"/><rect x=\"52\" y=\"40\" width=\"16\" height=\"12\" fill=\"#ff8a1f\"/></g><g class=\"mc\"><rect x=\"40\" y=\"72\" width=\"16\" height=\"4\" fill=\"#1a1c2c\"/></g><g class=\"mo\"><rect x=\"40\" y=\"68\" width=\"16\" height=\"4\" fill=\"#1a1c2c\"/><rect x=\"36\" y=\"72\" width=\"4\" height=\"8\" fill=\"#1a1c2c\"/><rect x=\"56\" y=\"72\" width=\"4\" height=\"8\" fill=\"#1a1c2c\"/><rect x=\"40\" y=\"72\" width=\"16\" height=\"8\" fill=\"#5d275d\"/><rect x=\"44\" y=\"76\" width=\"8\" height=\"4\" fill=\"#b13e53\"/><rect x=\"40\" y=\"80\" width=\"16\" height=\"4\" fill=\"#1a1c2c\"/></g></svg>";

window.ToTestGames["dgt-carretera"]=function(root,api){
 const esc=api.esc;
 if(!document.getElementById("gv-css")){const st=document.createElement("style");st.id="gv-css";st.textContent=CSS;document.head.appendChild(st)}
 root.innerHTML=`<div class="gv"><header class="gv-head"><div class="wrap"><a href="#">← ToTest</a><h1>Al volante con el Profe Cono</h1>
  <div class="gv-tools"><button type="button" id="gvSnd" aria-pressed="true" aria-label="Sonido">Sonido: sí</button></div></div></header>
 <main class="gv-main">
  <div class="gv-hud"><span id="gvTramo">Tramo 0/${ROUND}</span><div class="gv-road" aria-hidden="true"><i id="gvProg"></i><b id="gvCar"></b></div>
   <span class="gv-clock" id="gvClock" aria-label="Tiempo de examen">30:00</span><span class="gv-lives" id="gvLives" aria-label="Fallos"></span></div>
  <div class="gv-stage" id="gvStage"><canvas id="gvCv" aria-label="Carretera vista desde arriba con tu coche rojo"></canvas>
   ${api.poster?`<div class="kv-title" id="gvTitle" style="position:absolute;inset:0;display:grid;place-items:center;background:radial-gradient(circle,rgba(22,24,28,.55),rgba(22,24,28,.9));z-index:3;transition:opacity .4s"><div style="height:92%;aspect-ratio:3/4;border-radius:10px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.6)">${api.poster}</div></div>`:""}<div class="gv-speed" aria-hidden="true"><b id="gvKmh">0</b><small>km/h</small></div><div id="gvStampBox"></div></div>
  <section class="gv-box" aria-live="polite"><div class="gv-cono" id="gvCono">${CONO}</div><span class="gv-name">PROFE CONO</span>
   <p class="gv-txt" id="gvTxt"></p><div id="gvUI"></div></section>
  <p class="gv-help">Responde con las teclas 1-3 · Enter o espacio para continuar</p>
 </main></div>`;
 const $=id=>document.getElementById(id);
 const cv=$("gvCv"),MAIN=cv.getContext("2d"),LO=document.createElement("canvas"),LOC=LO.getContext("2d");let ctx=MAIN;const PIXF=3;
 let W=820,H=470,alive=true,raf=0,lastT=0;

 /* ---------- Sonido ---------- */
 let ac=null,eng=null,sndOn=api.store.get("gv-snd")!==false;
 const A=()=>{if(!sndOn)return null;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==="suspended")ac.resume()}catch(e){ac=null}return ac};
 function tone(f,d,type="square",v=.06,when=0){const c=A();if(!c)return;const t=c.currentTime+when,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0005,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+.05)}
 function noise(d,v=.15,freq=1200,q=1){const c=A();if(!c)return;const b=c.createBuffer(1,c.sampleRate*d,c.sampleRate),x=b.getChannelData(0);for(let i=0;i<x.length;i++)x[i]=Math.random()*2-1;const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();f.type="bandpass";f.frequency.value=freq;f.Q.value=q;s.buffer=b;g.gain.setValueAtTime(v,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+d);s.connect(f);f.connect(g);g.connect(c.destination);s.start()}
 const SFX={honk:()=>{tone(392,.35,"square",.05);tone(466,.35,"square",.04)},screech:()=>noise(.6,.12,2600,6),flash:()=>{noise(.08,.2,5000,1);tone(1800,.1,"sine",.05)},
  good:()=>{[523,659,784,1046].forEach((f,i)=>tone(f,.18,"triangle",.07,i*.08))},bad:()=>{tone(220,.25,"sawtooth",.05);tone(180,.35,"sawtooth",.05,.18)},
  crash:()=>{noise(1.2,.4,300,.7);noise(.5,.25,1800,1);tone(70,.8,"sine",.2)},blip:()=>tone(880+Math.random()*120,.03,"square",.012),siren:t=>{tone(t?960:720,.22,"sine",.035)},
  win:()=>{[523,659,784,659,784,1046].forEach((f,i)=>tone(f,.22,"triangle",.07,i*.12))}};
 function engineSet(sp){const c=sndOn?A():null;if(!c){if(eng){try{eng.g.gain.value=0}catch(e){}}return}
  if(!eng){const o=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain();o.type="sawtooth";f.type="lowpass";f.frequency.value=380;g.gain.value=0;o.connect(f);f.connect(g);g.connect(c.destination);o.start();eng={o,g}}
  eng.o.frequency.setTargetAtTime(38+sp*.16,c.currentTime,.1);eng.g.gain.setTargetAtTime(.018+Math.min(sp,500)/500*.02,c.currentTime,.15)}
 function engineOff(){if(eng){try{eng.g.gain.setTargetAtTime(0,ac.currentTime,.1)}catch(e){}}}
 $("gvSnd").onclick=()=>{sndOn=!sndOn;api.store.set("gv-snd",sndOn);$("gvSnd").textContent="Sonido: "+(sndOn?"sí":"no");$("gvSnd").setAttribute("aria-pressed",sndOn);if(!sndOn)engineOff()};
 $("gvSnd").textContent="Sonido: "+(sndOn?"sí":"no");

 /* ---------- Estado de la escena ---------- */
 const S={};
 function resetScene(){Object.assign(S,{world:0,speed:0,carX:0,carA:0,carDY:0,a:-200,sc:null,phase:"idle",t:0,parts:[],bub:[],night:0,rain:0,solid:false,flash:0,shake:0,act:{},beam:"long",phone:0,kmhOver:null,wreck:false,brake:false})}
 const geo=()=>({cx:W/2,RX:W/2+60,LX:W/2-60,carY:H-110});

 function size(){const w=cv.clientWidth||800;W=w<620?420:820;H=w<620?470:470;const dpr=Math.min(2,window.devicePixelRatio||1);cv.width=Math.round(w*dpr);cv.height=Math.round(w*H/W*dpr);if(S.phase==="idle"||!S.carX)S.carX=geo().RX}
 const ro=new ResizeObserver(size);ro.observe(cv);

 /* ---------- Dibujo ---------- */
 function rr(x,y,w,h,r){ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,w,h,r):ctx.rect(x,y,w,h)}
 function car(x,y,col,ang=0,o={}){
  ctx.save();ctx.translate(x,y);ctx.rotate(ang);
  if(o.beam){const g=ctx.createLinearGradient(0,-40,0,o.beam==="long"?-330:-170);g.addColorStop(0,"rgba(255,244,190,.55)");g.addColorStop(1,"rgba(255,244,190,0)");ctx.fillStyle=g;ctx.beginPath();const L=o.beam==="long"?330:170,Wd=o.beam==="long"?120:70;ctx.moveTo(-16,-36);ctx.lineTo(-Wd,-L);ctx.lineTo(Wd,-L);ctx.lineTo(16,-36);ctx.fill()}
  if(o.flip)ctx.rotate(Math.PI);
  ctx.fillStyle="rgba(0,0,0,.25)";rr(-21,-34,46,76,10);ctx.fill();
  ctx.fillStyle="#16181c";[[-24,-26],[18,-26],[-24,14],[18,14]].forEach(([a,b])=>{rr(a,b,6,16,2);ctx.fill()});
  ctx.fillStyle=o.wreck?"#6b6f76":col;ctx.strokeStyle="#16181c";ctx.lineWidth=3;rr(-21,-38,42,76,11);ctx.fill();ctx.stroke();
  ctx.fillStyle=o.wreck?"#3d4046":"#9fd4f2";rr(-15,-22,30,14,4);ctx.fill();ctx.stroke();rr(-15,16,30,10,4);ctx.fill();ctx.stroke();
  ctx.fillStyle="rgba(255,255,255,.25)";rr(-13,-6,26,20,5);ctx.fill();
  ctx.fillStyle="#fff7c2";ctx.fillRect(-17,-38,9,4);ctx.fillRect(8,-38,9,4);
  ctx.fillStyle=o.brake?"#ff2b2b":"#8a1c1c";ctx.fillRect(-17,34,9,4);ctx.fillRect(8,34,9,4);
  if(o.dent){ctx.strokeStyle="#16181c";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(6,-34);ctx.lineTo(10,-28);ctx.lineTo(4,-26);ctx.lineTo(9,-20);ctx.stroke()}
  if(o.wreck){ctx.strokeStyle="#16181c";ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-18+i*10,-36);ctx.lineTo(-12+i*9,-24);ctx.lineTo(-17+i*10,-14);ctx.stroke()}}
  if(o.siren){ctx.fillStyle=o.siren>0?"#2f6bff":"#ff3030";rr(-12,-4,11,8,2);ctx.fill();ctx.fillStyle=o.siren>0?"#ff3030":"#2f6bff";rr(1,-4,11,8,2);ctx.fill()}
  ctx.restore()}
 function truck(x,y){ctx.save();ctx.translate(x,y);ctx.fillStyle="rgba(0,0,0,.25)";rr(-25,-118,56,130,6);ctx.fill();ctx.fillStyle="#d9dde3";ctx.strokeStyle="#16181c";ctx.lineWidth=3;rr(-27,-90,54,100,4);ctx.fill();ctx.stroke();ctx.fillStyle="#2f7d4f";rr(-24,-122,48,30,6);ctx.fill();ctx.stroke();ctx.fillStyle="#9fd4f2";ctx.fillRect(-18,-120,36,8);ctx.fillStyle="#8a1c1c";ctx.fillRect(-25,6,10,4);ctx.fillRect(15,6,10,4);ctx.fillStyle="#16181c";ctx.font="bold 13px sans-serif";ctx.textAlign="center";ctx.fillText("LENTO",0,-38);ctx.restore()}
 function amb(x,y,t){ctx.save();ctx.translate(x,y);ctx.fillStyle="rgba(0,0,0,.25)";rr(-22,-44,50,92,8);ctx.fill();ctx.fillStyle="#fff";ctx.strokeStyle="#16181c";ctx.lineWidth=3;rr(-24,-46,48,92,8);ctx.fill();ctx.stroke();ctx.fillStyle="#e0731a";ctx.fillRect(-24,6,48,7);ctx.fillStyle="#d22";ctx.fillRect(-4,-14,8,22);ctx.fillRect(-11,-7,22,8);ctx.fillStyle="#9fd4f2";rr(-17,-38,34,12,3);ctx.fill();const on=Math.floor(t*8)%2;ctx.fillStyle=on?"#2f6bff":"#ff3030";rr(-16,-48,12,6,2);ctx.fill();ctx.fillStyle=on?"#ff3030":"#2f6bff";rr(4,-48,12,6,2);ctx.fill();if(on){ctx.fillStyle="rgba(47,107,255,.25)";ctx.beginPath();ctx.arc(0,-46,40,0,7);ctx.fill()}ctx.restore()}
 function person(x,y,col,t,walk,kid){const s=kid?.75:1;ctx.save();ctx.translate(x,y);ctx.scale(s,s);const sw=walk?Math.sin(t*14)*5:0;ctx.fillStyle="rgba(0,0,0,.22)";ctx.beginPath();ctx.ellipse(2,14,12,5,0,0,7);ctx.fill();ctx.fillStyle="#16181c";ctx.fillRect(-6+sw*.3,4,5,12);ctx.fillRect(1-sw*.3,4,5,12);ctx.fillStyle=col;ctx.strokeStyle="#16181c";ctx.lineWidth=2.5;rr(-9,-14,18,22,6);ctx.fill();ctx.stroke();ctx.fillStyle="#f2c29b";ctx.beginPath();ctx.arc(0,-22,8,0,7);ctx.fill();ctx.stroke();ctx.fillStyle="#3a2414";ctx.beginPath();ctx.arc(0,-25,7,Math.PI,0);ctx.fill();ctx.restore()}
 function pole(x,y,key){ctx.fillStyle="#5d636c";ctx.fillRect(x-2,y-30,4,30);(S.signQ=S.signQ||[]).push({key:typeof key==="string"?key:null,x,y});if(typeof key==="string")return;ctx.save();ctx.translate(x,y-44);key();ctx.restore()}
 const signRound=(txt,ring="#c8341f",bg="#fff",fg="#16181c")=>()=>{ctx.fillStyle=bg;ctx.strokeStyle=ring;ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,17,0,7);ctx.fill();ctx.stroke();ctx.fillStyle=fg;ctx.font="bold 14px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(txt,0,1)};
 const signStop=()=>{ctx.fillStyle="#c8341f";ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4;ctx.lineTo(Math.cos(a)*18,Math.sin(a)*18)}ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle="#fff";ctx.font="bold 10px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("STOP",0,1)};
 const signRot=()=>{ctx.fillStyle="#1f4fd1";ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,17,0,7);ctx.fill();ctx.stroke();ctx.strokeStyle="#fff";ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,8,.3,5.6);ctx.stroke()};
 const signPed=()=>{ctx.fillStyle="#1f4fd1";ctx.fillRect(-16,-16,32,32);ctx.fillStyle="#fff";ctx.beginPath();ctx.moveTo(0,-12);ctx.lineTo(13,12);ctx.lineTo(-13,12);ctx.fill();ctx.fillStyle="#16181c";ctx.beginPath();ctx.arc(1,-2,2.5,0,7);ctx.fill();ctx.fillRect(-1,1,3,8)};
 function light(x,y,st){ctx.fillStyle="#7d838c";ctx.fillRect(x-2,y-30,4,30);ctx.fillStyle="#16181c";rr(x-10,y-80,20,52,5);ctx.fill();[["red","#ff3030",0],["amber","#ffb020",1],["green","#22c55e",2]].forEach(([k,c,i])=>{ctx.fillStyle=st===k?c:"#3b3f46";ctx.beginPath();ctx.arc(x,y-70+i*16,6,0,7);ctx.fill();if(st===k){ctx.fillStyle=c+"55";ctx.beginPath();ctx.arc(x,y-70+i*16,12,0,7);ctx.fill()}})}
 function bubble(txt,x,y,col="#fff"){ctx.font="15px 'Press Start 2P',monospace";ctx.font="bold 15px 'Atkinson Hyperlegible',sans-serif";const w=ctx.measureText(txt).width+18;x=Math.max(w/2+4,Math.min(W-w/2-4,x));ctx.fillStyle=col;ctx.strokeStyle="#16181c";ctx.lineWidth=2.5;rr(x-w/2,y-34,w,26,8);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(x-6,y-9);ctx.lineTo(x,y);ctx.lineTo(x+6,y-9);ctx.fill();ctx.fillStyle="#16181c";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(txt,x,y-21)}

 function drawWorld(){
  const {cx,carY}=geo(),off=S.world;
  ctx.fillStyle="#5aa156";ctx.fillRect(0,0,W,H);
  ctx.fillStyle="#4f9550";for(let i=-1;i<H/40+1;i++){const y=((i*40+off*.999)%(H+40))-20;ctx.fillRect(0,y,W,3)}
  ctx.fillStyle="#c9ccd1";ctx.fillRect(cx-160,0,40,H);ctx.fillRect(cx+120,0,40,H);
  ctx.fillStyle="#b3b7be";for(let y=(off%30)-30;y<H;y+=30){ctx.fillRect(cx-160,y,40,2);ctx.fillRect(cx+120,y,40,2)}
  ctx.fillStyle="#3b3f46";ctx.fillRect(cx-120,0,240,H);
  ctx.fillStyle="#fff";ctx.fillRect(cx-116,0,4,H);ctx.fillRect(cx+112,0,4,H);
  if(S.solid){ctx.fillRect(cx-2,0,4,H)}else{for(let y=(off%60)-60;y<H;y+=60)ctx.fillRect(cx-2,y,4,30)}
  // árboles y casas
  for(let k=-1;k<6;k++){const y=((k*150+off)%(H+300))-150;
   [[cx-215,0],[cx+215,1]].forEach(([x,s])=>{const yy=y+(s?70:0);if(W>600&&(k+s)%3===0){ctx.fillStyle="rgba(0,0,0,.2)";rr(x-36,yy-26,80,64,6);ctx.fill();ctx.fillStyle=["#e8d3b0","#cfe0f0","#f2c6b8"][(k+3)%3];ctx.strokeStyle="#16181c";ctx.lineWidth=3;rr(x-40,yy-30,80,64,6);ctx.fill();ctx.stroke();ctx.fillStyle="#b4532a";ctx.fillRect(x-40,yy-30,80,14)}
    else{ctx.fillStyle="rgba(0,0,0,.2)";ctx.beginPath();ctx.arc(x+5,yy+6,24,0,7);ctx.fill();ctx.fillStyle="#2f7d3e";ctx.strokeStyle="#16181c";ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,yy,24,0,7);ctx.fill();ctx.stroke();ctx.fillStyle="#3f9a50";ctx.beginPath();ctx.arc(x-7,yy-7,10,0,7);ctx.fill()}})}
 }
 function frame(){
  const g=geo(),{cx,carY}=g,a=S.a;
  S.signQ=[];const lw=Math.round(W/PIXF),lh=Math.round(H/PIXF);if(LO.width!==lw||LO.height!==lh){LO.width=lw;LO.height=lh}
  ctx=LOC;ctx.save();ctx.setTransform(lw/W,0,0,lh/H,0,0);ctx.imageSmoothingEnabled=false;
  if(S.shake>0){ctx.translate((Math.random()-.5)*S.shake,(Math.random()-.5)*S.shake)}
  drawWorld();
  if(S.sc&&SC[S.sc].draw)SC[S.sc].draw(a,g);
  if(S.sc&&S.q&&S.q.sign){const im=SIGNIMG[S.q.sign],sy=SC[S.sc].rel?(S.asked?S.signY+(S.world-S.signW):S.a-60):a+10;pole(cx+150,sy,S.q.sign)}
  // coche propio
  car(S.carX,carY+S.carDY,"#e23b3b",S.carA,{brake:S.brake,dent:S.damage>=1,wreck:S.wreck,beam:S.night?S.beam:null});
  if(S.sc&&SC[S.sc].over)SC[S.sc].over(a,g);
  // partículas
  S.parts.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill()});ctx.globalAlpha=1;
  if(S.rain){ctx.strokeStyle="rgba(200,225,255,.55)";ctx.lineWidth=1.5;const t=performance.now()/1000;for(let i=0;i<90;i++){const x=(i*97+t*60)%W,y=(i*53+t*700)%H;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-4,y+14);ctx.stroke()}ctx.fillStyle="rgba(40,60,90,.18)";ctx.fillRect(0,0,W,H)}
  if(S.night){ctx.fillStyle="rgba(8,14,40,"+(.62*S.night)+")";ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation="lighter";const L=S.beam==="long"?330:170;const gr=ctx.createRadialGradient(S.carX,carY-L*.4,10,S.carX,carY-L*.4,L*.65);gr.addColorStop(0,"rgba(255,240,180,"+(.35*S.night)+")");gr.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation="source-over";if(S.sc==="luces")SC.luces.lights(a,g)}
  ctx.restore();ctx=MAIN;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=false;ctx.drawImage(LO,0,0,cv.width,cv.height);ctx.setTransform(cv.width/W,0,0,cv.height/H,0,0);ctx.imageSmoothingEnabled=true;
  (S.signQ||[]).forEach(q=>{if(!q.key)return;const im=getSign(q.key),z=q.key==="s13"||q.key==="glorieta"||q.key==="stop"||q.key.startsWith("v:")?52:56;if(im.complete&&im.naturalWidth){ctx.fillStyle="rgba(0,0,0,.25)";ctx.beginPath();ctx.ellipse(q.x+3,q.y-44+z/2+2,z/2,4,0,0,7);ctx.fill();ctx.drawImage(im,q.x-z/2,q.y-44-z/2,z,z)}});ctx.imageSmoothingEnabled=false;
  if(S.phone>0){const r=(Math.sin(performance.now()/60)>0);bubble(S.phone===2?"🔕":r?"📱 ring ring":"📱 ring",S.carX+50,carY-34,"#fff7c2")}
  S.bub.forEach(b=>{const [x,y]=b.at();bubble(b.txt,x,y,b.col)});
  if(S.flash>0){ctx.fillStyle="rgba(255,255,255,"+S.flash+")";ctx.fillRect(0,0,W,H)}
  if(S.phase==="ask"){ctx.fillStyle="rgba(22,24,28,.18)";ctx.fillRect(0,0,W,H);const t=performance.now()/1000,p=(Math.sin(t*4)+1)/2;ctx.strokeStyle="rgba(255,207,51,"+(.5+p*.4)+")";ctx.lineWidth=8;ctx.strokeRect(4,4,W-8,H-8)}
  ctx.restore();
 }

 /* ---------- Escenarios ---------- */
 const say=(txt,at,dur=1.4,col)=>S.bub.push({txt,at,life:dur,col});
 const puff=(x,y,n,c,sp=60,r=6)=>{for(let i=0;i<n;i++)S.parts.push({x,y,vx:(Math.random()-.5)*sp*2,vy:(Math.random()-.5)*sp*2-20,r:r*(.5+Math.random()),c,life:1+Math.random(),max:2})}
 const ramp=(v,to,k,dt)=>v+(to-v)*Math.min(1,k*dt);
 const CR=260;// velocidad de crucero (px/s)
 const SC={
  peatones:{stop:1,init(){S.act={x:geo().cx+140,walk:0,said:0}},
   draw(a,{cx}){ctx.fillStyle="#f4f4f4";for(let x=cx-112;x<cx+110;x+=26)ctx.fillRect(x,a-40,14,34);if(!(S.q&&S.q.sign))pole(cx+150,a-46,"s13");person(S.act.x,a-22,"#7a4bd1",performance.now()/1000,S.act.walk)},
   ok(t,dt){const g=geo();S.speed=t<2.1?0:ramp(S.speed,CR,2,dt);S.brake=t<2.1;if(t>.3&&S.act.x>g.cx-150){S.act.walk=1;S.act.x-=170*dt}else S.act.walk=0;if(t>1.2&&!S.act.said){S.act.said=1;say("¡Gracias! 😊",()=>[S.act.x,S.a-50],1.4)}},
   ko(t,dt){const g=geo();S.speed=ramp(S.speed,CR*1.3,3,dt);S.brake=0;if(t<.35){S.act.walk=1;S.act.x-=90*dt}else if(S.act.x<g.cx+165){S.act.x+=360*dt;if(!S.act.said){S.act.said=1;say("¡EEEH!",()=>[S.act.x,S.a-50],1.4,"#ffd4cc")}}else S.act.walk=0;S.carX=g.RX-28*Math.sin(Math.PI*Math.min(1,Math.max(0,(S.a-(g.carY-170))/260)))},
   miss:a=>a>geo().carY-30},
  cruce:{stop:1,init(kind,dir=1,blink=0){const g=geo();S.act={kind,dir,blink,x:dir>0?g.cx-360:g.cx+360,stopped:0,honk:0,light:"amber"}},
   draw(a,{cx}){ctx.fillStyle="#c9ccd1";ctx.fillRect(0,a-146,W,8);ctx.fillRect(0,a-12,W,8);ctx.fillStyle="#3b3f46";ctx.fillRect(0,a-138,W,126);ctx.fillRect(cx-120,a-146,240,142);ctx.fillStyle="#fff";for(let x=(cx%60)-60;x<W;x+=60){if(x>cx-125&&x<cx+120)continue;ctx.fillRect(x,a-77,30,4)}
    ctx.fillRect(cx+2,a-10,116,7);const k=S.act.kind;
    if(k==="stop"){pole(cx+140,a+16,"stop");ctx.font="bold 22px sans-serif";ctx.fillStyle="#fff";ctx.textAlign="center";ctx.fillText("STOP",cx+60,a+24)}
    else if(k==="semaforo")light(cx+140,a+16,S.act.blink?(Math.floor(performance.now()/450)%2?"amber":"off"):S.act.light);
    else if(k==="none"){}
    else{pole(cx+140,a+16,"glorieta");ctx.fillStyle="#fff";ctx.beginPath();ctx.moveTo(cx+30,a+8);ctx.lineTo(cx+90,a+8);ctx.lineTo(cx+60,a+32);ctx.closePath();ctx.fill();ctx.fillStyle="#3b3f46";ctx.beginPath();ctx.moveTo(cx+44,a+12);ctx.lineTo(cx+76,a+12);ctx.lineTo(cx+60,a+25);ctx.fill();
     ctx.fillStyle="#5aa156";ctx.strokeStyle="#fff";ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(cx,a-75,46,30,0,0,7);ctx.fill();ctx.stroke()}
    car(S.act.x,S.act.dir>0?a-45:a-105,"#1f4fd1",S.act.dir*Math.PI/2,{brake:S.act.stopped})},
   ok(t,dt){const g=geo(),k=S.act.kind;if(k==="semaforo"&&t>.3)S.act.light=t>2.0?"green":"red";if(t>.25)S.act.x+=330*dt*S.act.dir;const go=t>2.1;S.brake=!go;S.speed=go?ramp(S.speed,CR,2,dt):0},
   ko(t,dt){const g=geo();if(S.act.kind==="semaforo"&&t>.25)S.act.light="red";const d=S.act.dir,near=d>0?(S.act.x>g.cx-175&&S.act.x<g.cx-100):(S.act.x<g.cx+175&&S.act.x>g.cx+100);S.speed=ramp(S.speed,CR*1.25,3,dt);S.brake=0;const inX=S.a>g.carY-40&&S.a<g.carY+190;
    if(near&&inX){if(!S.act.stopped){S.act.stopped=1;SFX.screech();SFX.honk();say("¡PIIIIII!",()=>[S.act.x,S.a-(d>0?80:140)],1.5,"#ffd4cc");puff(S.act.x+40*d,S.a-(d>0?45:105),10,"#d8d8d8",40)}}else{S.act.stopped=0;S.act.x+=330*dt*d}},
   miss:a=>a>geo().carY+40},
  velocidad:{stop:0,init(q){S.act={lim:q.lim,shown:"?",radar:0,flashed:0}},
   draw(a,{cx}){pole(cx+145,a,"v:"+S.act.shown);if(S.act.radar){const y=a-260;ctx.fillStyle="#7d838c";ctx.fillRect(cx+143,y-30,4,30);ctx.fillStyle="#16181c";rr(cx+132,y-62,26,34,4);ctx.fill();ctx.fillStyle="#ffcf33";ctx.beginPath();ctx.arc(cx+145,y-45,6,0,7);ctx.fill()}},
   ok(t,dt){S.act.shown=S.act.lim;S.speed=ramp(S.speed,CR,2,dt);S.kmhOver=S.act.lim;if(t<.1)say("✔ "+S.act.lim+" km/h",()=>[S.carX,geo().carY-46],1.6,"#d8f5e2")},
   ko(t,dt){const g=geo();S.act.shown=S.act.lim;S.act.radar=1;S.speed=ramp(S.speed,CR*2.3,2.5,dt);S.kmhOver=S.act.lim+Math.round(30+20*Math.min(1,t));if(Math.random()<.5)S.parts.push({x:S.carX+(Math.random()-.5)*30,y:g.carY+40,vx:0,vy:400,r:2,c:"#fff",life:.3,max:.6});
    if(!S.act.flashed&&S.a-260>g.carY-60){S.act.flashed=1;S.flash=1;SFX.flash();say("📸 ¡FLASH! Multa",()=>[S.carX,geo().carY-46],1.6,"#ffd4cc")}},
   miss:()=>S.act.flashed},
  adelantar:{rel:1,init(){S.solid=true;S.act={tx:geo().RX,ty:-40,on:null,back:0}},
   approach(dt){S.act.ty=ramp(S.act.ty,geo().carY-78,1.6,dt);S.a=S.act.ty;return Math.abs(S.act.ty-(geo().carY-78))<3},
   draw(){truck(S.act.tx,S.act.ty);if(S.act.on)car(S.act.on.x,S.act.on.y,"#e0a800",0,{flip:1})},
   ok(t,dt){const g=geo();S.speed=CR*.8;if(t>.9){S.act.tx+=120*dt*(t>1.4?2:1);S.act.ty-=160*dt}if(t>1.8)S.solid=false},
   ko(t,dt){const g=geo();S.speed=CR*.8;if(!S.act.on)S.act.on={x:g.LX,y:-120};S.act.on.y+=(t<.6?300:700)*dt;
    if(t<.75)S.carX=ramp(S.carX,g.LX+6,5,dt);else{S.carX=ramp(S.carX,g.RX,7,dt);if(!S.act.back){S.act.back=1;SFX.honk();SFX.screech();say("¡PII-PIIII!",()=>[S.act.on.x,S.act.on.y-40],1.3,"#ffd4cc")}}
    S.carA=(S.carX-g.RX)/-900;if(t>1.6)S.carA=0},
   miss:()=>S.act.back&&S.act.on.y>geo().carY-60},
  ambulancia:{rel:1,init(){S.act={x:geo().RX,y:H+80,said:0,nino:0}},
   approach(dt){S.act.y=ramp(S.act.y,geo().carY+108,1.8,dt);S.a=S.act.y;if(Math.random()<dt*2.5)SFX.siren(S.act.nino^=1);return Math.abs(S.act.y-(geo().carY+108))<3},
   draw(){amb(S.act.x,S.act.y,performance.now()/1000)},
   ok(t,dt){const g=geo();S.speed=ramp(S.speed,CR*.55,2,dt);S.carX=ramp(S.carX,g.RX+40,4,dt);S.brake=1;if(t>.35){S.act.x=ramp(S.act.x,g.cx-14,4,dt);S.act.y-=520*dt}if(t>.9&&!S.act.said){S.act.said=1;say("¡Gracias!",()=>[S.act.x,S.act.y-60],1.2)}if(Math.random()<dt*3)SFX.siren(S.act.nino^=1)},
   ko(t,dt){const g=geo();S.speed=ramp(S.speed,CR*1.2,2,dt);if(t<1.3){S.act.y=g.carY+80+Math.sin(t*20)*4;if(!S.act.said){S.act.said=1;SFX.honk();say("¡NI-NO NI-NO! 😤",()=>[S.act.x,S.act.y+10],1.3,"#ffd4cc")}}else{S.act.x=ramp(S.act.x,g.LX,6,dt);S.act.y-=650*dt}if(Math.random()<dt*4)SFX.siren(S.act.nino^=1)},
   miss:()=>S.act.y<geo().carY+20},
  lluvia:{rel:1,init(){S.rain=1;S.act={y:-60,br:0}},
   approach(dt){S.act.y=ramp(S.act.y,geo().carY-150,1.6,dt);S.a=S.act.y;return Math.abs(S.act.y-(geo().carY-150))<3},
   draw(){car(geo().RX,S.act.y,"#2a9d8f",0,{brake:S.act.br})},
   ok(t,dt){const g=geo();if(t<.9){S.act.y=ramp(S.act.y,g.carY-235,3,dt);S.speed=CR*.8}else{S.act.br=1;S.brake=1;S.speed=ramp(S.speed,0,2.2,dt);S.act.y=ramp(S.act.y,g.carY-150,1.6,dt)}if(t>2.2){S.act.br=0;S.brake=0}},
   ko(t,dt){const g=geo();if(t<.5){S.act.y=ramp(S.act.y,g.carY-100,4,dt);S.speed=CR}else{S.act.br=1;S.brake=1;S.speed=ramp(S.speed,0,3,dt);S.act.y=ramp(S.act.y,g.carY-82,5,dt);S.carA=Math.sin(t*16)*.12*Math.max(0,1.6-t);if(t<.55)SFX.screech();if(Math.random()<.4)puff(S.carX,g.carY+30,1,"#e6e6e6",30,5)}},
   miss:()=>S.act.br},
  alcohol:{stop:1,init(){S.act={cones:[0,1,2,3].map(i=>({x:geo().cx+20+i*0,y:-i*34,dx:0,dy:0,hit:0})),said:0,off:0}},
   draw(a,{cx}){car(cx+142,a-60,"#f4f4f4",0,{siren:Math.sin(performance.now()/90)});ctx.fillStyle="#1f4fd1";ctx.fillRect(cx+128,a-84,28,8);
    S.act.cones.forEach((c,i)=>{const x=cx+18+i*26+c.dx,y=a-10-i*30+c.dy;ctx.fillStyle="#ff8a1f";ctx.strokeStyle="#16181c";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y-14);ctx.lineTo(x+8,y+6);ctx.lineTo(x-8,y+6);ctx.closePath();ctx.fill();ctx.stroke()});
    person(cx+100+S.act.off,a-40,"#183a8a",performance.now()/1000,0)},
   ok(t,dt){S.speed=t<2.1?0:ramp(S.speed,CR,2,dt);S.brake=t<2.1;if(!S.act.said&&t>.2){S.act.said=1;say("Sople aquí, por favor 🎈",()=>[geo().cx+100,S.a-80],1.0);setTimeout(()=>alive&&say("0,00 ✔ ¡Buen viaje!",()=>[geo().cx+100,S.a-80],1.2,"#d8f5e2"),1050)}},
   ko(t,dt){const g=geo();S.speed=ramp(S.speed,CR,2,dt);S.carX=g.RX+Math.sin(t*7)*34;S.carA=Math.cos(t*7)*.25;S.act.off=ramp(S.act.off,40,4,dt);
    S.act.cones.forEach((c,i)=>{const y=S.a-10-i*30+c.dy,x=g.cx+18+i*26+c.dx;if(!c.hit&&Math.abs(y-g.carY)<40&&Math.abs(x-S.carX)<34){c.hit=1;c.vx=(Math.random()-.5)*300;c.vy=-200;SFX.blip()}if(c.hit){c.dx+=c.vx*dt;c.dy+=c.vy*dt}});
    if(!S.act.said){S.act.said=1;say("¡Alto ahí! 🚨",()=>[geo().cx+130,S.a-110],1.6,"#ffd4cc")}},
   miss:()=>S.act.said&&S.a>geo().carY},
  movil:{rel:1,init(){S.phone=1;S.act={t:0,lamp:0}},approach(dt){S.act.t+=dt;S.speed=CR*.9;return S.act.t>.9},
   draw(){const {cx}=geo();if(S.act.lamp){const y=S.act.ly;ctx.fillStyle="#7d838c";ctx.fillRect(cx+136,y-6,8,8);ctx.fillRect(cx+138,y-40,4,36);ctx.fillStyle="#ffe680";ctx.beginPath();ctx.arc(cx+140,y-42,7,0,7);ctx.fill()}},
   ok(t,dt){S.phone=2;S.speed=CR*.9},
   ko(t,dt){const g=geo();S.phone=1;S.speed=CR*.9;if(!S.act.lamp){S.act.lamp=1;S.act.ly=g.carY-260}S.act.ly+=S.speed*dt;
    if(t<1.0){S.carX=ramp(S.carX,g.cx+132,2.4,dt);S.carA=.18;if(S.carX>g.cx+100){S.shake=4;if(Math.random()<.3)puff(S.carX,g.carY+30,1,"#b3a58b",30,5)}}else{S.carX=ramp(S.carX,g.RX,6,dt);S.carA=-.12*(1-Math.min(1,(t-1)*2));S.phone=0;if(!S.act.back){S.act.back=1;SFX.screech();say("¡Uy, la farola!",()=>[S.carX,g.carY-46],1.3,"#ffd4cc")}}},
   miss:()=>S.act.back},
  balon:{stop:1,init(){const g=geo();S.act={bx:g.cx+128,kx:g.cx+150,kw:0,state:0,said:0}},
   draw(a,{cx}){[a-150,a+20,a+120].forEach(y=>car(cx+140,y,"#8e9aaf",0));ctx.fillStyle="#fff";ctx.strokeStyle="#16181c";ctx.lineWidth=2;ctx.beginPath();ctx.arc(S.act.bx,a-36,8,0,7);ctx.fill();ctx.stroke();ctx.fillStyle="#e23b3b";ctx.beginPath();ctx.arc(S.act.bx,a-36,3,0,7);ctx.fill();person(S.act.kx,a-40,"#ffb020",performance.now()/1000,S.act.kw,1)},
   ok(t,dt){const g=geo();S.speed=0;S.brake=t<2.4;if(S.act.bx>g.cx+40)S.act.bx-=90*dt;if(t>.4&&t<1.2){S.act.kw=1;S.act.kx=ramp(S.act.kx,S.act.bx+14,4,dt)}else if(t>=1.2){if(!S.act.said){S.act.said=1;say("¡Gracias! 👋",()=>[S.act.kx,S.a-70],1.3)}S.act.bx=S.act.kx-8;S.act.kx=ramp(S.act.kx,g.cx+150,3,dt)}if(t>2.3){S.brake=0;S.speed=CR*.7}},
   ko(t,dt){const g=geo();S.speed=ramp(S.speed,CR,3,dt);S.act.bx-=140*dt;if(t>.25&&t<.7){S.act.kw=1;S.act.kx-=110*dt}else if(t>=.7){S.act.kx=ramp(S.act.kx,g.cx+160,6,dt);if(!S.act.said){S.act.said=1;SFX.screech();say("¡MI BALÓN!",()=>[S.act.kx,S.a-70],1.2,"#ffd4cc")}}
    S.carX=g.RX-70*Math.sin(Math.PI*Math.min(1,Math.max(0,(S.a-(g.carY-200))/300)));S.carA=-(S.carX-g.RX)/600},
   miss:a=>a>geo().carY-20},
  luces:{rel:1,init(){S.night=0;S.beam="long";S.act={y:-120,x:geo().LX,glare:0,said:0}},
   approach(dt){S.night=Math.min(1,S.night+dt*1.5);S.act.y=ramp(S.act.y,geo().carY-280,1.3,dt);S.a=S.act.y;return Math.abs(S.act.y-(geo().carY-280))<3},
   draw(){car(S.act.x,S.act.y,"#e0a800",S.act.a||0,{flip:1})},
   lights(){ctx.globalCompositeOperation="lighter";const gr=ctx.createRadialGradient(S.act.x,S.act.y+80,5,S.act.x,S.act.y+80,90);gr.addColorStop(0,"rgba(255,240,180,.35)");gr.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation="source-over";if(S.act.glare){ctx.fillStyle="rgba(255,255,230,"+S.act.glare*.5+")";ctx.beginPath();ctx.arc(S.act.x,S.act.y,60,0,7);ctx.fill()}},
   ok(t,dt){S.beam="short";S.speed=CR*.8;S.act.y+=360*dt},
   ko(t,dt){const g=geo();S.beam="long";S.speed=CR*.8;S.act.y+=330*dt;S.act.glare=Math.min(1,t*2);if(t>.3&&t<1.3){S.act.x=g.LX+38*Math.sin((t-.3)*Math.PI);S.act.a=Math.sin((t-.3)*Math.PI*2)*.3}else S.act.a=0;if(!S.act.said&&t>.3){S.act.said=1;SFX.honk();say("😵 ¡QUE ME DESLUMBRAS!",()=>[S.act.x,S.act.y-40],1.4,"#ffd4cc")}},
   miss:()=>S.act.y>geo().carY-60}
 };
 SC.stop=Object.assign({},SC.cruce,{init(){SC.cruce.init("stop")}});
 SC.semaforo=Object.assign({},SC.cruce,{init(){SC.cruce.init("semaforo")}});
 SC.glorieta=Object.assign({},SC.cruce,{init(){SC.cruce.init("glorieta")}});
 SC.derecha=Object.assign({},SC.cruce,{init(){SC.cruce.init("none",-1)}});
 SC.ambar=Object.assign({},SC.cruce,{init(){SC.cruce.init("semaforo",1,1)}});
 SC.ceda=Object.assign({},SC.cruce,{init(){SC.cruce.init("none",1)}});
 SC.senal={stop:0,init(q){SC.senal.stop=q.okA==="turn"?1:0;S.act={side:q.okA==="turn",on:null,truck:null,pol:null,said:0,miss:0}},
  draw(a,{cx}){const A=S.act;if(A.side){ctx.fillStyle="#3b3f46";ctx.fillRect(cx+116,a-140,W,120);ctx.fillStyle="#fff";for(let x=cx+150;x<W;x+=60)ctx.fillRect(x,a-82,30,4)}
   if(A.on)car(A.on.x,A.on.y,"#e0a800",0,{flip:1});if(A.truck)truck(geo().RX,A.truck);if(A.pol)car(A.pol.x,A.pol.y,"#f4f4f4",0,{siren:Math.sin(performance.now()/90)})},
  ok(t,dt){const g=geo(),A=S.act,q=S.q;
   if(q.okA==="turn"){S.brake=t<.5;if(t<.5)S.speed=0;else if(S.a<g.carY+80){S.speed=200}else{S.speed=0;S.hold=1;S.carA=ramp(S.carA,Math.PI/2,5,dt);if(S.carA>.6)S.carX+=300*dt}}
   else{S.speed=ramp(S.speed,q.okA==="slow"?CR*.45:CR*.85,2.5,dt);S.brake=q.okA==="slow"&&t<.8}
   if(!A.said){A.said=1;say(q.okA==="turn"?"✔ Me desvío":q.okA==="slow"?"✔ Despacito":"✔ Entendido",()=>[S.carX,geo().carY-46],1.4,"#d8f5e2")}},
  ko(t,dt){const g=geo(),A=S.act,k=S.q.koA;
   if(k==="contra"){S.speed=CR;if(!A.on)A.on={x:g.RX,y:-110};A.on.y+=520*dt;const near=A.on.y>g.carY-330&&A.on.y<g.carY+60;S.carX=ramp(S.carX,near?g.LX:g.RX,6,dt);S.carA=(g.RX-S.carX)/-700*(near?1:-1);if(A.on.y>g.carY-90&&!A.miss){A.miss=1;SFX.honk();SFX.screech();say("¡PIIIII!",()=>[A.on.x,A.on.y-40],1.3,"#ffd4cc")}}
   else if(k==="skid"){S.speed=ramp(S.speed,t<1.4?CR*1.3:CR*.6,2,dt);if(t>.3&&t<1.6){const d=Math.max(0,1.6-t);S.carA=Math.sin(t*12)*.35*d;S.carX=ramp(S.carX,t<1?g.cx+102:g.RX,3,dt);if(Math.random()<.4)puff(S.carX,g.carY+30,1,"#e6e6e6",30,5);S.shake=3}if(t>.3&&!A.said){A.said=1;SFX.screech()}if(t>.9)A.miss=1}
   else if(k==="park"){S.speed=ramp(S.speed,0,2.2,dt);S.carX=ramp(S.carX,g.cx+95,3,dt);if(t>1){if(!A.pol)A.pol={x:g.LX,y:H+80};A.pol.y=ramp(A.pol.y,g.carY+10,3,dt);if(!A.said){A.said=1;SFX.siren(1);say("🚨 ¡Multa! Aquí no",()=>[A.pol.x,A.pol.y-46],1.6,"#ffd4cc")}if(t>1.2)A.miss=1}}
   else if(k==="slowhonk"){S.speed=ramp(S.speed,CR*.12,3,dt);if(A.truck==null)A.truck=H+140;A.truck=ramp(A.truck,g.carY+170,2.5,dt);if(t>.9&&!A.said){A.said=1;SFX.honk();say("¡PIII! ¡Muévete!",()=>[g.RX,A.truck-140],1.5,"#ffd4cc");A.miss=1}}
   else{S.speed=ramp(S.speed,CR*.7,2,dt);if(!A.pol)A.pol={x:g.LX,y:H+80};A.pol.y-=260*dt;if(t>.8&&!A.said){A.said=1;SFX.siren(1);say("🚨 ¡Multa! Por ahí no",()=>[A.pol.x,A.pol.y-46],1.6,"#ffd4cc");A.miss=1}}},
  miss:()=>S.act.miss};

 /* ---------- Bucle ---------- */
 let onApproach=null,resolve=null,missDone=false;
 function loop(now){
  if(!alive)return;const dt=Math.min(.05,(now-(lastT||now))/1000);lastT=now;
  const g=geo(),sc=S.sc&&SC[S.sc];
  if(S.phase==="approach"&&sc){
   if(sc.rel){S.speed=ramp(S.speed,S.sc==="adelantar"?CR*.8:CR,2,dt);if(sc.approach(dt)){S.phase="ask";S.asked=1;S.signY=S.a-60;S.signW=S.world;onApproach&&onApproach()}}
   else{const target=sc.stop?g.carY-118:g.carY-190;const d=target-S.a;S.speed=sc.stop?Math.min(CR,Math.max(0,d*2.2)):CR;S.brake=sc.stop&&d<150;if(d<2){S.phase="ask";S.speed=sc.stop?0:S.speed;onApproach&&onApproach()}}
  }else if(S.phase==="drive"){S.speed=ramp(S.speed,CR,1.5,dt);S.brake=0}
  else if(S.phase==="res"&&resolve){S.t+=dt;resolve(S.t,dt)}
  else if(S.phase==="crash"){S.t+=dt;crashStep(S.t,dt)}
  if(S.phase!=="ask"){S.world+=S.speed*dt;if(sc&&!sc.rel)S.a+=S.speed*dt}
  if(S.phase!=="ask"){S.parts.forEach(p=>{p.x+=p.vx*dt;p.y+=(p.vy+S.speed)*dt;p.vx*=.97;p.vy*=.97;p.life-=dt});S.parts=S.parts.filter(p=>p.life>0);S.bub.forEach(b=>b.life-=dt);S.bub=S.bub.filter(b=>b.life>0)}
  if(S.damage>=2&&!S.wreck&&Math.random()<dt*8)S.parts.push({x:S.carX+(Math.random()-.5)*14,y:g.carY-30,vx:(Math.random()-.5)*30,vy:-40,r:5+Math.random()*5,c:"rgba(90,90,90,.6)",life:1,max:1.4});
  S.flash=Math.max(0,S.flash-dt*2.2);S.shake=Math.max(0,S.shake-dt*20);
  if(S.phase!=="res"&&S.phase!=="crash"&&!S.hold){S.carX=ramp(S.carX,g.RX,3,dt);S.carA=ramp(S.carA,0,4,dt)}
  $("gvKmh").textContent=S.phase==="res"&&S.kmhOver!=null?S.kmhOver:Math.round(S.speed*.36);
  engineSet(S.phase==="ask"?40:S.speed);
  frame();raf=requestAnimationFrame(loop);
 }
 function crashStep(t,dt){const g=geo();if(t<.9){S.speed=ramp(S.speed,0,1.5,dt);S.carA+=dt*14*(1-t);S.carX=ramp(S.carX,g.cx+100,2.5,dt);if(Math.random()<.5)puff(S.carX,g.carY,2,"#d0d0d0",80,6)}else{S.speed=0;if(!S.wreck){S.wreck=true;S.shake=22;SFX.crash();puff(S.carX,g.carY-20,40,"#ffb020",220,9);puff(S.carX,g.carY-20,30,"#666",140,12);stamp("SINIESTRO TOTAL","bad")}if(Math.random()<.4)S.parts.push({x:S.carX,y:g.carY-20,vx:(Math.random()-.5)*20,vy:-60,r:10,c:"rgba(60,60,60,.55)",life:2,max:2})}}

 /* ---------- UI / flujo ---------- */
 let deck=[],qi=0,fails=[],typing=0,advance=null,timer=0,clock=0,examEnd=0,over=false,order=[];
 function stamp(txt,cls){const b=$("gvStampBox");b.innerHTML="";const d=document.createElement("div");d.className="gv-stamp "+(cls||"");d.textContent=txt;b.appendChild(d);setTimeout(()=>{if(d.parentNode&&txt!=="SINIESTRO TOTAL")d.remove()},1500)}
 function lives(){$("gvLives").innerHTML=Array.from({length:ALLOWED},(_,i)=>`<span class="${i<S.damage?"off":""}"></span>`).join("")+(S.damage===ALLOWED?`<b class="gv-warn">¡Último aviso!</b>`:"");$("gvLives").setAttribute("aria-label",`Fallos: ${S.damage}. Se permiten ${ALLOWED}`)}
 function prog(){const p=qi/ROUND*100;$("gvProg").style.width=p+"%";$("gvCar").style.left=p+"%";$("gvTramo").textContent=`Tramo ${Math.min(qi+1,ROUND)}/${ROUND}`}
 function talk(html,done,speed=18){clearInterval(typing);const el=$("gvTxt"),tmp=document.createElement("div");tmp.innerHTML=html;const full=tmp.textContent;let i=0;$("gvCono").classList.add("talk");el.textContent="";
  const finish=()=>{clearInterval(typing);typing=0;el.innerHTML=html;$("gvCono").classList.remove("talk");done&&done()};
  advance=()=>finish();
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return finish();
  typing=setInterval(()=>{i+=2;el.textContent=full.slice(0,i);if(i%6===0)SFX.blip();if(i>=full.length)finish()},speed)}
 function nextBtn(label,fn){$("gvUI").innerHTML=`<button type="button" class="gv-next" id="gvNext">${esc(label)}</button>`;const b=$("gvNext");b.onclick=()=>{advance=null;fn()};advance=()=>b.click();b.focus({preventScroll:true})}
 const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};

 function intro(){resetScene();S.damage=0;size();S.carX=geo().RX;S.phase="drive";lives();qi=0;prog();$("gvStampBox").innerHTML="";
  $("gvUI").innerHTML="";
  talk("¡Hola! Soy el <b>Profe Cono</b> y esto es el <b>examen teórico de verdad</b>: 30 preguntas, 30 minutos y como mucho <b>3 fallos</b>. Pero aquí <b>cada respuesta mueve el coche</b>: si aciertas, conduces de lujo; si fallas, el coche hace una locura. Y al <b>4.º fallo</b>… siniestro total. Hay <b>"+QS.length+" preguntas</b> y te saco primero las que aún no has visto (te quedan "+(QS.length-seenGet().length)+").",()=>nextBtn("Empezar el examen",start));}
 function start(){const tt=$("gvTitle");if(tt){tt.style.opacity=0;tt.style.pointerEvents="none"}deck=pickDeck();qi=0;fails=[];over=false;S.damage=0;S.wreck=false;lives();A();
  examEnd=Date.now()+EXAM_MIN*60000;clearInterval(clock);const tick=()=>{const ms=Math.max(0,examEnd-Date.now()),m=Math.floor(ms/60000),sec=Math.floor(ms/1000)%60;$("gvClock").textContent=`${m}:${String(sec).padStart(2,"0")}`;$("gvClock").classList.toggle("low",ms<180000);if(ms<=0&&!over)timeUp()};tick();clock=setInterval(tick,500);scene()}
 function seenGet(){const v=api.store.get("gv-seen");return Array.isArray(v)?v:[]}
 function seenAdd(id){let v=seenGet();if(!v.includes(id))v.push(id);if(v.length>=QS.length)v=[];api.store.set("gv-seen",v)}
 function pickDeck(){const seen=seenGet(),fresh=shuffle(QS.filter(q=>!seen.includes(q.id))),old=shuffle(QS.filter(q=>seen.includes(q.id)));return shuffle(fresh.slice(0,ROUND).concat(old.slice(0,Math.max(0,ROUND-fresh.length))))}
 function timeUp(){over=true;clearInterval(clock);clearInterval(timer);Object.assign(S,{phase:"drive",sc:null,rain:0,night:0,phone:0});S.speed=0;engineOff();SFX.bad();stamp("TIEMPO AGOTADO","bad");$("gvUI").innerHTML="";
  talk(`<span class="gv-end"><span class="big">NO APTO · Tiempo agotado</span><br>Se acabaron los 30 minutos en el tramo ${qi+1}. En el examen real, lo que no contestas cuenta como fallo.</span>`,()=>{$("gvUI").innerHTML=`<div class="gv-end">${recap()}</div><button type="button" class="gv-next" id="gvAgain">Repetir examen</button>`;$("gvAgain").onclick=()=>{resetScene();S.carX=geo().RX;S.phase="drive";$("gvStampBox").innerHTML="";start()};advance=()=>$("gvAgain").click()},12)}
 function scene(){
  const q=deck[qi];prog();Object.assign(S,{q,hold:0,carX:geo().RX,carA:0,signY:0,signW:0,asked:0,sc:q.sc,phase:"drive",night:0,rain:0,solid:false,beam:"long",phone:0,kmhOver:null,a:-220,t:0,bub:[],act:{}});
  $("gvUI").innerHTML="";
  SC[q.sc].init(q);
  if(!SC[q.sc].rel)S.a=-220;
  talk(esc(q.intro),null,16);
  setTimeout(()=>{if(!alive||over)return;S.phase="approach";onApproach=()=>ask(q)},700);
 }
 function ask(q){
  onApproach=null;if(over)return;SFX.blip();
  talk(esc(q.q),()=>{
   order=shuffle(q.o.map((_,i)=>i));
   $("gvUI").innerHTML=(q.sign?`<div class="gv-sign">${signSVG(q.sign)}</div>`:"")+`<div class="gv-opts">${order.map((k,n)=>`<button type="button" class="gv-opt" data-k="${k}"><kbd>${n+1}</kbd><span>${esc(q.o[k])}</span></button>`).join("")}</div>`;
   $("gvUI").querySelectorAll(".gv-opt").forEach(b=>b.onclick=()=>answer(q,+b.dataset.k));
   $("gvUI").querySelector(".gv-opt").focus({preventScroll:true});
  },14);
 }
 function answer(q,k){
  if(S.phase!=="ask"||over)return;clearInterval(timer);advance=null;
  const ok=k===0;$("gvUI").innerHTML="";
  $("gvTxt").textContent=ok?"¡Veamos qué pasa!":k<0?"¡Te has quedado en blanco! Y el coche, sin control…":"Mmm… agárrate.";
  if(!ok){S.damage++;fails.push({q,k});lives()}
  const crash=!ok&&S.damage>ALLOWED,sc=SC[q.sc];S.phase="res";S.t=0;missDone=false;
  resolve=(t,dt)=>{
   (ok?sc.ok:sc.ko)(t,dt);
   if(!ok&&!missDone&&sc.miss(S.a)){missDone=true;if(crash){S.phase="crash";S.t=0}else{stamp("¡POR LOS PELOS!");S.shake=8;SFX.bad()}}
   if(ok&&t>.25&&!missDone){missDone=true;SFX.good()}
   if(t>3.0&&S.phase==="res")finishRes(q,ok,crash);
  };
  if(crash)setTimeout(()=>{if(!alive)return;if(S.phase==="res"){S.phase="crash";S.t=0}setTimeout(()=>alive&&gameOver(q),2400)},1300);
 }
 function finishRes(q,ok,crash){
  if(crash||over)return;S.phase="drive";resolve=null;if(!S.hold)S.carA=0;seenAdd(q.id);
  const html=`${ok?"<b style='color:#18794e'>¡Bien!</b> ":"<b>¡Fallo!</b> "}${esc(ok?q.ok:q.ko)} <span class="gv-rule">${esc(q.rule)}</span>`;
  talk(html,()=>nextBtn(qi+1<ROUND?"Siguiente tramo":"Llegar a destino",()=>{qi++;if(qi<ROUND)scene();else win()}),12);
 }
 function recap(){return fails.length?`<ul>${fails.map(f=>`<li>${f.q.sign?`<span style="display:inline-block;width:44px;height:44px;vertical-align:middle;margin-right:8px">${signSVG(f.q.sign)}</span>`:""}<b>${esc(f.q.q)}</b><br>Correcta: ${esc(f.q.o[0])}. ${esc(f.q.rule)}</li>`).join("")}</ul>`:""}
 function win(){
  over=true;clearInterval(clock);const used=Math.round((EXAM_MIN*60000-(examEnd-Date.now()))/60000);
  qi=ROUND;prog();Object.assign(S,{sc:null,phase:"drive",rain:0,night:0,solid:false,phone:0});SFX.win();stamp(fails.length?"¡APTO!":"¡PERFECTO!","good");
  const best=api.store.get("gv-best")||0,score=ROUND-fails.length;if(score>best)api.store.set("gv-best",score);
  $("gvUI").innerHTML="";
  talk(`<span class="gv-end"><span class="big">Has llegado a destino</span><br><b style="color:#18794e">APTO</b> con ${fails.length} ${fails.length===1?"fallo":"fallos"} de ${ROUND} en unos ${Math.max(1,used)} min. ${fails.length?"El Profe Cono te firma el apto, pero repasa esto:":"Cero fallos: el Profe Cono se ha emocionado."}</span>`,()=>{
   $("gvUI").innerHTML=`<div class="gv-end">${recap()}</div><button type="button" class="gv-next" id="gvAgain">Otra ruta</button>`;$("gvAgain").onclick=start;$("gvAgain").textContent="Repetir examen";advance=()=>$("gvAgain").click()},12);
 }
 function gameOver(q){
  if(over)return;over=true;clearInterval(clock);resolve=null;engineOff();
  talk(`<span class="gv-end"><span class="big">NO APTO · Siniestro total</span><br>Cuarto fallo en el tramo ${qi+1}: en el examen real solo se permiten 3. Tranquilidad: aquí nadie sale herido, salvo tu orgullo. Antes de la revancha, repasa esto:</span>`,()=>{
   $("gvUI").innerHTML=`<div class="gv-end">${recap()}</div><button type="button" class="gv-next" id="gvAgain">Revancha</button>`;$("gvAgain").onclick=()=>{resetScene();S.carX=geo().RX;S.phase="drive";$("gvStampBox").innerHTML="";start()};advance=()=>$("gvAgain").click()},12);
 }

 function onKey(e){if(!alive)return;if(S.phase==="ask"&&/^[1-3]$/.test(e.key)){const b=$("gvUI").querySelectorAll(".gv-opt")[+e.key-1];if(b){e.preventDefault();b.click()}return}
  if((e.key==="Enter"||e.key===" ")&&advance&&!(e.target&&e.target.closest&&e.target.closest("button"))){e.preventDefault();advance()}}
 document.addEventListener("keydown",onKey);
 $("gvTxt").parentNode.addEventListener("click",e=>{if(!e.target.closest("button")&&typing&&advance)advance()});

 resetScene();size();S.carX=geo().RX;intro();raf=requestAnimationFrame(loop);
 return function stop(){alive=false;cancelAnimationFrame(raf);clearInterval(timer);clearInterval(clock);clearInterval(typing);ro.disconnect();document.removeEventListener("keydown",onKey);engineOff();try{ac&&ac.close()}catch(e){}};
};
})();
