export type ColorSpec = {
  primary: string;
  secondary: string;
  tertiary: string;
  inverse?: string;
};

type ButtonSpec = {
  primary: {
    text: string;
    background: string;
  };
  secondary: {
    text: string;
    background: string;
  };
};

export type TemplateColorTokens = {
  background: ColorSpec;
  text: ColorSpec;
  button: ButtonSpec;
};

// type KeyColorSpec = keyof ColorSpec;

// type ButtonSpec<T> = {
//   [K in keyof T]: {
//     text: string;
//     background: string;
//   };
// };

// versi ringkas
// export type TemplateColorTokens = {
//   background: ColorSpec;
//   text: ColorSpec;
//   button: ButtonSpec<Omit<KeyColorSpec, "tertiary" | "inverse">>;
// };

export type TextTransform = "none" | "uppercase" | "capitalize" | "lowercase";

export type FontSpec = {
  family: string;
  size: string;
  weight: number;
  transform: TextTransform;
};

export type TemplateTypographyTokens = {
  // display: FontSpec;
  heading: FontSpec;
  body: FontSpec;
};

export type TemplateTokens = {
  template: string;
  name: string;
  colors: TemplateColorTokens;
  typography: TemplateTypographyTokens;
};

export type TemplateTokenOverrides = {
  colors?: {
    background?: Partial<ColorSpec>;
    text?: Partial<ColorSpec>;
    button?: {
      primary?: Partial<ButtonSpec["primary"]>;
      secondary?: Partial<ButtonSpec["secondary"]>;
    };
  };
  typography?: {
    display?: Partial<FontSpec>;
    heading?: Partial<FontSpec>;
    body?: Partial<FontSpec>;
  };
};
