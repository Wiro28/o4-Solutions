export const CarListSchema = {
  type: 'array',
  items: {
    $ref: '/definitions/fleet-management/car/car',
  },
  $id: '/definitions/fleet-management/car/car-list',
  title: 'Car List',
} as const;
