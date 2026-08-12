export type CastMember = {
  id: number;
  name: string;
  character: string | null;
  profile_path: string | null;
  order: number;
};

export type CrewMember = {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
};

export type Credits = {
  cast: CastMember[];
  crew: CrewMember[];
};
