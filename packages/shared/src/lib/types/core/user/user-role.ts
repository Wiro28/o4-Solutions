export const UserRoles = ['Anyone', 'Admin', 'Fleet manager'] as const;

export type UserRole = (typeof UserRoles)[number];
