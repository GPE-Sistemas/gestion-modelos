export interface IApplicationChirpstack {
  description?: string;
  id?: string;
  name?: string;
  tags?: Record<string, string>;
  tenantId?: string;
}

export interface ICreateApplicationChirpstack {
  application: {
    description?: string;
    id?: string;
    name?: string;
    tags?: Record<string, string>;
    tenantId?: string;
  };
}
