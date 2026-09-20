/**
 * The twelve vehicles TrucksLeón published at trucksleon.com/catalogo.
 *
 * Every photograph, category and description below was taken from that
 * catalogue's own product pages — these are the company's real operations.
 * The previous artwork in public/images/delivered/ was generic stock imagery
 * of unrelated vehicles (a Sprinter van filed under "SCANIA G400", a Mercedes
 * livestock truck under "IVECO STRALIS", and so on) and has been replaced.
 *
 * `description` is reproduced from the source listing where one exists; seven
 * of the twelve pages carry no description and are left without one rather
 * than invented. Origin/destination details inside them are the company's own
 * wording.
 */

export type DeliveredVehicle = {
  id: string
  name: string
  brand: string
  /** Card cover. */
  image?: string
  /** Full gallery, cover first. Absent when the source had a single usable shot. */
  images?: string[]
  year?: number
  specs?: string
  /** Category as filed in the original catalogue. */
  category?: string
  /** Verbatim from the source listing, where the listing had one. */
  description?: string
}

const g = (base: string, n: number): string[] =>
  Array.from({ length: n }, (_, i) =>
    i === 0 ? `/images/delivered/${base}.webp` : `/images/delivered/${base}-${i + 1}.webp`
  )

export const deliveredVehicles: DeliveredVehicle[] = [
  {
    id: '1',
    name: 'VOLVO FM12 440 HORMIGONERA 8X4',
    brand: 'VOLVO',
    image: '/images/delivered/volvo-fm12-hormigonera.webp',
    images: g('volvo-fm12-hormigonera', 5),
    specs: '8x4 · Hormigonera',
    category: 'Hormigoneras',
    description:
      'VOLVO FM12 440 HORMIGONERA 8X4, CUBA 12M3. TRAMITADO Y GESTIONADO EN BELGICA EXCL. PARA CLIENTE Y EMPRESA EN ASTURIAS - LEON',
  },
  {
    id: '2',
    name: 'SCANIA G400 CAJA CERRADA',
    brand: 'SCANIA',
    image: '/images/delivered/scania-g400.webp',
    images: g('scania-g400', 4),
    specs: 'Caja Cerrada',
    category: 'Camiones caja cerrada',
    description:
      'SCANIA G400, FRENO CON RETARDER - RETARDOR, CAJA CERRADA CON TRAMPILLA TRASERA HIDRAULICA. COMPRA EN PAISES BAJOS EXCL. PARA EMPRESA EN MALAGA. TRAMITADO Y GESTIONADO CON Y PARA EL CLIENTE. (TRAMITACION EXPRESS)',
  },
  {
    id: '3',
    name: 'IVECO STRALIS 500 6X2 EURO 5',
    brand: 'IVECO',
    image: '/images/delivered/iveco-stralis-500.webp',
    images: g('iveco-stralis-500', 6),
    specs: '6x2 · Euro 5',
    category: 'Cabezas tractoras',
    description:
      'IVECO STRALIS 500 6X2, TRUCK OF THE YEAR 2013 VERSION SPECIAL HI - WAY CON EXTRAS, EMISIONES MOTOR EURO EEV, RETARDER, EJE ELEVABLE Y DIRECCIONAL, GESTIONADO Y TRAMITADO EXCL. PARA CLIENTE EN LA CUEVA (MURCIA)',
  },
  {
    id: '4',
    name: 'MERCEDES 1844 CAJA PEZZAIOLI',
    brand: 'MERCEDES',
    image: '/images/delivered/mercedes-1844-pezzaioli.webp',
    images: g('mercedes-1844-pezzaioli', 4),
    specs: 'Caja Pezzaioli',
    category: 'Camiones ganaderos',
    description:
      'MERCEDES 1844, FRENO CON RETARDER - RETARDOR, CAJA PEZZAIOLI DE DOS PISOS HIDRAULICOS Y TECHO ELEVABLE, JAULA GANADERA PARA TRANSPORTE DE VACUNO APTO PARA DOS PISOS DE VACAS O TERNEROS. TRAMITADO Y GESTIONADO DESDE ALEMANIA - AUSTRIA, EXCL. PARA CLIENTE EN ABEGONDO (LA CORUÑA)',
  },
  {
    id: '5',
    name: 'MB 2550 V8',
    brand: 'MERCEDES',
    image: '/images/delivered/mercedes-2550-v8.webp',
    images: g('mercedes-2550-v8', 2),
    specs: 'V8',
    category: 'Camiones ganaderos',
    description:
      'MERCEDES 2550 V8, FRENO CON RETARDER - RETARDOR, TERCER EJE ELEVABLE Y DIRECCIONAL, CAJA MENKEN (ALEMANA) DE TRES PISOS Y TECHO ELEVABLE, JAULA GANADERA PARA TRANSPORTE DE VACUNO, BOVINO, PORCINO ETC. TRAMITADO Y GESTIONADO DESDE ALEMANIA, EXCL. CON Y PARA CLIENTE EN PUERTO LLANO (CIUDAD REAL)',
  },
  {
    id: '6',
    name: 'DAF XF 510 RETARDER SUPERSPACE CAB',
    brand: 'DAF',
    image: '/images/delivered/daf-xf-510-superspace.webp',
    images: g('daf-xf-510-superspace', 3),
    specs: 'Retarder · Superspace Cab',
    category: 'Cabezas tractoras',
  },
  {
    id: '7',
    name: 'DAF XF 460 RETARDER',
    brand: 'DAF',
    image: '/images/delivered/daf-xf-460-retarder.webp',
    images: g('daf-xf-460-retarder', 3),
    specs: 'Retarder',
    category: 'Cabezas tractoras',
  },
  {
    id: '8',
    name: 'VOLVO FH13 540',
    brand: 'VOLVO',
    image: '/images/delivered/volvo-fh13-540.webp',
    images: g('volvo-fh13-540', 4),
    year: 2013,
    specs: 'FH13 540',
    category: 'Cabezas tractoras',
  },
  {
    id: '9',
    name: 'DAF 460 SPECIAL EDITION',
    brand: 'DAF',
    image: '/images/delivered/daf-460-special-edition.webp',
    images: g('daf-460-special-edition', 5),
    specs: 'Special Edition',
    category: 'Cabezas tractoras',
  },
  {
    id: '10',
    name: 'PEZZAIOLI SBA31U',
    brand: 'PEZZAIOLI',
    image: '/images/delivered/pezzaioli-sba31u.webp',
    images: g('pezzaioli-sba31u', 3),
    specs: 'SBA31U',
    category: 'Semiremolques ganaderos',
  },
  {
    id: '11',
    name: 'D-TEC',
    brand: 'D-TEC',
    image: '/images/delivered/dtec-extensible.webp',
    images: g('dtec-extensible', 2),
    specs: 'Semirremolque extensible',
    category: 'Semiremolques extensibles',
  },
  {
    id: '12',
    name: 'MERCEDES ANTOS PORTA COCHES',
    brand: 'MERCEDES',
    image: '/images/delivered/mercedes-antos-portacoches.webp',
    images: g('mercedes-antos-portacoches', 4),
    specs: 'Porta Coches',
    category: 'Portacoches',
  },
]
