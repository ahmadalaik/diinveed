import {
  useInvitationStore,
  useInvitationStoreApi,
} from "../../store/invitation-store";
import {
  TemplateTokenOverrides,
  TemplateColorTokens,
  FontSpec,
  getTemplateTokens,
  mergeTemplateTokenOverrides,
} from "@/features/template/tokens";

export function useTokenUpdate() {
  const store = useInvitationStoreApi();
  const overrides = useInvitationStore((s) => s.tokenOverrides);
  const templateSlug = useInvitationStore((s) => s.templateSlug);
  const set = useInvitationStore((s) => s.set);

  const baseTokens = getTemplateTokens(templateSlug);
  const resolvedTokens = mergeTemplateTokenOverrides(baseTokens, overrides);

  const updateColor = <K extends "background" | "text">(
    group: K,
    key: keyof TemplateColorTokens[K],
    value: string | undefined,
  ) => {
    const currentOverrides = store.getState().tokenOverrides;
    const currentColors = currentOverrides?.colors || {};
    const currentGroup = currentColors[group] || {};

    const newGroup = { ...currentGroup } as Record<string, string>;
    if (value === undefined) {
      delete newGroup[key as string];
    } else {
      newGroup[key as string] = value;
    }

    set({
      tokenOverrides: {
        ...currentOverrides,
        colors: {
          ...currentColors,
          [group]: newGroup,
        },
      },
    });
  };

  const updateButtonColor = (
    variant: "primary" | "secondary",
    type: "text" | "background",
    value: string | undefined,
  ) => {
    const currentOverrides = store.getState().tokenOverrides;
    const currentColors = currentOverrides?.colors || {};
    const currentButton = currentColors.button || {};
    const currentVariant = currentButton[variant] || {};

    const newVariant = { ...currentVariant } as Record<string, string>;
    if (value === undefined) {
      delete newVariant[type];
    } else {
      newVariant[type] = value;
    }

    set({
      tokenOverrides: {
        ...currentOverrides,
        colors: {
          ...currentColors,
          button: {
            ...currentButton,
            [variant]: newVariant,
          },
        },
      },
    });
  };

  const resetColorGroup = (group: keyof TemplateColorTokens) => {
    const currentOverrides = store.getState().tokenOverrides;
    const currentColors = currentOverrides?.colors || {};
    const { [group]: _removed, ...rest } = currentColors;

    set({
      tokenOverrides: {
        ...currentOverrides,
        colors: Object.keys(rest).length > 0 ? rest : undefined,
      },
    });
  };

  const updateTypography = (
    group: keyof NonNullable<TemplateTokenOverrides["typography"]>,
    key: keyof FontSpec,
    value: string | number,
  ) => {
    const currentOverrides = store.getState().tokenOverrides;
    const currentTypography = currentOverrides?.typography || {};
    const currentGroup = currentTypography[group] || {};

    set({
      tokenOverrides: {
        ...currentOverrides,
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
    const currentOverrides = store.getState().tokenOverrides;
    const currentTypography = currentOverrides?.typography || {};
    const { [group]: _removed, ...rest } = currentTypography;

    set({
      tokenOverrides: {
        ...currentOverrides,
        typography: Object.keys(rest).length > 0 ? rest : undefined,
      },
    });
  };

  return {
    resolvedTokens,
    overrides,
    updateColor,
    updateButtonColor,
    resetColorGroup,
    updateTypography,
    resetTypographyGroup,
  };
}
