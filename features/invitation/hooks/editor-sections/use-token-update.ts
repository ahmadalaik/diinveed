import { useInvitationStore } from "../../store/invitation-store";
import {
  TemplateTokenOverrides,
  TemplateColorTokens,
  FontSpec,
  getTemplateTokens,
  mergeTemplateTokenOverrides,
} from "@/features/template/tokens";

export function useTokenUpdate() {
  const overrides = useInvitationStore((s) => s.tokenOverrides);
  const templateSlug = useInvitationStore((s) => s.templateSlug);
  const set = useInvitationStore((s) => s.set);

  const baseTokens = getTemplateTokens(templateSlug);
  const resolvedTokens = mergeTemplateTokenOverrides(baseTokens, overrides);

  const updateColor = <K extends keyof TemplateColorTokens>(
    group: K,
    key: keyof TemplateColorTokens[K],
    value: string,
  ) => {
    const currentColors = overrides?.colors || {};
    const currentGroup = currentColors[group] || {};
    set({
      tokenOverrides: {
        ...overrides,
        colors: {
          ...currentColors,
          [group]: {
            ...currentGroup,
            [key]: value,
          },
        },
      },
    });
  };

  const resetColorGroup = (group: keyof TemplateColorTokens) => {
    const currentColors = overrides?.colors || {};
    const { [group]: _removed, ...rest } = currentColors;

    set({
      tokenOverrides: {
        ...overrides,
        colors: Object.keys(rest).length > 0 ? rest : undefined,
      },
    });
  };

  const updateTypography = (
    group: keyof NonNullable<TemplateTokenOverrides["typography"]>,
    key: keyof FontSpec,
    value: string | number,
  ) => {
    const currentTypography = overrides?.typography || {};
    const currentGroup = currentTypography[group] || {};

    set({
      tokenOverrides: {
        ...overrides,
        typography: {
          ...currentTypography,
          [group]: {
            ...currentGroup,
            [key]: value,
          },
        },
      },
    });
  };

  const resetTypographyGroup = (
    group: keyof NonNullable<TemplateTokenOverrides["typography"]>,
  ) => {
    const currentTypography = overrides?.typography || {};
    const { [group]: _removed, ...rest } = currentTypography;

    set({
      tokenOverrides: {
        ...overrides,
        typography: Object.keys(rest).length > 0 ? rest : undefined,
      },
    });
  };

  return {
    resolvedTokens,
    overrides,
    updateColor,
    resetColorGroup,
    updateTypography,
    resetTypographyGroup,
  };
}
