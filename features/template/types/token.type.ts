export type BorderRadius = "minimal" | "rounded" | "pill";

export type InvitationToken = {
  theme: string;
  name: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
  };
  typography: {
    heading: string;
    body: string;
  };
};

export type TokenOverrides = {
  colors?: {
    primary?: string;
    accent?: string;
    background?: string;
  };
  typography?: {
    heading?: string;
    body?: string;
  };
  borderRadius?: BorderRadius;
};
