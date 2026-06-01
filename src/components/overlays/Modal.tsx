import * as RadixDialog from "@radix-ui/react-dialog";
import { useEffect, useState, type ReactNode } from "react";
import styled from "styled-components";
import { useTheme } from "~/components/ThemeProvider";
import { useLayerManager } from "./LayerProvider";

export type ModalProps = {
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
};

const Overlay = styled(RadixDialog.Overlay)<{ $zIndex: number }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: ${(p) => p.$zIndex};
`;

const Content = styled(RadixDialog.Content)<{
  $background: string;
  $border: string;
  $text: string;
  $zIndex: number;
}>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${(p) => p.$background};
  color: ${(p) => p.$text};
  border: 1px solid ${(p) => p.$border};
  border-radius: 0.75rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  z-index: ${(p) => p.$zIndex};
  width: min(40rem, calc(100vw - 1.5rem));
  max-height: calc(100vh - 1.5rem);
  overflow: auto;
  padding: 1rem;
`;

const Title = styled(RadixDialog.Title)`
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 800;
`;

export function Modal({ onClose, title, children }: ModalProps) {
  const { colors } = useTheme();
  const { registerLayer, getTierBase } = useLayerManager();
  const [zIndex, setZIndex] = useState(getTierBase("modal"));

  useEffect(() => {
    const reg = registerLayer(getTierBase("modal"));
    setZIndex(reg.zIndex);
    return () => reg.unregister();
  }, [getTierBase, registerLayer]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <RadixDialog.Root open onOpenChange={handleOpenChange} modal>
      <RadixDialog.Portal>
        <Overlay $zIndex={zIndex} />
        <Content
          $background={colors.surfaceLighter}
          $border={colors.border}
          $text={colors.text}
          $zIndex={zIndex + 1}
        >
          {title ? <Title>{title}</Title> : null}
          {children}
        </Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
