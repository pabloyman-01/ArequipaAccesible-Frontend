export type UserRole = 'administrador' | 'ciudadano';

export type UserStatus = 'activo' | 'en-revision' | 'suspendido' | 'inactivo';

export type UserAvatarTone = 'primary' | 'citizen' | 'neutral';

export type UserPrimaryAction = 'permissions' | 'validate';

export type UserKpiTone = 'neutral' | 'admin' | 'citizen' | 'verified' | 'pending';

export interface UserKpi {
  id: string;
  label: string;
  value: string;
  emphasis: string;
  caption: string;
  icon: string;
  tone: UserKpiTone;
}

export interface UserJurisdiction {
  area: string;
  sector: string;
  districtKey: string;
}

export interface UserRow {
  key: string;
  name: string;
  initials: string;
  image?: string;
  imageAlt?: string;
  verified: boolean;
  dni: string;
  email: string;
  role: UserRole;
  dependency: string;
  jurisdiction: UserJurisdiction;
  interventions: number;
  interventionLabel: string;
  status: UserStatus;
  avatarTone: UserAvatarTone;
  primaryAction: UserPrimaryAction;
}

export interface UserFilters {
  search: string;
  role: string;
  status: string;
  district: string;
}
