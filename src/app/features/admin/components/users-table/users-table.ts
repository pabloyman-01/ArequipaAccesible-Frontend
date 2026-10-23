import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  UserAvatarTone,
  UserPrimaryAction,
  UserRole,
  UserRow,
  UserStatus,
} from '../../models/user.models';

interface StatusMeta {
  label: string;
  dot: string;
}

const STATUS_META: Record<UserStatus, StatusMeta> = {
  activo: { label: 'Activo', dot: 'bg-green-500' },
  'en-revision': { label: 'En Revisión', dot: 'bg-secondary-container' },
  suspendido: { label: 'Suspendido', dot: 'bg-error' },
  inactivo: { label: 'Inactivo', dot: 'bg-outline' },
};

interface RoleMeta {
  label: string;
  badge: string;
  icon: string;
}

const ROLE_META: Record<UserRole, RoleMeta> = {
  administrador: {
    label: 'Administrador',
    badge: 'bg-primary-container text-on-primary font-bold shadow-sm',
    icon: 'admin_panel_settings',
  },
  ciudadano: {
    label: 'Ciudadano',
    badge: 'bg-green-100 text-green-900 font-semibold',
    icon: 'person',
  },
};

interface AvatarToneMeta {
  background: string;
}

const AVATAR_TONE_META: Record<UserAvatarTone, AvatarToneMeta> = {
  primary: { background: 'bg-primary-fixed text-primary-container' },
  citizen: { background: 'bg-green-100 text-green-800' },
  neutral: { background: 'bg-surface-container-high text-primary-container' },
};

interface PrimaryActionMeta {
  icon: string;
  label: string;
  button: string;
}

const PRIMARY_ACTION_META: Record<UserPrimaryAction, PrimaryActionMeta> = {
  permissions: {
    icon: 'key',
    label: 'Editar Permisos',
    button:
      'bg-surface-container text-outline hover:bg-surface-container-high hover:text-primary-container',
  },
  validate: {
    icon: 'verified_user',
    label: 'Validar Credenciales',
    button: 'bg-surface-container text-secondary hover:bg-secondary hover:text-on-secondary',
  },
};

@Component({
  selector: 'app-users-table',
  imports: [DecimalPipe],
  templateUrl: './users-table.html',
})
export class UsersTable {
  readonly users = input.required<UserRow[]>();
  readonly total = input.required<number>();

  protected statusMeta(status: UserStatus): StatusMeta {
    return STATUS_META[status];
  }

  protected roleMeta(role: UserRole): RoleMeta {
    return ROLE_META[role];
  }

  protected avatarToneMeta(tone: UserAvatarTone): AvatarToneMeta {
    return AVATAR_TONE_META[tone];
  }

  protected primaryActionMeta(action: UserPrimaryAction): PrimaryActionMeta {
    return PRIMARY_ACTION_META[action];
  }
}
