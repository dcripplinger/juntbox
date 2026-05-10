import { useState, useEffect, useRef, type RefObject } from "react";
import styled from "styled-components";
import { useTheme } from "./ThemeProvider";
import Link from "next/link";
import Icon from "./Icon/Icon";

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
 * when the bar hides. overflow switches to visible when a menu is open so
 * dropdowns are not clipped.
 */
const StickySlot = styled.div<{ $show: boolean; $hasOpenMenu: boolean }>`
  position: sticky;
  top: 0;
  width: 100%;
  flex-shrink: 0;
  z-index: 1000;
  height: ${(props) => (props.$show ? "3rem" : "0")};
  overflow: ${(props) => (props.$hasOpenMenu ? "visible" : "hidden")};
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

const Dropdown = styled.div<{ backgroundColor: string }>`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 4px;
  padding: 0.5rem 0;
  min-width: 200px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DropdownSection = styled.div<{ borderColor: string }>`
  padding: 0.5rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ borderColor }) => borderColor};
  }
`;

const DropdownItem = styled.a<{
  textColor: string;
  hoverBackgroundColor: string;
}>`
  display: block;
  padding: 0.5rem 1rem;
  color: ${({ textColor }) => textColor};
  text-decoration: none;

  &:hover {
    background-color: ${({ hoverBackgroundColor }) => hoverBackgroundColor};
  }
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
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const showNav = useScrollDirection(scrollRootRef);

  const toggleHamburger = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsHamburgerOpen(false);
  };

  const show = isPublicPage ? showNav : true;
  const hasOpenMenu = isHamburgerOpen || isUserMenuOpen;

  return (
    <StickySlot $show={show} $hasOpenMenu={hasOpenMenu}>
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
          <IconButton onClick={toggleHamburger} textColor={colors.text}>
            <Icon name="menu" />
          </IconButton>
        )}
        {isHamburgerOpen && (
          <Dropdown backgroundColor={colors.surfaceLighter}>
            {!isPublicPage && isMobile && (
              <DropdownSection borderColor={colors.border}>
                {projectLinks.map((link) => (
                  <DropdownItem
                    key={link.href}
                    href={link.href}
                    textColor={colors.text}
                    hoverBackgroundColor={colors.surface}
                  >
                    {link.label}
                  </DropdownItem>
                ))}
              </DropdownSection>
            )}
            <DropdownSection borderColor={colors.border}>
              {publicLinks.map((link) => (
                <DropdownItem
                  key={link.href}
                  href={link.href}
                  textColor={colors.text}
                  hoverBackgroundColor={colors.surface}
                >
                  {link.label}
                </DropdownItem>
              ))}
            </DropdownSection>
            {isMobile && (
              <DropdownSection borderColor={colors.border}>
                {userLinks.map((link) => (
                  <DropdownItem
                    key={link.href}
                    href={link.href}
                    textColor={colors.text}
                    hoverBackgroundColor={colors.surface}
                  >
                    {link.label}
                  </DropdownItem>
                ))}
              </DropdownSection>
            )}
          </Dropdown>
        )}

        {!isMobile && (
          <>
            <UserButton onClick={toggleUserMenu} textColor={colors.text}>
              <Icon name="account_circle" />
            </UserButton>
            {isUserMenuOpen && (
              <Dropdown
                backgroundColor={colors.surfaceLighter}
                style={{ right: 0 }}
              >
                <DropdownSection borderColor={colors.border}>
                  {userLinks.map((link) => (
                    <DropdownItem
                      key={link.href}
                      href={link.href}
                      textColor={colors.text}
                      hoverBackgroundColor={colors.surface}
                    >
                      {link.label}
                    </DropdownItem>
                  ))}
                </DropdownSection>
              </Dropdown>
            )}
          </>
        )}
      </Container>
    </StickySlot>
  );
};
