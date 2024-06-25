export const CarAddedToFleetSchema = {
  type: 'object',
  properties: {
    vehicleId: {
      type: 'string',
      format: 'uuid',
      title: 'Vehicle Id',
    },
  },
  required: ['vehicleId'],
  additionalProperties: false,
  $id: '/definitions/fleet-management/car/car-added-to-fleet',
  title: 'Car Added To Fleet',
} as const;
