"use client";

import Select, { Props as SelectProps, StylesConfig } from "react-select";

export const defaultStyles: StylesConfig = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#FFF",
    color: "#000",
    border: !state.isFocused ? "1px solid rgb(255,255,255)" : "1px solid var(--ring)",
    borderRadius: "var(--radius-standard)",
    padding: "4px 12px",
    cursor: "pointer",
    minHeight: "36px",
    boxShadow: state.isFocused
      ? "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, oklab(0.707999 -0.00000712276 0.0000166297 / 0.5) 0px 0px 0px 3px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px"
      : "none",
    transition: "all 0.2s ease",
    "&:hover": {
      border: state.isFocused ? "1px solid var(--ring)" : "1px solid rgb(255,255,255)",
    },
  }),
  container: (base) => ({
    ...base,
    marginBottom: 0,
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: "var(--radius-standard)",
    marginTop: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    overflow: "hidden",
    zIndex: 100,
    padding: 4,
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
  valueContainer: (base) => ({
    ...base,
    padding: 0,
    paddingRight: 4,
    fontSize: 14,
    color: "#000",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "var(--primary)" : state.isFocused ? "#00000022" : "#fff",
    color: state.isSelected ? "#fff" : "#000",
    cursor: "pointer",
    padding: "4px 12px",
    borderRadius: "var(--radius-standard)",
    marginBottom: 4,
    fontSize: 14,
    "&:last-child": {
      marginBottom: 0,
    },
    "&:active": {
      backgroundColor: "var(--primary)",
      color: "#fff",
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: "var(--light-dark)",
    fontWeight: 300,
  }),
  singleValue: (base) => ({
    ...base,
    color: "#000",
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    padding: 0,
    color: "var(--off-black)",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  input: (base) => ({
    ...base,
    color: "#000",
    padding: 0,
  }),
};

const mergeStyles = (baseStyles: StylesConfig, override?: Partial<StylesConfig>): StylesConfig => {
  if (!override) return baseStyles;

  const merged: StylesConfig = { ...baseStyles };

  Object.entries(override).forEach(([key, overrideFn]) => {
    const k = key as keyof StylesConfig;

    if (typeof overrideFn === "function") {
      const defaultFn = baseStyles[k];

      merged[k] = (base: any, state: any) => {
        const defaultResult = typeof defaultFn === "function" ? defaultFn(base, state) : base;

        const overrideResult = overrideFn(base, state);

        return {
          ...defaultResult,
          ...overrideResult,
        };
      };
    }
  });

  return merged;
};

interface CustomSelectProps extends SelectProps {
  customStyles?: Partial<StylesConfig>;
}
export default function CustomSelect({
  options,
  placeholder = "Select...",
  customStyles,
  ...props
}: CustomSelectProps) {
  const finalStyles = mergeStyles(defaultStyles, customStyles);
  const instanceId =
    props.instanceId ||
    props.name ||
    String(placeholder || "custom-select")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") ||
    "custom-select";
  return (
    <Select
      instanceId={instanceId}
      options={options}
      styles={finalStyles}
      placeholder={placeholder}
      closeMenuOnSelect={!props?.isMulti}
      {...props}
    />
  );
}
