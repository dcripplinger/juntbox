const primitiveColors = {
  brandGreen: {
    100: "#e5fbee",
    200: "#bff5d5",
    300: "#96efbb",
    400: "#6deaa1",
    500: "#45e488",
    600: "#1cdb70",
    700: "#19b25e",
    800: "#14894b",
    900: "#0f6038",
  },
  brandPurple: {
    100: "#f1e9f9",
    200: "#dbc2ef",
    300: "#c59be5",
    400: "#af74db",
    500: "#995dd1",
    600: "#8346b7",
    700: "#6d309e",
    800: "#59128a",
    900: "#3c0d5d",
  },
  red: {
    100: "#fdeaea",
    200: "#facccc",
    300: "#f7a9a9",
    400: "#f28686",
    500: "#ec6363",
    600: "#e53b3b",
    700: "#be2f2f",
    800: "#961f1f",
    900: "#6e1414",
  },
  green: {
    100: "#ebfaed",
    200: "#c8f1d1",
    300: "#a3e6b5",
    400: "#7eda98",
    500: "#59cf7c",
    600: "#3ebd68",
    700: "#309653",
    800: "#22703d",
    900: "#154b28",
  },
  skyBlue: {
    100: "#eaf6ff",
    200: "#c9e8fc",
    300: "#a7d9f8",
    400: "#84cbf5",
    500: "#61bcf1",
    600: "#3aa8e4",
    700: "#2c88b9",
    800: "#1e678e",
    900: "#114663",
  },
  gray: {
    100: "#f5f4f8",
    200: "#e7e6ec",
    300: "#d7d6de",
    400: "#c6c5ce",
    500: "#b4b3bd",
    600: "#94939c",
    700: "#72717a",
    800: "#4f4e56",
    900: "#333239",
  },
  blue: {
    100: "#e6f2ff",
    200: "#bfdeff",
    300: "#99cbff",
    400: "#66b1ff",
    500: "#3399ff",
    600: "#1a85ff",
    700: "#166dd1",
    800: "#1155a3",
    900: "#0c3d75",
  },
  white: "#ffffff",
  black: "#000000",
};

type SemanticColor =
  | "action"
  | "actionAlt"
  | "actionContrast"
  | "actionContrastAlt"
  | "brand"
  | "brandAlt"
  | "brandContrast"
  | "brandContrastAlt"
  | "danger"
  | "dangerAlt"
  | "dangerContrast"
  | "dangerContrastAlt"
  | "info"
  | "infoAlt"
  | "infoContrast"
  | "infoContrastAlt"
  | "success"
  | "successAlt"
  | "successContrast"
  | "successContrastAlt"
  | "disabled"
  | "disabledContrast"
  | "border"
  | "borderAlt"
  | "outline"
  | "surface"
  | "surfaceDarker"
  | "surfaceLighter"
  | "text"
  | "textAlt";

type SemanticColorSet = Record<SemanticColor, string>;

type Mode = "light" | "dark";

const semanticColors: Record<Mode, SemanticColorSet> = {
  light: {
    action: primitiveColors.blue[500],
    actionAlt: primitiveColors.blue[700],
    actionContrast: primitiveColors.white,
    actionContrastAlt: primitiveColors.blue[100],
    brand: primitiveColors.brandPurple[500],
    brandAlt: primitiveColors.brandPurple[700],
    brandContrast: primitiveColors.white,
    brandContrastAlt: primitiveColors.brandPurple[100],
    danger: primitiveColors.red[500],
    dangerAlt: primitiveColors.red[700],
    dangerContrast: primitiveColors.white,
    dangerContrastAlt: primitiveColors.red[100],
    info: primitiveColors.skyBlue[500],
    infoAlt: primitiveColors.skyBlue[700],
    infoContrast: primitiveColors.white,
    infoContrastAlt: primitiveColors.skyBlue[100],
    success: primitiveColors.green[500],
    successAlt: primitiveColors.green[700],
    successContrast: primitiveColors.white,
    successContrastAlt: primitiveColors.green[100],
    disabled: primitiveColors.gray[500],
    disabledContrast: primitiveColors.white,
    border: primitiveColors.gray[300],
    borderAlt: primitiveColors.gray[400],
    outline: primitiveColors.blue[500],
    surface: primitiveColors.gray[100],
    surfaceDarker: primitiveColors.gray[200],
    surfaceLighter: primitiveColors.white,
    text: primitiveColors.gray[900],
    textAlt: primitiveColors.black,
  },
  dark: {
    action: primitiveColors.blue[500],
    actionAlt: primitiveColors.blue[300],
    actionContrast: primitiveColors.black,
    actionContrastAlt: primitiveColors.blue[900],
    brand: primitiveColors.brandPurple[500],
    brandAlt: primitiveColors.brandPurple[300],
    brandContrast: primitiveColors.black,
    brandContrastAlt: primitiveColors.brandPurple[900],
    danger: primitiveColors.red[500],
    dangerAlt: primitiveColors.red[300],
    dangerContrast: primitiveColors.white,
    dangerContrastAlt: primitiveColors.red[900],
    info: primitiveColors.skyBlue[500],
    infoAlt: primitiveColors.skyBlue[300],
    infoContrast: primitiveColors.white,
    infoContrastAlt: primitiveColors.skyBlue[900],
    success: primitiveColors.green[500],
    successAlt: primitiveColors.green[300],
    successContrast: primitiveColors.white,
    successContrastAlt: primitiveColors.green[900],
    disabled: primitiveColors.gray[500],
    disabledContrast: primitiveColors.black,
    border: primitiveColors.gray[700],
    borderAlt: primitiveColors.gray[600],
    outline: primitiveColors.blue[500],
    surface: primitiveColors.gray[900],
    surfaceDarker: primitiveColors.black,
    surfaceLighter: primitiveColors.gray[800],
    text: primitiveColors.gray[100],
    textAlt: primitiveColors.white,
  },
};

export { primitiveColors, semanticColors };

export type { Mode, SemanticColorSet };
