export type DeliveredVehicle = {
  id: string
  name: string
  brand: string
  image?: string
  year?: number
  specs?: string
}

export const deliveredVehicles: DeliveredVehicle[] = [
  { id: '1', name: 'VOLVO FM12 440 HORMIGONERA 8X4', brand: 'VOLVO', image: '/images/delivered/delivered-01.png', specs: '8x4 · Hormigonera' },
  { id: '2', name: 'SCANIA G400 CAJA CERRADA', brand: 'SCANIA', image: '/images/delivered/delivered-02.png', specs: 'Caja Cerrada' },
  { id: '3', name: 'IVECO STRALIS 500 6X2 EURO 5', brand: 'IVECO', image: '/images/delivered/delivered-03.png', specs: '6x2 · Euro 5' },
  { id: '4', name: 'MERCEDES 1844 CAJA PEZZAIOLI', brand: 'MERCEDES', image: '/images/delivered/delivered-04.png', specs: 'Caja Pezzaioli' },
  { id: '5', name: 'MB 2550 V8', brand: 'MERCEDES', image: '/images/delivered/delivered-05.png', specs: 'V8' },
  { id: '6', name: 'DAF XF 510 RETARDER SUPERSPACE CAB', brand: 'DAF', image: '/images/delivered/delivered-06.png', specs: 'Retarder · Superspace Cab' },
  { id: '7', name: 'DAF XF 460 RETARDER', brand: 'DAF', image: '/images/delivered/delivered-07.png', specs: 'Retarder' },
  { id: '8', name: 'VOLVO FH13 540', brand: 'VOLVO', image: '/images/delivered/delivered-08.png', year: 2013, specs: 'FH13 540' },
  { id: '9', name: 'DAF 460 SPECIAL EDITION', brand: 'DAF', specs: 'Special Edition' },
  { id: '10', name: 'PEZZAIOLI SBA31U', brand: 'PEZZAIOLI', specs: 'SBA31U' },
  { id: '11', name: 'D-TEC', brand: 'D-TEC', image: '/images/delivered/delivered-dtec.png' },
  { id: '12', name: 'MERCEDES ANTOS PORTA COCHES', brand: 'MERCEDES', specs: 'Porta Coches' },
]
