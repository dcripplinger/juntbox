import * as RadixMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useState, type ReactElement } from "react";
import styled from "styled-components";
import { useTheme } from "~/components/ThemeProvider";
import { useLayerManager } from "./LayerProvider";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";

export type PopupMenuItem = { label: string; href?: string };

export type PopupMenuProps = {
  trigger: ReactElement;
  sections: PopupMenuItem[][];
  side?: Side;
  align?: Align;
  offset?: number;
  collisionPadding?: number;
  portalContainer?: HTMLElement | null;
};

const ContentSurface = styled(RadixMenu.Content)<{
  $background: string;
  $border: string;
  $text: string;
  $zIndex: number;
}>`
  background: ${(p) => p.$background};
  color: ${(p) => p.$text};
  border: 1px solid ${(p) => p.$border};
  border-radius: 0.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
  min-width: 12.5rem;
  z-index: ${(p) => p.$zIndex};
  max-height: var(--radix-dropdown-menu-content-available-height);
  overflow-y: auto;
`;

const ItemLink = styled(RadixMenu.Item)<{
  $textColor: string;
  $hoverBackgroundColor: string;
}>`
  display: block;
  padding: 0.5rem 1rem;
  color: ${(p) => p.$textColor};
  text-decoration: none;
  cursor: pointer;
  outline: none;

  &:hover,
  &[data-highlighted] {
    background-color: ${(p) => p.$hoverBackgroundColor};
  }
`;

const MenuSeparator = styled(RadixMenu.Separator)<{ $borderColor: string }>`
  height: 1px;
  background-color: ${(p) => p.$borderColor};
  margin: 0.5rem 0;
`;

export function PopupMenu({
  trigger,
  sections,
  side = "bottom",
  align = "start",
  offset = 4,
  collisionPadding = 8,
  portalContainer,
}: PopupMenuProps) {
  const { colors } = useTheme();
  const { registerLayer, getTierBase } = useLayerManager();
  const [isOpen, setIsOpen] = useState(false);
  const [zIndex, setZIndex] = useState(getTierBase("popupMenu"));

  const visibleSections = useMemo(
    () => sections.filter((section) => section.length > 0),
    [sections],
  );

  const portalTarget = useMemo(
    () =>
      portalContainer === undefined
        ? undefined
        : (portalContainer ?? undefined),
    [portalContainer],
  );

  useEffect(() => {
    if (!isOpen) return;
    const reg = registerLayer(getTierBase("popupMenu"));
    setZIndex(reg.zIndex);
    return () => reg.unregister();
  }, [getTierBase, isOpen, registerLayer]);

  return (
    <RadixMenu.Root modal={false} onOpenChange={setIsOpen}>
      <RadixMenu.Trigger asChild>{trigger}</RadixMenu.Trigger>
      <RadixMenu.Portal container={portalTarget}>
        <ContentSurface
          side={side}
          align={align}
          sideOffset={offset}
          collisionPadding={collisionPadding}
          $background={colors.surfaceLighter}
          $border={colors.border}
          $text={colors.text}
          $zIndex={zIndex}
        >
          {visibleSections.map((section, sectionIndex) => (
            <Fragment key={section[0]?.href ?? section[0]?.label ?? sectionIndex}>
              {sectionIndex > 0 ? (
                <MenuSeparator $borderColor={colors.border} />
              ) : null}
              {section.map((item) =>
                item.href ? (
                  <ItemLink
                    key={item.href}
                    asChild
                    $textColor={colors.text}
                    $hoverBackgroundColor={colors.surface}
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </ItemLink>
                ) : (
                  <ItemLink
                    key={item.label}
                    $textColor={colors.text}
                    $hoverBackgroundColor={colors.surface}
                  >
                    {item.label}
                  </ItemLink>
                ),
              )}
            </Fragment>
          ))}
        </ContentSurface>
      </RadixMenu.Portal>
    </RadixMenu.Root>
  );
}
