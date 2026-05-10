import { useEffect, useState, type ReactNode } from "react";
import styled from "styled-components";
import { NavBar, type NavBarLink } from "~/components/NavBar";
import ThemeProvider from "~/components/ThemeProvider";

const publicLinks: NavBarLink[] = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

const userLinks: NavBarLink[] = [
  { href: "/login", label: "Log In" },
  { href: "/signup", label: "Sign Up" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
];

const projectLinks: NavBarLink[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/settings", label: "Project Settings" },
];

const Root = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

function useMobileNavBreakpoint() {
  const query = "(max-width: 48rem)";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}

interface AppLayoutProps {
  children: ReactNode;
  /** Marketing-style nav (scroll hide) vs signed-in app chrome */
  isPublicPage?: boolean;
}

/**
 * Page shell: theme, nav bar with app routes, and main content area.
 * Uses the same NavBar link sets as production routes under `src/pages`.
 */
export default function AppLayout({
  children,
  isPublicPage = true,
}: AppLayoutProps) {
  const isMobile = useMobileNavBreakpoint();

  return (
    <ThemeProvider>
      <Root>
        <NavBar
          isPublicPage={isPublicPage}
          isMobile={isMobile}
          publicLinks={publicLinks}
          userLinks={userLinks}
          projectLinks={projectLinks}
        />
        {children}
      </Root>
    </ThemeProvider>
  );
}
