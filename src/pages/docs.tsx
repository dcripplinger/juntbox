import { useRef } from "react";
import styled from "styled-components";
import ThemeProvider from "~/components/ThemeProvider";
import Button from "~/components/Button";
import Icon, { iconNames } from "~/components/Icon/Icon";
import { NavBar, type NavBarLink } from "~/components/NavBar";
import {
  primitiveColors,
  semanticColors,
  type SemanticColorSet,
} from "~/styles/colors";

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

const PageLayout = styled.div`
  display: flex;
  min-height: 100vh;
  font-family: var(--default-font, sans-serif);
  font-size: 0.875rem;
  color: #333;
`;

const SideNav = styled.nav`
  position: sticky;
  top: 0;
  height: 100vh;
  width: 14rem;
  flex-shrink: 0;
  overflow-y: auto;
  border-right: 1px solid #e0e0e0;
  background: #fafafa;
  padding: 1.5rem 0;
`;

const NavGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const NavGroupLabel = styled.div`
  padding: 0 1rem 0.25rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #888;
`;

const NavLink = styled.a`
  display: block;
  padding: 0.3rem 1rem;
  color: #333;
  text-decoration: none;
  border-left: 2px solid transparent;

  &:hover {
    background: #f0f0f0;
    border-left-color: #999;
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 2rem 2.5rem;
  max-width: 56rem;
`;

// ---------------------------------------------------------------------------
// Section primitives
// ---------------------------------------------------------------------------

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

const SectionSubtitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
  color: #555;
`;

// ---------------------------------------------------------------------------
// Color swatches
// ---------------------------------------------------------------------------

const SwatchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.375rem;
`;

const SwatchBlock = styled.div<{ $color: string }>`
  background-color: ${(p) => p.$color};
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid #ccc;
  flex-shrink: 0;
`;

const SwatchLabel = styled.code`
  font-size: 0.8rem;
`;

const SwatchValue = styled.code`
  font-size: 0.8rem;
  color: #888;
`;

interface SwatchProps {
  label: string;
  color: string;
}

const Swatch = ({ label, color }: SwatchProps) => (
  <SwatchRow>
    <SwatchBlock $color={color} />
    <SwatchLabel>{label}</SwatchLabel>
    <SwatchValue>{color}</SwatchValue>
  </SwatchRow>
);

const ColorGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const ColorGroupName = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
`;

interface SemanticSwatchesProps {
  colors: SemanticColorSet;
}

const SemanticSwatches = ({ colors }: SemanticSwatchesProps) => (
  <div>
    {Object.entries(colors).map(([name, value]) => (
      <Swatch key={name} label={name} color={value} />
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Button section
// ---------------------------------------------------------------------------

const ButtonGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const VariantLabel = styled.span`
  font-size: 0.75rem;
  color: #888;
  min-width: 5rem;
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

// ---------------------------------------------------------------------------
// Icon section
// ---------------------------------------------------------------------------

const IconGrid = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const IconItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 4rem;
  gap: 0.25rem;
`;

const IconLabel = styled.span`
  font-size: 0.6rem;
  overflow-wrap: break-word;
  width: 100%;
  text-align: center;
  color: #666;
`;

// ---------------------------------------------------------------------------
// NavBar demo shells
// ---------------------------------------------------------------------------

/** Each NavBar demo uses its own fragment so link clicks do not jump to the top of the whole NavBar section. */
function makeDemoNavLinks(demoSectionId: string): {
  publicLinks: NavBarLink[];
  userLinks: NavBarLink[];
  projectLinks: NavBarLink[];
} {
  const h = `#${demoSectionId}`;
  return {
    publicLinks: [
      { href: h, label: "Home" },
      { href: h, label: "Features" },
      { href: h, label: "Pricing" },
      { href: h, label: "About" },
    ],
    userLinks: [
      { href: h, label: "Log In" },
      { href: h, label: "Sign Up" },
      { href: h, label: "Profile" },
      { href: h, label: "Settings" },
    ],
    projectLinks: [
      { href: h, label: "Dashboard" },
      { href: h, label: "My Tasks" },
      { href: h, label: "Project Settings" },
    ],
  };
}

/**
 * Outer frame. overflow:hidden both clips content to the frame boundary and
 * creates a scroll container so the sticky NavBar doesn't escape the demo.
 */
const NavBarDemoShell = styled.div<{ $narrow?: boolean }>`
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 360px;
  max-width: ${(p) => (p.$narrow ? "22rem" : "100%")};
  margin-bottom: 1.5rem;
  overflow: hidden;
  background: #fff;
  font-size: 0.875rem;
  color: #333;
`;

const DemoMain = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 1.25rem;
`;

const DemoHeading = styled.h1`
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
  color: #111;
`;

const DemoSubheading = styled.h2`
  font-size: 0.9rem;
  font-weight: 600;
  margin: 1.25rem 0 0.5rem;
  color: #333;
`;

const DemoParagraph = styled.p`
  margin: 0 0 0.75rem;
  line-height: 1.6;
  color: #555;
`;

const DemoCard = styled.div`
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DemoBadge = styled.span<{ $color: string }>`
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: ${(p) => p.$color};
  color: #fff;
  font-weight: 600;
`;

const PreviewCaption = styled.p`
  font-size: 0.8rem;
  color: #666;
  margin: 0 0 0.5rem;
`;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const navItems = [
  { group: "Colors", items: [
    { id: "colors-primitives", label: "Primitives" },
    { id: "colors-semantic-light", label: "Semantic (light)" },
    { id: "colors-semantic-dark", label: "Semantic (dark)" },
  ]},
  { group: "Components", items: [
    { id: "components-button", label: "Button" },
    { id: "components-icon", label: "Icon" },
    { id: "components-navbar", label: "NavBar" },
  ]},
];

const buttonProminences = ["primary", "secondary", "tertiary"] as const;
const buttonColorSchemes = ["action", "danger", "success", "brand"] as const;

export default function DocsPage() {
  const publicDesktopScrollRef = useRef<HTMLDivElement>(null);
  const publicMobileScrollRef = useRef<HTMLDivElement>(null);

  return (
    <ThemeProvider>
      <PageLayout>
        <SideNav>
          {navItems.map((group) => (
            <NavGroup key={group.group}>
              <NavGroupLabel>{group.group}</NavGroupLabel>
              {group.items.map((item) => (
                <NavLink key={item.id} href={`#${item.id}`}>{item.label}</NavLink>
              ))}
            </NavGroup>
          ))}
        </SideNav>

        <Content>
          {/* ---------------------------------------------------------------- */}
          {/* COLORS                                                           */}
          {/* ---------------------------------------------------------------- */}
          <Section id="colors-primitives">
            <SectionTitle>Colors — Primitives</SectionTitle>
            {Object.entries(primitiveColors).map(([groupName, shades]) => (
              <ColorGroup key={groupName}>
                <ColorGroupName>{groupName}</ColorGroupName>
                {typeof shades === "string" ? (
                  <Swatch label={groupName} color={shades} />
                ) : (
                  Object.entries(shades).map(([tone, hex]) => (
                    <Swatch key={tone} label={`${groupName}[${tone}]`} color={hex} />
                  ))
                )}
              </ColorGroup>
            ))}
          </Section>

          <Section id="colors-semantic-light">
            <SectionTitle>Colors — Semantic (light mode)</SectionTitle>
            <SemanticSwatches colors={semanticColors.light} />
          </Section>

          <Section id="colors-semantic-dark">
            <SectionTitle>Colors — Semantic (dark mode)</SectionTitle>
            <SemanticSwatches colors={semanticColors.dark} />
          </Section>

          {/* ---------------------------------------------------------------- */}
          {/* BUTTON                                                           */}
          {/* ---------------------------------------------------------------- */}
          <Section id="components-button">
            <SectionTitle>Button</SectionTitle>

            <SectionSubtitle>Prominence × Color scheme</SectionSubtitle>
            {buttonProminences.map((prominence) => (
              <div key={prominence}>
                <SectionSubtitle>{prominence}</SectionSubtitle>
                <ButtonGrid>
                  {buttonColorSchemes.map((colorScheme) => (
                    <div key={colorScheme} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                      <Button prominence={prominence} colorScheme={colorScheme} text={colorScheme} />
                      <VariantLabel style={{ textAlign: "center" }}>{colorScheme}</VariantLabel>
                    </div>
                  ))}
                </ButtonGrid>
              </div>
            ))}

            <SectionSubtitle>Size</SectionSubtitle>
            <ButtonRow>
              <Button text="Default" size="default" />
              <VariantLabel>default</VariantLabel>
              <Button text="Small" size="small" />
              <VariantLabel>small</VariantLabel>
            </ButtonRow>

            <SectionSubtitle>Icon position</SectionSubtitle>
            <ButtonRow>
              <Button text="Left icon" icon="star" iconPosition="left" />
              <VariantLabel>left</VariantLabel>
              <Button text="Right icon" icon="star" iconPosition="right" />
              <VariantLabel>right</VariantLabel>
              <Button icon="star" iconPosition="alone" />
              <VariantLabel>alone</VariantLabel>
            </ButtonRow>

            <SectionSubtitle>Disabled</SectionSubtitle>
            <ButtonRow>
              <Button text="Disabled" disabled />
              <Button text="Disabled secondary" prominence="secondary" disabled />
              <Button text="Disabled tertiary" prominence="tertiary" disabled />
            </ButtonRow>
          </Section>

          {/* ---------------------------------------------------------------- */}
          {/* ICON                                                             */}
          {/* ---------------------------------------------------------------- */}
          <Section id="components-icon">
            <SectionTitle>Icon</SectionTitle>

            <SectionSubtitle>Sizes</SectionSubtitle>
            <ButtonRow>
              {(["1.25rem", "1.5rem", "2.5rem", "3rem"] as const).map((size) => (
                <div key={size} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                  <Icon name="star" size={size} />
                  <VariantLabel style={{ textAlign: "center" }}>{size}</VariantLabel>
                </div>
              ))}
            </ButtonRow>

            <SectionSubtitle>All icons</SectionSubtitle>
            <IconGrid>
              {iconNames.map((name) => (
                <IconItem key={name}>
                  <Icon name={name} />
                  <IconLabel>{name}</IconLabel>
                </IconItem>
              ))}
            </IconGrid>
          </Section>

          {/* ---------------------------------------------------------------- */}
          {/* NAVBAR                                                           */}
          {/* ---------------------------------------------------------------- */}
          <Section id="components-navbar">
            <SectionTitle>NavBar</SectionTitle>

            <SectionSubtitle>Public page, desktop</SectionSubtitle>
            <PreviewCaption>isPublicPage=true, isMobile=false — scroll inside the frame to see the bar hide</PreviewCaption>
            <NavBarDemoShell id="navbar-demo-public-desktop">
              <NavBar
                isPublicPage
                isMobile={false}
                {...makeDemoNavLinks("navbar-demo-public-desktop")}
                scrollRootRef={publicDesktopScrollRef}
              />
              <DemoMain ref={publicDesktopScrollRef}>
                <DemoHeading>Build better products, together.</DemoHeading>
                <DemoParagraph>
                  Juntbox brings your entire team's work into one place so you
                  can ship with confidence. No more scattered threads, lost
                  decisions, or surprise blockers.
                </DemoParagraph>
                <DemoParagraph>
                  Whether you're a two-person startup or a scaling org, Juntbox
                  adapts to how you work—not the other way around.
                </DemoParagraph>
                <DemoSubheading>Everything you need</DemoSubheading>
                <DemoParagraph>
                  Real-time collaboration, role-based access, instant project
                  setup, and a timeline that actually tells the truth. Scroll up
                  to see the nav reappear.
                </DemoParagraph>
                <DemoParagraph>
                  Integrations with the tools you already use: GitHub, Figma,
                  Slack, and more. Get started in minutes.
                </DemoParagraph>
                <DemoSubheading>Loved by teams</DemoSubheading>
                <DemoParagraph>
                  Join thousands of teams who've made Juntbox the center of
                  their workflow. Transparent pricing, no surprise fees.
                </DemoParagraph>
              </DemoMain>
            </NavBarDemoShell>

            <SectionSubtitle>Public page, mobile</SectionSubtitle>
            <PreviewCaption>isPublicPage=true, isMobile=true — hamburger menu; scroll to see hide/show</PreviewCaption>
            <NavBarDemoShell id="navbar-demo-public-mobile" $narrow>
              <NavBar
                isPublicPage
                isMobile
                {...makeDemoNavLinks("navbar-demo-public-mobile")}
                scrollRootRef={publicMobileScrollRef}
              />
              <DemoMain ref={publicMobileScrollRef}>
                <DemoHeading>Build better products, together.</DemoHeading>
                <DemoParagraph>
                  Juntbox brings your entire team's work into one place so you
                  can ship with confidence.
                </DemoParagraph>
                <DemoParagraph>
                  Whether you're a two-person startup or a scaling org, Juntbox
                  adapts to how you work.
                </DemoParagraph>
                <DemoSubheading>Everything you need</DemoSubheading>
                <DemoParagraph>
                  Real-time collaboration, role-based access, instant project
                  setup. Scroll up to see the nav reappear.
                </DemoParagraph>
                <DemoParagraph>
                  Integrations with GitHub, Figma, Slack, and more. Get started
                  in minutes with transparent pricing.
                </DemoParagraph>
              </DemoMain>
            </NavBarDemoShell>

            <SectionSubtitle>Private page, desktop</SectionSubtitle>
            <PreviewCaption>isPublicPage=false, isMobile=false — user menu on the right</PreviewCaption>
            <NavBarDemoShell id="navbar-demo-private-desktop">
              <NavBar
                isPublicPage={false}
                isMobile={false}
                {...makeDemoNavLinks("navbar-demo-private-desktop")}
              />
              <DemoMain>
                <DemoSubheading>My Projects</DemoSubheading>
                <DemoCard>
                  <span>Project Alpha</span>
                  <DemoBadge $color="#2563eb">In Progress</DemoBadge>
                </DemoCard>
                <DemoCard>
                  <span>Project Beta</span>
                  <DemoBadge $color="#7c3aed">Planning</DemoBadge>
                </DemoCard>
                <DemoCard>
                  <span>Project Gamma</span>
                  <DemoBadge $color="#16a34a">Completed</DemoBadge>
                </DemoCard>
                <DemoSubheading>Recent Activity</DemoSubheading>
                <DemoParagraph>Alice pushed 3 commits to Project Alpha.</DemoParagraph>
                <DemoParagraph>Bob closed 5 tasks in Project Beta.</DemoParagraph>
                <DemoParagraph>Carol updated the roadmap for Project Gamma.</DemoParagraph>
              </DemoMain>
            </NavBarDemoShell>

            <SectionSubtitle>Private page, mobile (hamburger)</SectionSubtitle>
            <PreviewCaption>isPublicPage=false, isMobile=true — project links in hamburger menu</PreviewCaption>
            <NavBarDemoShell id="navbar-demo-private-mobile" $narrow>
              <NavBar
                isPublicPage={false}
                isMobile
                {...makeDemoNavLinks("navbar-demo-private-mobile")}
              />
              <DemoMain>
                <DemoSubheading>My Projects</DemoSubheading>
                <DemoCard>
                  <span>Project Alpha</span>
                  <DemoBadge $color="#2563eb">In Progress</DemoBadge>
                </DemoCard>
                <DemoCard>
                  <span>Project Beta</span>
                  <DemoBadge $color="#7c3aed">Planning</DemoBadge>
                </DemoCard>
                <DemoCard>
                  <span>Project Gamma</span>
                  <DemoBadge $color="#16a34a">Completed</DemoBadge>
                </DemoCard>
                <DemoSubheading>Recent Activity</DemoSubheading>
                <DemoParagraph>Alice pushed 3 commits to Project Alpha.</DemoParagraph>
                <DemoParagraph>Bob closed 5 tasks in Project Beta.</DemoParagraph>
              </DemoMain>
            </NavBarDemoShell>
          </Section>
        </Content>
      </PageLayout>
    </ThemeProvider>
  );
}
