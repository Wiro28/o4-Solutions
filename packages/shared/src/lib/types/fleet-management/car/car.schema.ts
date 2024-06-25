export const CarSchema = {
  type: 'object',
  properties: {
    vehicleId: {
      type: 'string',
      format: 'uuid',
      $id: '/definitions/fleet-management/car/car:vehicleId',
      title: 'Vehicle Id',
    },
    brand: {
      type: 'string',
      $id: '/definitions/fleet-management/car/car:brand',
      title: 'Brand',
    },
    model: {
      type: 'string',
      $id: '/definitions/fleet-management/car/car:model',
      title: 'Model',
    },
    productionYear: {
      type: 'integer',
      minimum: 1900,
      $id: '/definitions/fleet-management/car/car:productionYear',
      title: 'Production Year',
    },
    completed: {
      type: 'boolean',
      $id: '/definitions/fleet-management/car/car:completed',
      title: 'Completed',
    },
  },
  required: ['vehicleId', 'brand', 'model'],
  additionalProperties: false,
  $id: '/definitions/fleet-management/car/car',
  title: 'Car',
} as const;
