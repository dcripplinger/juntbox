import { useState, useEffect, useRef, type RefObject } from "react";
import styled from "styled-components";
import { useTheme } from "./ThemeProvider";
import Link from "next/link";
import Icon from "./Icon/Icon";
import { PopupMenu } from "./overlays";

export type NavBarLink = { href: string; label: string };

interface Props {
  isPublicPage: boolean;
  isMobile: boolean;
  publicLinks: NavBarLink[];
  userLinks: NavBarLink[];
  projectLinks: NavBarLink[];
  /**
   * Ref to the element whose scroll drives the public-page hide/show animation.
   * Omit to use window scroll (for full-page layouts where the document scrolls).
   * Pass a ref to whichever element actually scrolls when the nav lives inside a
   * bounded shell with its own scrollport (e.g. a container with overflow-y: auto).
   *
   * Parent responsibility: supply a flex-column shell so the nav occupies its
   * natural 3rem at the top and sibling content fills the remainder. Unlike a
   * fixed bar, this component does not float over content—the parent lays out
   * the header and content side by side.
   */
  scrollRootRef?: RefObject<HTMLElement | null>;
}

/**
 * Outer wrapper: sticky within the nearest scroll container (either a bounded
 * shell or the viewport), animates height so layout space collapses cleanly
 * when the bar hides.
 */
const StickySlot = styled.div<{ $show: boolean }>`
  position: sticky;
  top: 0;
  width: 100%;
  flex-shrink: 0;
  height: ${(props) => (props.$show ? "3rem" : "0")};
  overflow: hidden;
  transition: height 0.3s ease-in-out;
`;

const Container = styled.nav<{ backgroundColor: string }>`
  height: 3rem;
  width: 100%;
  background-color: ${({ backgroundColor }) => backgroundColor};
  display: flex;
  align-items: center;
  padding: 0 1rem;
  position: relative;
`;

const PublicLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const IconButton = styled.button<{ textColor: string }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ textColor }) => textColor};

  &:hover {
    opacity: 0.8;
  }
`;

const UserButton = styled(IconButton)`
  margin-left: auto;
`;

const Logo = styled(Link)<{ textColor: string }>`
  font-weight: bold;
  text-decoration: none;
  color: ${({ textColor }) => textColor};
`;

const useScrollDirection = (scrollRootRef?: RefObject<HTMLElement | null>) => {
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const target: EventTarget = scrollRootRef?.current ?? window;

    const handleScroll = () => {
      const current = scrollRootRef?.current
        ? scrollRootRef.current.scrollTop
        : window.scrollY;
      setShow(current <= lastScrollY.current);
      lastScrollY.current = current;
    };

    target.addEventListener("scroll", handleScroll);
    return () => target.removeEventListener("scroll", handleScroll);
  }, [scrollRootRef]);

  return show;
};

export const NavBar = ({
  isPublicPage,
  isMobile,
  publicLinks,
  userLinks,
  projectLinks,
  scrollRootRef,
}: Props) => {
  const { colors } = useTheme();
  const showNav = useScrollDirection(scrollRootRef);

  const show = isPublicPage ? showNav : true;

  const hamburgerSections = [
    ...(!isPublicPage && isMobile ? [projectLinks] : []),
    publicLinks,
    ...(isMobile ? [userLinks] : []),
  ];

  return (
    <StickySlot $show={show}>
      <Container backgroundColor={colors.surfaceLighter}>
        {isPublicPage && !isMobile ? (
          <PublicLinks>
            <Logo href={publicLinks[0]?.href ?? "/"} textColor={colors.offbrand}>
              <Icon name="logo" />
            </Logo>
            {publicLinks.slice(1).map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </PublicLinks>
        ) : (
          <PopupMenu
            trigger={
              <IconButton textColor={colors.text}>
                <Icon name="menu" />
              </IconButton>
            }
            sections={hamburgerSections}
            align="start"
          />
        )}

        {!isMobile && (
          <PopupMenu
            trigger={
              <UserButton textColor={colors.text}>
                <Icon name="account_circle" />
              </UserButton>
            }
            sections={[userLinks]}
            align="end"
          />
        )}
      </Container>
    </StickySlot>
  );
};
