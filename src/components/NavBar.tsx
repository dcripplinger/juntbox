import { useState, useEffect } from "react";
import styled from "styled-components";
import { useTheme } from "./ThemeProvider";
import Link from "next/link";
import Icon from "./Icon/Icon";

interface Props {
  isPublicPage: boolean;
  isMobile: boolean;
  projectLinks?: Array<{ href: string; label: string }>;
}

const Container = styled.nav<{ show: boolean; backgroundColor: string }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3rem;
  background-color: ${({ backgroundColor }) => backgroundColor};
  display: flex;
  align-items: center;
  padding: 0 1rem;
  z-index: 1000;
  transition: transform 0.3s ease-in-out;
  transform: translateY(${(props) => (props.show ? "0" : "-100%")});
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

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

const userLinks = [
  { href: "/login", label: "Log In" },
  { href: "/signup", label: "Sign Up" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
];

const useScrollDirection = () => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return show;
};

export const NavBar = ({
  isPublicPage,
  isMobile,
  projectLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/settings", label: "Project Settings" },
  ],
}: Props) => {
  const { colors } = useTheme();
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const showNav = useScrollDirection();

  const toggleHamburger = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsHamburgerOpen(false);
  };

  return (
    <Container
      show={isPublicPage ? showNav : true}
      backgroundColor={colors.surfaceLighter}
    >
      {isPublicPage && !isMobile ? (
        <PublicLinks>
          <Logo href="/" textColor={colors.offbrand}>
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
  );
};
