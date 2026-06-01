import { useRef, useState } from "react";
import styled from "styled-components";
import ThemeProvider from "~/components/ThemeProvider";
import Button from "~/components/Button";
import Icon, { iconNames } from "~/components/Icon/Icon";
import type { IconName } from "~/components/Icon/types";
import { NavBar, type NavBarLink } from "~/components/NavBar";
import { Modal, PopupMenu, layerTiers } from "~/components/overlays";
import {
  primitiveColors,
  semanticColors,
  type SemanticColorSet,
} from "~/styles/colors";
import {
  CodeExample,
  ComponentIntro,
  ControlCheckboxLabel,
  ControlLabel,
  ControlSelect,
  Controls,
  DemoPreview,
  Playground,
  PropTable,
} from "./docsUi";

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
    { id: "components-overlays", label: "Overlays" },
  ]},
];

const buttonProminences = ["primary", "secondary", "tertiary"] as const;
const buttonColorSchemes = ["action", "danger", "success", "brand"] as const;
const buttonIconPositions = ["left", "right", "alone"] as const;
const iconSizes = ["1.25rem", "1.5rem", "2.5rem", "3rem"] as const;
const menuSides = ["top", "right", "bottom", "left"] as const;
const menuAligns = ["start", "center", "end"] as const;

type ButtonProminence = (typeof buttonProminences)[number];
type ButtonColorScheme = (typeof buttonColorSchemes)[number];
type ButtonIconPosition = (typeof buttonIconPositions)[number];

function buildButtonCode(opts: {
  text: string;
  prominence: ButtonProminence;
  colorScheme: ButtonColorScheme;
  size: "default" | "small";
  disabled: boolean;
  icon?: IconName;
  iconPosition: ButtonIconPosition;
}) {
  const lines = ["<Button", `  text="${opts.text}"`];
  if (opts.prominence !== "primary") lines.push(`  prominence="${opts.prominence}"`);
  if (opts.colorScheme !== "action") lines.push(`  colorScheme="${opts.colorScheme}"`);
  if (opts.size !== "default") lines.push(`  size="${opts.size}"`);
  if (opts.disabled) lines.push("  disabled");
  if (opts.icon) {
    lines.push(`  icon="${opts.icon}"`);
    if (opts.iconPosition !== "left") lines.push(`  iconPosition="${opts.iconPosition}"`);
  }
  lines.push("/>");
  return lines.join("\n");
}

function buildIconCode(name: IconName, size: string) {
  if (size === "1.5rem") return `<Icon name="${name}" />`;
  return `<Icon name="${name}" size="${size}" />`;
}

function buildPopupMenuCode(align: string, side: string) {
  const lines = [
    "<PopupMenu",
    '  trigger={<Button text="Open menu" />}',
    "  sections={[",
    '    [{ label: "Item one" }, { label: "Item two" }],',
    '    [{ label: "Item three" }],',
    "  ]}",
  ];
  if (side !== "bottom") lines.push(`  side="${side}"`);
  if (align !== "start") lines.push(`  align="${align}"`);
  lines.push("/>");
  return lines.join("\n");
}

function buildModalCode(title?: string) {
  const lines = [
    "{modalOpen && (",
    "  <Modal",
    title ? `    title="${title}"` : null,
    "    onClose={() => setModalOpen(false)}",
    "  >",
    "    {/* content */}",
    "  </Modal>",
    ")}",
  ].filter((line): line is string => line !== null);
  return lines.join("\n");
}

export default function DocsPage() {
  const publicDesktopScrollRef = useRef<HTMLDivElement>(null);
  const publicMobileScrollRef = useRef<HTMLDivElement>(null);
  const navPlayScrollRef = useRef<HTMLDivElement>(null);

  const [btnText, setBtnText] = useState("Submit");
  const [btnProminence, setBtnProminence] = useState<ButtonProminence>("primary");
  const [btnColorScheme, setBtnColorScheme] = useState<ButtonColorScheme>("action");
  const [btnSize, setBtnSize] = useState<"default" | "small">("default");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [btnIcon, setBtnIcon] = useState<IconName | "">("");
  const [btnIconPosition, setBtnIconPosition] =
    useState<ButtonIconPosition>("left");

  const [iconDemoName, setIconDemoName] = useState<IconName>("star");
  const [iconDemoSize, setIconDemoSize] = useState<string>("1.5rem");

  const [menuAlign, setMenuAlign] = useState<(typeof menuAligns)[number]>("start");
  const [menuSide, setMenuSide] = useState<(typeof menuSides)[number]>("bottom");

  const [modalOpen, setModalOpen] = useState(false);

  const [navPlayPublic, setNavPlayPublic] = useState(true);
  const [navPlayMobile, setNavPlayMobile] = useState(false);

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
            <ComponentIntro>
              Raw palette values grouped by hue. Semantic tokens in the app reference these
              primitives; prefer semantic colors in components so light/dark mode can swap later.
            </ComponentIntro>
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
            <ComponentIntro>
              Named tokens consumed via <code>useTheme()</code> — e.g.{" "}
              <code>colors.action</code>, <code>colors.surfaceLighter</code>,{" "}
              <code>colors.border</code>.
            </ComponentIntro>
            <SemanticSwatches colors={semanticColors.light} />
          </Section>

          <Section id="colors-semantic-dark">
            <SectionTitle>Colors — Semantic (dark mode)</SectionTitle>
            <ComponentIntro>
              Same token names as light mode with inverted surfaces and contrast pairings.
            </ComponentIntro>
            <SemanticSwatches colors={semanticColors.dark} />
          </Section>

          {/* ---------------------------------------------------------------- */}
          {/* BUTTON                                                           */}
          {/* ---------------------------------------------------------------- */}
          <Section id="components-button">
            <SectionTitle>Button</SectionTitle>
            <ComponentIntro>
              Primary actions and controls. Variants combine <strong>prominence</strong> (visual
              weight) with <strong>colorScheme</strong> (semantic intent). Supports optional
              icons and forwards native button props for use as Radix triggers.
            </ComponentIntro>

            <SectionSubtitle>Playground</SectionSubtitle>
            <Playground>
              <DemoPreview>
                <Button
                  text={btnText}
                  prominence={btnProminence}
                  colorScheme={btnColorScheme}
                  size={btnSize}
                  disabled={btnDisabled}
                  icon={btnIcon || undefined}
                  iconPosition={btnIcon ? btnIconPosition : undefined}
                />
              </DemoPreview>
              <Controls>
                <ControlLabel>
                  text
                  <ControlSelect
                    value={btnText}
                    onChange={(e) => setBtnText(e.target.value)}
                  >
                    <option value="Submit">Submit</option>
                    <option value="Cancel">Cancel</option>
                    <option value="Delete">Delete</option>
                  </ControlSelect>
                </ControlLabel>
                <ControlLabel>
                  prominence
                  <ControlSelect
                    value={btnProminence}
                    onChange={(e) =>
                      setBtnProminence(e.target.value as ButtonProminence)
                    }
                  >
                    {buttonProminences.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </ControlSelect>
                </ControlLabel>
                <ControlLabel>
                  colorScheme
                  <ControlSelect
                    value={btnColorScheme}
                    onChange={(e) =>
                      setBtnColorScheme(e.target.value as ButtonColorScheme)
                    }
                  >
                    {buttonColorSchemes.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </ControlSelect>
                </ControlLabel>
                <ControlLabel>
                  size
                  <ControlSelect
                    value={btnSize}
                    onChange={(e) =>
                      setBtnSize(e.target.value as "default" | "small")
                    }
                  >
                    <option value="default">default</option>
                    <option value="small">small</option>
                  </ControlSelect>
                </ControlLabel>
                <ControlLabel>
                  icon
                  <ControlSelect
                    value={btnIcon}
                    onChange={(e) => setBtnIcon(e.target.value as IconName | "")}
                  >
                    <option value="">none</option>
                    {iconNames.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </ControlSelect>
                </ControlLabel>
                {btnIcon ? (
                  <ControlLabel>
                    iconPosition
                    <ControlSelect
                      value={btnIconPosition}
                      onChange={(e) =>
                        setBtnIconPosition(e.target.value as ButtonIconPosition)
                      }
                    >
                      {buttonIconPositions.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </ControlSelect>
                  </ControlLabel>
                ) : null}
                <ControlCheckboxLabel>
                  <input
                    type="checkbox"
                    checked={btnDisabled}
                    onChange={(e) => setBtnDisabled(e.target.checked)}
                  />
                  disabled
                </ControlCheckboxLabel>
              </Controls>
              <CodeExample>
                {buildButtonCode({
                  text: btnText,
                  prominence: btnProminence,
                  colorScheme: btnColorScheme,
                  size: btnSize,
                  disabled: btnDisabled,
                  icon: btnIcon || undefined,
                  iconPosition: btnIconPosition,
                })}
              </CodeExample>
            </Playground>

            <PropTable>
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><code>text</code></td><td>string</td><td>—</td></tr>
                <tr><td><code>prominence</code></td><td>primary | secondary | tertiary</td><td>primary</td></tr>
                <tr><td><code>colorScheme</code></td><td>action | danger | success | brand</td><td>action</td></tr>
                <tr><td><code>size</code></td><td>default | small</td><td>default</td></tr>
                <tr><td><code>icon</code></td><td>IconName</td><td>—</td></tr>
                <tr><td><code>iconPosition</code></td><td>left | right | alone</td><td>left</td></tr>
                <tr><td><code>disabled</code></td><td>boolean</td><td>false</td></tr>
              </tbody>
            </PropTable>

            <SectionSubtitle>All variants</SectionSubtitle>
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
            <ComponentIntro>
              Material Icons (Rounded) plus custom SVG icons. Default size is{" "}
              <code>1.5rem</code>. Pass a CSS length to <code>size</code> for larger/smaller
              rendering.
            </ComponentIntro>

            <SectionSubtitle>Playground</SectionSubtitle>
            <Playground>
              <DemoPreview>
                <Icon name={iconDemoName} size={iconDemoSize} />
              </DemoPreview>
              <Controls>
                <ControlLabel>
                  name
                  <ControlSelect
                    value={iconDemoName}
                    onChange={(e) => setIconDemoName(e.target.value as IconName)}
                  >
                    {iconNames.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </ControlSelect>
                </ControlLabel>
                <ControlLabel>
                  size
                  <ControlSelect
                    value={iconDemoSize}
                    onChange={(e) => setIconDemoSize(e.target.value)}
                  >
                    {iconSizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </ControlSelect>
                </ControlLabel>
              </Controls>
              <CodeExample>{buildIconCode(iconDemoName, iconDemoSize)}</CodeExample>
            </Playground>

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
            <ComponentIntro>
              Sticky top navigation with public/private layouts. Uses{" "}
              <code>PopupMenu</code> for the hamburger and account menus. On public pages the bar
              hides on scroll-down and reappears on scroll-up. Pass{" "}
              <code>scrollRootRef</code> when the nav lives inside a bounded scroll shell (as in
              the demos below).
            </ComponentIntro>
            <CodeExample>{`import { NavBar } from "~/components/NavBar";

<NavBar
  isPublicPage={false}
  isMobile={false}
  publicLinks={[{ href: "/", label: "Home" }]}
  userLinks={[{ href: "/profile", label: "Profile" }]}
  projectLinks={[{ href: "/dashboard", label: "Dashboard" }]}
/>`}</CodeExample>

            <SectionSubtitle>Playground</SectionSubtitle>
            <Playground>
              <Controls>
                <ControlCheckboxLabel>
                  <input
                    type="checkbox"
                    checked={navPlayPublic}
                    onChange={(e) => setNavPlayPublic(e.target.checked)}
                  />
                  isPublicPage
                </ControlCheckboxLabel>
                <ControlCheckboxLabel>
                  <input
                    type="checkbox"
                    checked={navPlayMobile}
                    onChange={(e) => setNavPlayMobile(e.target.checked)}
                  />
                  isMobile
                </ControlCheckboxLabel>
              </Controls>
              <NavBarDemoShell id="navbar-demo-playground" $narrow={navPlayMobile}>
                <NavBar
                  isPublicPage={navPlayPublic}
                  isMobile={navPlayMobile}
                  {...makeDemoNavLinks("navbar-demo-playground")}
                  scrollRootRef={navPlayPublic ? navPlayScrollRef : undefined}
                />
                <DemoMain ref={navPlayScrollRef}>
                  <DemoParagraph>
                    Scroll this frame to test hide/show on public pages. Toggle the props above
                    to switch layouts.
                  </DemoParagraph>
                  <DemoParagraph>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua.
                  </DemoParagraph>
                  <DemoParagraph>
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                  </DemoParagraph>
                </DemoMain>
              </NavBarDemoShell>
            </Playground>

            <PropTable>
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><code>isPublicPage</code></td><td>boolean</td><td>Marketing vs app layout</td></tr>
                <tr><td><code>isMobile</code></td><td>boolean</td><td>Hamburger vs inline links</td></tr>
                <tr><td><code>publicLinks</code></td><td>{`{ href, label }[]`}</td><td>Site-wide links</td></tr>
                <tr><td><code>userLinks</code></td><td>{`{ href, label }[]`}</td><td>Account menu items</td></tr>
                <tr><td><code>projectLinks</code></td><td>{`{ href, label }[]`}</td><td>App links (mobile hamburger)</td></tr>
                <tr><td><code>scrollRootRef</code></td><td>Ref</td><td>Scroll container for hide/show</td></tr>
              </tbody>
            </PropTable>

            <SectionSubtitle>Examples</SectionSubtitle>

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
                  Juntbox brings your entire team&apos;s work into one place so you
                  can ship with confidence. No more scattered threads, lost
                  decisions, or surprise blockers.
                </DemoParagraph>
                <DemoParagraph>
                  Whether you&apos;re a two-person startup or a scaling org, Juntbox
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
                  Join thousands of teams who&apos;ve made Juntbox the center of
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
                  Juntbox brings your entire team&apos;s work into one place so you
                  can ship with confidence.
                </DemoParagraph>
                <DemoParagraph>
                  Whether you&apos;re a two-person startup or a scaling org, Juntbox
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

          {/* ---------------------------------------------------------------- */}
          {/* OVERLAYS                                                         */}
          {/* ---------------------------------------------------------------- */}
          <Section id="components-overlays">
            <SectionTitle>Overlays</SectionTitle>
            <ComponentIntro>
              Portaled UI layered above page content. Z-index tiers: popupMenu=
              {layerTiers.popupMenu}, modal={layerTiers.modal}.{" "}
              <code>LayerProvider</code> (at app root) bumps z-index when multiple overlays are
              open so a menu inside a modal stacks correctly.
            </ComponentIntro>

            <SectionSubtitle>PopupMenu</SectionSubtitle>
            <ComponentIntro>
              Action/navigation menu anchored to a trigger. Uncontrolled — opens on trigger click,
              closes on outside click or Escape. Non-modal: page scroll and outside interaction
              remain available. Items with <code>href</code> render as links; label-only items
              dismiss without navigating.
            </ComponentIntro>
            <Playground>
              <DemoPreview>
                <PopupMenu
                  trigger={<Button text="Open menu" />}
                  sections={[
                    [{ label: "Item one" }, { label: "Item two" }],
                    [{ label: "Item three" }],
                  ]}
                  side={menuSide}
                  align={menuAlign}
                />
              </DemoPreview>
              <Controls>
                <ControlLabel>
                  side
                  <ControlSelect
                    value={menuSide}
                    onChange={(e) =>
                      setMenuSide(e.target.value as (typeof menuSides)[number])
                    }
                  >
                    {menuSides.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </ControlSelect>
                </ControlLabel>
                <ControlLabel>
                  align
                  <ControlSelect
                    value={menuAlign}
                    onChange={(e) =>
                      setMenuAlign(e.target.value as (typeof menuAligns)[number])
                    }
                  >
                    {menuAligns.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </ControlSelect>
                </ControlLabel>
              </Controls>
              <CodeExample>{buildPopupMenuCode(menuAlign, menuSide)}</CodeExample>
            </Playground>
            <PropTable>
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><code>trigger</code></td><td>ReactElement</td><td>—</td></tr>
                <tr><td><code>sections</code></td><td>{`{ label, href? }[][]`}</td><td>—</td></tr>
                <tr><td><code>side</code></td><td>top | right | bottom | left</td><td>bottom</td></tr>
                <tr><td><code>align</code></td><td>start | center | end</td><td>start</td></tr>
              </tbody>
            </PropTable>

            <SectionSubtitle>Modal</SectionSubtitle>
            <ComponentIntro>
              Blocking dialog with backdrop, focus trap, and document scroll lock.
              Render when open; dismiss via outside click, Escape, or{" "}
              <code>onClose</code> from your own controls.
            </ComponentIntro>
            <Playground>
              <DemoPreview>
                <Button text="Open modal" onClick={() => setModalOpen(true)} />
              </DemoPreview>
              <CodeExample>{buildModalCode("Example modal")}</CodeExample>
            </Playground>
            {modalOpen ? (
              <Modal
                title="Example modal"
                onClose={() => setModalOpen(false)}
              >
              <div style={{ display: "grid", gap: "0.75rem" }}>
                <p style={{ margin: 0, lineHeight: 1.6, color: "#555" }}>
                  Click outside, press Escape, or use the buttons below to close.
                  The parent unmounts this modal when <code>onClose</code> runs.
                </p>
                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                  <Button
                    text="Close"
                    prominence="secondary"
                    onClick={() => setModalOpen(false)}
                  />
                  <Button text="Confirm" onClick={() => setModalOpen(false)} />
                </div>
              </div>
              </Modal>
            ) : null}
            <PropTable>
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><code>onClose</code></td><td>() =&gt; void</td><td>Called when dismissed</td></tr>
                <tr><td><code>title</code></td><td>ReactNode</td><td>Optional; sets accessible dialog title</td></tr>
                <tr><td><code>children</code></td><td>ReactNode</td><td>Body and actions</td></tr>
              </tbody>
            </PropTable>
          </Section>
        </Content>
      </PageLayout>
    </ThemeProvider>
  );
}
