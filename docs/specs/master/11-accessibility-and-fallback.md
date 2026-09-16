# 11: Accessibility, Errors & Fallback

Part of the [legaspi.dev Master Spec](../legaspi_dev_master_spec.md). Covers original sections §29, §34.

---

## 29. Accessibility

The 3D city must never be the only way to access content.

Requirements:

- all projects reachable through DOM navigation;
- keyboard-accessible project list;
- project panel uses correct focus management;
- visible focus styles;
- buttons use semantic `<button>`;
- links use semantic `<a>`;
- selected project state announced appropriately;
- all project text available outside WebGL;
- media has alt text;
- touch targets remain large enough on mobile;
- no information is available only on hover;
- honor `prefers-reduced-motion`.

### Reduced motion

When reduced motion is enabled:

- camera transitions become extremely short or immediate;
- panel animations are reduced;
- decorative continuous animation is disabled;
- core functionality remains unchanged.

---

## 34. Error and Fallback Behavior

If WebGL fails:

Show a normal HTML portfolio instead of a fatal screen.

At minimum provide:

- name/title;
- project navigation;
- project case studies;
- About;
- Contact;
- Resume.

If a project building asset fails:

- retain the project in HTML navigation;
- render a basic fallback building shape if practical;
- do not make the project inaccessible.

If a localized Markdown file is missing:

- fallback to English;
- log a development warning;
- never render an empty project panel.
