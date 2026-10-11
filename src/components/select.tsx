"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  HiOutlineCheck,
  HiOutlineChevronDown,
  HiOutlineXMark,
} from "react-icons/hi2";

const MENU_GAP = 6;
const MENU_MAX_HEIGHT = 288;
const VIEWPORT_PAD = 8;

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectGroup = {
  label: string;
  options: SelectOption[];
};

type SelectProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options?: SelectOption[];
  groups?: SelectGroup[];
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
  variant?: "field" | "filter";
  active?: boolean;
  onClear?: () => void;
  clearLabel?: string;
  className?: string;
};

type FlatOption = {
  option: SelectOption;
  index: number;
};

type MenuEntry =
  | ({ type: "option" } & FlatOption)
  | {
      type: "group";
      label: string;
      key: string;
      options: FlatOption[];
    };

type MenuPlacement = {
  openUp: boolean;
  style: CSSProperties;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function buildMenu(options: SelectOption[], groups: SelectGroup[]) {
  const flat: SelectOption[] = [];
  const entries: MenuEntry[] = [];

  function addOption(option: SelectOption, group?: Extract<MenuEntry, { type: "group" }>) {
    const item = { option, index: flat.length };
    flat.push(option);
    if (group) group.options.push(item);
    else entries.push({ type: "option", ...item });
  }

  for (const option of options) addOption(option);

  groups.forEach((group, groupIndex) => {
    const entry: Extract<MenuEntry, { type: "group" }> = {
      type: "group",
      label: group.label,
      key: `${group.label}-${groupIndex}`,
      options: [],
    };
    for (const option of group.options) addOption(option, entry);
    if (entry.options.length > 0) entries.push(entry);
  });

  return { flat, entries };
}

function measureMenu(trigger: HTMLElement): MenuPlacement | "closed" | null {
  const rect = trigger.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > window.innerHeight) return "closed";
  if (rect.width < 1 || rect.height < 1) return null;

  const width = Math.min(rect.width, window.innerWidth - VIEWPORT_PAD * 2);
  const left = Math.max(
    VIEWPORT_PAD,
    Math.min(rect.left, window.innerWidth - width - VIEWPORT_PAD),
  );
  const spaceBelow = window.innerHeight - rect.bottom - MENU_GAP - VIEWPORT_PAD;
  const spaceAbove = rect.top - MENU_GAP - VIEWPORT_PAD;
  const openUp = spaceBelow < 200 && spaceAbove > spaceBelow;
  const maxHeight = Math.max(
    96,
    Math.min(MENU_MAX_HEIGHT, openUp ? spaceAbove : spaceBelow),
  );

  const style: CSSProperties = {
    position: "fixed",
    margin: 0,
    left,
    width,
    maxHeight,
    right: "auto",
  };

  if (openUp) {
    style.top = "auto";
    style.bottom = window.innerHeight - rect.top + MENU_GAP;
  } else {
    style.top = rect.bottom + MENU_GAP;
    style.bottom = "auto";
  }

  return { openUp, style };
}

function stepIndex(flat: SelectOption[], from: number, direction: 1 | -1) {
  if (flat.length === 0) return -1;
  let index = from < 0 ? (direction === 1 ? -1 : flat.length) : from;
  index += direction;
  while (index >= 0 && index < flat.length) {
    if (!flat[index]?.disabled) return index;
    index += direction;
  }
  return from >= 0 && flat[from] && !flat[from].disabled ? from : -1;
}

function findByPrefix(flat: SelectOption[], query: string, start: number) {
  const normalized = query.toLocaleLowerCase();
  if (!normalized || flat.length === 0) return -1;
  for (let offset = 0; offset < flat.length; offset += 1) {
    const index = (start + offset) % flat.length;
    const option = flat[index];
    if (!option || option.disabled) continue;
    if (option.label.toLocaleLowerCase().startsWith(normalized)) return index;
  }
  return -1;
}

function optionClass(selected: boolean, active: boolean, disabled: boolean) {
  return cx(
    "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
    disabled && "cursor-not-allowed text-foreground-disabled",
    !disabled && "cursor-pointer",
    !disabled && selected && "bg-accent-soft font-medium text-foreground",
    !disabled && !selected && active && "bg-background-muted text-foreground",
    !disabled && !selected && !active && "text-foreground hover:bg-background-muted",
  );
}

export function Select({
  id,
  label,
  value,
  onChange,
  onBlur,
  options,
  groups,
  placeholder,
  disabled = false,
  invalid = false,
  describedBy,
  variant = "field",
  active,
  onClear,
  clearLabel,
  className,
}: SelectProps) {
  const reactId = useId();
  const triggerId = id ?? reactId;
  const listboxId = `${triggerId}-listbox`;
  const labelId = `${triggerId}-label`;
  const valueId = `${triggerId}-value`;
  const showFieldLabel = variant !== "filter" && Boolean(label);

  const built = useMemo(
    () => buildMenu(options ?? [], groups ?? []),
    [options, groups],
  );
  const selectedIndex = built.flat.findIndex((option) => option.value === value);
  const selected = selectedIndex >= 0 ? built.flat[selectedIndex] : undefined;
  const isPlaceholder = value.length === 0;
  const triggerText = isPlaceholder
    ? (placeholder ?? selected?.label ?? "")
    : (selected?.label ?? placeholder ?? "");
  const isActive = active ?? Boolean(value);
  const showClear =
    variant === "filter" && isActive && Boolean(onClear) && !disabled;
  const showChevron = !showClear && !(variant === "filter" && disabled);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [placement, setPlacement] = useState<MenuPlacement | null>(null);

  if (disabled && open) setOpen(false);

  const controlRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pointerInsideMenu = useRef(false);
  const pointerOrigin = useRef<{ x: number; y: number; index: number } | null>(
    null,
  );
  const typeaheadQuery = useRef("");
  const typeaheadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrolledIndex = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (typeaheadTimer.current) clearTimeout(typeaheadTimer.current);
    },
    [],
  );

  useLayoutEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!trigger || !menu) return;

    function place() {
      const next = measureMenu(trigger!);
      if (next === "closed") {
        setOpen(false);
        return;
      }
      if (!next) return;
      setPlacement((current) => {
        if (
          current &&
          current.openUp === next.openUp &&
          current.style.top === next.style.top &&
          current.style.left === next.style.left &&
          current.style.bottom === next.style.bottom &&
          current.style.width === next.style.width &&
          current.style.maxHeight === next.style.maxHeight
        ) {
          return current;
        }
        return next;
      });
    }

    place();

    const popover = menu as HTMLDivElement & {
      showPopover?: () => void;
      hidePopover?: () => void;
    };
    if (typeof popover.showPopover === "function") {
      try {
        if (!popover.matches(":popover-open")) popover.showPopover();
      } catch {
        // Already showing.
      }
    } else {
      menu.removeAttribute("popover");
    }

    function onScroll(event: Event) {
      if (
        menu &&
        event.target instanceof Node &&
        menu.contains(event.target)
      ) {
        return;
      }
      place();
    }

    window.addEventListener("resize", place);
    window.addEventListener("scroll", onScroll, true);
    const observer = new ResizeObserver(place);
    observer.observe(trigger);

    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", onScroll, true);
      observer.disconnect();
      try {
        if (popover.isConnected && popover.matches(":popover-open")) {
          popover.hidePopover?.();
        }
      } catch {
        // The menu is already closed.
      }
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) {
      scrolledIndex.current = null;
      return;
    }
    if (!placement || activeIndex < 0) return;
    if (scrolledIndex.current === activeIndex) return;
    const menu = menuRef.current;
    const node = document.getElementById(`${listboxId}-option-${activeIndex}`);
    if (!menu || !node || menu.clientHeight === 0) return;
    const menuRect = menu.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    if (nodeRect.top < menuRect.top - 1) {
      menu.scrollTop -= menuRect.top - nodeRect.top;
    } else if (nodeRect.bottom > menuRect.bottom + 1) {
      menu.scrollTop += nodeRect.bottom - menuRect.bottom;
    }
    scrolledIndex.current = activeIndex;
  }, [open, placement, activeIndex, listboxId]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (controlRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
    }

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function highlightedIndex() {
    if (selectedIndex >= 0 && !built.flat[selectedIndex]?.disabled) {
      return selectedIndex;
    }
    return stepIndex(built.flat, -1, 1);
  }

  function openMenu(index: number) {
    if (disabled || built.flat.length === 0) return;
    setActiveIndex(index);
    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
  }

  function commit(index: number) {
    const option = built.flat[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }

  function pushTypeahead(char: string) {
    typeaheadQuery.current += char.toLocaleLowerCase();
    const query = typeaheadQuery.current;
    const start =
      query.length === 1 ? activeIndex + 1 : Math.max(activeIndex, 0);
    const match = findByPrefix(built.flat, query, start);
    if (typeaheadTimer.current) clearTimeout(typeaheadTimer.current);
    typeaheadTimer.current = setTimeout(() => {
      typeaheadQuery.current = "";
    }, 500);
    return match;
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      if (!open) {
        openMenu(stepIndex(built.flat, selectedIndex, direction));
        return;
      }
      setActiveIndex((current) => stepIndex(built.flat, current, direction));
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      const first = stepIndex(built.flat, -1, 1);
      if (!open) openMenu(first);
      else setActiveIndex(first);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      const last = stepIndex(built.flat, built.flat.length, -1);
      if (!open) openMenu(last);
      else setActiveIndex(last);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        openMenu(highlightedIndex());
        return;
      }
      if (activeIndex >= 0) commit(activeIndex);
      return;
    }

    if (event.key === "Escape") {
      if (!open) return;
      event.preventDefault();
      event.stopPropagation();
      closeMenu();
      return;
    }

    if (event.key === "Tab") {
      closeMenu();
      return;
    }

    if (
      event.key.length === 1 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey
    ) {
      const match = pushTypeahead(event.key);
      if (match < 0) return;
      event.preventDefault();
      setActiveIndex(match);
      setOpen(true);
    }
  }

  function handleBlur(event: ReactFocusEvent<HTMLButtonElement>) {
    const next = event.relatedTarget as Node | null;
    if (
      next &&
      (menuRef.current?.contains(next) || controlRef.current?.contains(next))
    ) {
      return;
    }
    if (pointerInsideMenu.current) {
      requestAnimationFrame(() => {
        if (menuRef.current?.isConnected) {
          triggerRef.current?.focus({ preventScroll: true });
        }
      });
      return;
    }
    setOpen(false);
    onBlur?.();
  }

  function handleOptionPointerDown(event: ReactPointerEvent, index: number) {
    pointerInsideMenu.current = true;
    pointerOrigin.current = { x: event.clientX, y: event.clientY, index };
    if (event.pointerType === "mouse") event.preventDefault();
  }

  function handleOptionPointerUp(event: ReactPointerEvent, index: number) {
    const origin = pointerOrigin.current;
    pointerOrigin.current = null;
    pointerInsideMenu.current = false;
    if (!origin || origin.index !== index) return;
    const moved =
      Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > 8;
    if (moved || built.flat[index]?.disabled) return;
    commit(index);
  }

  function renderOption({ option, index }: FlatOption) {
    const isSelected = option.value === value;
    const isHighlighted = index === activeIndex;
    return (
      <div
        key={`${option.value}-${index}`}
        id={`${listboxId}-option-${index}`}
        role="option"
        aria-selected={isSelected}
        aria-disabled={option.disabled || undefined}
        title={option.label}
        onPointerMove={() => {
          if (!option.disabled && activeIndex !== index) setActiveIndex(index);
        }}
        onPointerDown={(event) => handleOptionPointerDown(event, index)}
        onPointerUp={(event) => handleOptionPointerUp(event, index)}
        className={optionClass(isSelected, isHighlighted, Boolean(option.disabled))}>
        <span
          className={cx(
            "min-w-0 flex-1 truncate",
            option.value === "" && !isSelected && "text-foreground-muted",
          )}>
          {option.label}
        </span>
        <span className="flex size-4 shrink-0 items-center justify-center text-accent">
          {isSelected ? <HiOutlineCheck className="size-4" aria-hidden /> : null}
        </span>
      </div>
    );
  }

  const menu =
    open ? (
      <div
        ref={menuRef}
        id={listboxId}
        role="listbox"
        aria-labelledby={showFieldLabel ? labelId : triggerId}
        popover="manual"
        onPointerDown={(event) => {
          pointerInsideMenu.current = true;
          if (event.pointerType === "mouse") event.preventDefault();
        }}
        onPointerUp={() => {
          pointerInsideMenu.current = false;
        }}
        onPointerCancel={() => {
          pointerInsideMenu.current = false;
          pointerOrigin.current = null;
        }}
        style={
          placement
            ? placement.style
            : {
                position: "fixed",
                margin: 0,
                visibility: "hidden",
                top: 0,
                left: 0,
              }
        }
        className={cx(
          "select-menu z-[var(--z-modal)] overflow-auto overscroll-contain border border-border bg-background-elevated p-1 text-foreground shadow-lg outline-none",
          variant === "filter" ? "rounded-lg" : "rounded-xl",
          placement && (placement.openUp ? "select-menu-up" : "select-menu-down"),
        )}>
        {built.entries.map((entry) => {
          if (entry.type === "option") return renderOption(entry);
          return (
            <div key={entry.key} role="group" aria-label={entry.label}>
              <div className="sticky top-0 bg-background-elevated px-3.5 pb-1 pt-2 text-xs font-medium text-foreground-subtle">
                {entry.label}
              </div>
              {entry.options.map((item) => renderOption(item))}
            </div>
          );
        })}
      </div>
    ) : null;

  return (
    <div className={cx("w-full min-w-0", showFieldLabel && "space-y-1.5", className)}>
      {showFieldLabel ? (
        <label
          id={labelId}
          htmlFor={triggerId}
          className="block text-sm font-medium text-foreground">
          {label}
        </label>
      ) : null}

      <div ref={controlRef} className="relative">
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={
            open && activeIndex >= 0
              ? `${listboxId}-option-${activeIndex}`
              : undefined
          }
          aria-labelledby={
            showFieldLabel ? `${labelId} ${valueId}` : undefined
          }
          aria-label={
            variant === "filter"
              ? isActive && !disabled && selected
                ? `${label}: ${selected.label}`
                : label
              : undefined
          }
          aria-describedby={describedBy}
          onClick={() => {
            if (open) closeMenu();
            else openMenu(highlightedIndex());
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={
            variant === "filter"
              ? cx(
                  "relative flex min-h-13 w-full min-w-0 flex-col justify-center rounded-lg border bg-background-surface px-3 py-2.5 pr-9 text-left outline-none transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset",
                  disabled
                    ? "cursor-not-allowed border-border/60 bg-background-subtle/50 opacity-70"
                    : open
                      ? "border-foreground-subtle/50"
                      : "border-border hover:border-foreground-subtle/50",
                )
              : cx(
                  "relative flex w-full min-w-0 items-center rounded-xl border bg-background-surface px-4 py-2.5 pr-10 text-left outline-none transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                  invalid
                    ? "border-error focus-visible:ring-error"
                    : cx(
                        "focus-visible:ring-ring",
                        open ? "border-ring" : "border-border",
                      ),
                )
          }>
          {variant === "filter" ? (
            isActive && !disabled ? (
              <>
                <span className="text-xs text-foreground-muted">{label}</span>
                <span className="min-w-0 truncate text-sm font-semibold text-foreground">
                  {selected?.label}
                </span>
              </>
            ) : (
              <span className="min-w-0 truncate text-sm text-foreground-muted">
                {disabled ? (built.flat[0]?.label ?? label) : label}
              </span>
            )
          ) : (
            <span
              id={valueId}
              className={cx(
                "min-w-0 truncate",
                isPlaceholder ? "text-foreground-subtle" : "text-foreground",
              )}>
              {triggerText}
            </span>
          )}
          {showChevron ? (
            <HiOutlineChevronDown
              className={cx(
                "pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-foreground-subtle transition-transform duration-150",
                open && "rotate-180",
              )}
              aria-hidden
            />
          ) : null}
        </button>

        {showClear ? (
          <button
            type="button"
            aria-label={clearLabel}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setOpen(false);
              onClear?.();
            }}
            className="absolute right-2.5 top-1/2 z-10 -translate-y-1/2 rounded p-0.5 text-foreground-subtle transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <HiOutlineXMark className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>

      {menu ? createPortal(menu, document.body) : null}
    </div>
  );
}
