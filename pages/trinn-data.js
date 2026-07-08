/* ================================================================
   TRINN_BAND_DATA - zentrale Inhalte für alle 5 Bände der Reihe.

   Wird von trinn.html UND den 4 Vorlagen-Seiten eingebunden:
   kurzbeschreibung.html, leseprobe.html, charaktere.html,
   hinter-den-kulissen.html - so muss jeder Text nur an EINER
   Stelle gepflegt werden, egal auf wie vielen Seiten er erscheint.

   Aufbau pro Band:
     title / subtitle   -> Buchtitel, wie im Cover/TOC angezeigt
     cover               -> Pfad zum Cover-Bild (Platzhalter-Namen
                            TrinnBd1.png ... TrinnBd5.png sind schon
                            vorgesehen, auch wenn die Bilder noch
                            nicht alle existieren - fehlt eine Datei,
                            zeigt die Seite automatisch einen
                            Platzhalter-Rahmen mit dem Bandnamen an)
     kurzbeschreibung    -> Array von Absätzen (Klappentext)
     charaktere          -> Array von { media, mediaType, flip, heading, text }
     leseprobe           -> Array von Absätzen (Lesetext); Platzhalter,
                            solange noch keine echte Leseprobe vorliegt
     hinterDenKulissen   -> Array von Absätzen (Entstehung & Inspiration)
     kaufenUrl           -> Link zur Verlags-/Kaufseite (extern, neuer Tab)

   NEUEN BAND-INHALT ERGÄNZEN: einfach beim jeweiligen Band die Arrays
   erweitern bzw. die Platzhaltertexte ersetzen - keine andere Datei
   muss dafür angefasst werden.
   ================================================================ */
const TRINN_BAND_DATA = {
  1: {
    title: 'Trinn',
    subtitle: 'Sohn des Werwolfjägers',
    cover: '../img/trinn/TrinnBd1.png',
    kurzbeschreibung: [
      'Erik wird durch einen Biss zum Werwolf. Nur sein bester Freund Finn kennt sein Geheimnis. Gemeinsam setzen sie alles daran, dass niemand davon erfährt.',
      'Doch schon bald merken die beiden, dass ihr Geheimnis ungeahnte Gefahren mit sich bringt und hinter allem viel mehr steckt, als sie sich jemals hätten vorstellen können.',
      'Ein spannendes Abenteuer voller Freundschaft, Magie und Geheimnisse.'
    ],
    charaktere: [
      {
        media: '../img/trinn/ErikLeer.png',
        mediaType: 'image',
        flip: false,
        heading: 'Erik Jäger (13)',
        text: 'Naturfreund mit Chaos-Talent\n\n' +
              'Erik liebt den Wald mehr als Mathehausaufgaben. Wenn andere schlafen, sitzt er manchmal heimlich auf einem Jägerstand und beobachtet Rehe, Füchse oder Hirsche.\n\n' +
              'Ordnung? Hält er für völlig überbewertet. Sein Lieblingsspruch lautet: "Nur Idioten halten Ordnung. Das Genie beherrscht das Chaos!"\n\n' +
              'Leider sieht sein Zimmer oft eher nach Naturkatastrophe als nach Genie aus.\n\n' +
              'Mit seinen schwarzen Locken, seiner neugierigen Nase und seinen verrückten Ideen steckt Erik fast immer mitten im nächsten Abenteuer. Zum Glück hat er seinen besten Freund Finn. Die beiden halten zusammen wie Pech und Schwefel.\n\n' +
              'Und bald wird Erik ein Problem bekommen, gegen das selbst ein chaotisches Zimmer harmlos wirkt.'
      },
      {
        media: '../img/trinn/FinnLeer.png',
        mediaType: 'image',
        flip: false,
        heading: 'Finn Montigel (13)',
        text: 'Das wandelnde Lexikon\n\n' +
              'Wenn Finn etwas nicht weiß, findet er es heraus. Und wenn er es danach immer noch nicht weiß, sucht er weiter.\n\n' +
              'Finn liest gern, denkt lieber zweimal nach als einmal zu wenig und hat meistens einen Plan. Das ist auch dringend nötig, denn sein bester Freund Erik stolpert mit erstaunlicher Zuverlässigkeit von einer Schwierigkeit in die nächste.\n\n' +
              'Finn hilft immer, egal ob es um Mathe, knifflige Rätsel oder geheimnisvolle Probleme geht. Auf ihn kann man sich verlassen.\n\n' +
              'Wer eine schwierige Frage hat, fragt Finn.\n' +
              'Wer eine sehr schwierige Frage hat, fragt ebenfalls Finn.\n' +
              'Und wer Erik Jäger heißt, fragt Finn ungefähr fünfmal am Tag.\n\n' +
              'Finn hält sich eigentlich für einen ganz normalen Jungen.\n' +
              'Da irrt er sich gewaltig.'
      }
    ],
    leseprobe: [
      'Die Leseprobe für diesen Band folgt in Kürze.'
    ],
    hinterDenKulissen: [
      'Der Blick hinter die Kulissen für diesen Band folgt in Kürze.'
    ],
    kaufenUrl: '#'
  },
  2: {
    title: 'Band 2',
    subtitle: 'TITEL HIER EINTRAGEN',
    cover: '../img/trinn/TrinnBd2.png',
    kurzbeschreibung: ['HIER KLAPPENTEXT VON BAND 2 EINFÜGEN.'],
    charaktere: [],
    leseprobe: ['Die Leseprobe für diesen Band folgt in Kürze.'],
    hinterDenKulissen: ['Der Blick hinter die Kulissen für diesen Band folgt in Kürze.'],
    kaufenUrl: '#'
  },
  3: {
    title: 'Band 3',
    subtitle: 'TITEL HIER EINTRAGEN',
    cover: '../img/trinn/TrinnBd3.png',
    kurzbeschreibung: ['HIER KLAPPENTEXT VON BAND 3 EINFÜGEN.'],
    charaktere: [],
    leseprobe: ['Die Leseprobe für diesen Band folgt in Kürze.'],
    hinterDenKulissen: ['Der Blick hinter die Kulissen für diesen Band folgt in Kürze.'],
    kaufenUrl: '#'
  },
  4: {
    title: 'Band 4',
    subtitle: 'TITEL HIER EINTRAGEN',
    cover: '../img/trinn/TrinnBd4.png',
    kurzbeschreibung: ['HIER KLAPPENTEXT VON BAND 4 EINFÜGEN.'],
    charaktere: [],
    leseprobe: ['Die Leseprobe für diesen Band folgt in Kürze.'],
    hinterDenKulissen: ['Der Blick hinter die Kulissen für diesen Band folgt in Kürze.'],
    kaufenUrl: '#'
  },
  5: {
    title: 'Band 5',
    subtitle: 'TITEL HIER EINTRAGEN',
    cover: '../img/trinn/TrinnBd5.png',
    kurzbeschreibung: ['HIER KLAPPENTEXT VON BAND 5 EINFÜGEN.'],
    charaktere: [],
    leseprobe: ['Die Leseprobe für diesen Band folgt in Kürze.'],
    hinterDenKulissen: ['Der Blick hinter die Kulissen für diesen Band folgt in Kürze.'],
    kaufenUrl: '#'
  }
};
