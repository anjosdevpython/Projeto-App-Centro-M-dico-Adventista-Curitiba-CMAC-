import type {
  ConfirmedOperation,
  SlotHold,
  SoulMvPort,
} from './port.js';

interface AuthorizedHomologationConfig {
  baseUrl: string;
  authToken: string;
  documentedPaths: {
    specialties: string;
    professionals: string;
    locations: string;
    slots: string;
    holds: string;
    bookings: string;
    operations: string;
    cancellations: string;
    reschedules: string;
  };
}

export class HttpSoulMvAdapter implements SoulMvPort {
  constructor(private readonly config: AuthorizedHomologationConfig) {
    if (
      !config?.baseUrl?.startsWith('https://') ||
      !config.authToken ||
      !config.documentedPaths
    ) {
      throw new Error(
        'Integração real indisponível: configuração autorizada de homologação ausente.',
      );
    }
  }

  listSpecialties(): never {
    throw this.notMapped();
  }
  listProfessionals(): never {
    throw this.notMapped();
  }
  listLocations(): never {
    throw this.notMapped();
  }
  listSlots(): never {
    throw this.notMapped();
  }
  holdSlot(): Promise<SlotHold> {
    throw this.notMapped();
  }
  confirmBooking(): Promise<ConfirmedOperation> {
    throw this.notMapped();
  }
  getOperationStatus(): Promise<ConfirmedOperation | { status: 'unknown' }> {
    throw this.notMapped();
  }
  cancelAppointment(): Promise<ConfirmedOperation> {
    throw this.notMapped();
  }
  rescheduleAppointment(): Promise<ConfirmedOperation> {
    throw this.notMapped();
  }
  private notMapped(): Error {
    return new Error(
      'Contrato SOUL MV real ainda não foi mapeado a partir da documentação autorizada.',
    );
  }
}
