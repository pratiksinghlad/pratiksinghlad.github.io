const TOP_LAYER_EXIT_LIMIT_MS = 2000;
const CLOSING_ATTRIBUTE = "data-closing";

let displayTransition: boolean | undefined;

export function bindLightDismiss(dialog: HTMLDialogElement): () => void {
  if ("closedBy" in HTMLDialogElement.prototype) return () => undefined;
  return listenForBackdrop(dialog);
}

export function supportsTopLayerExit(): boolean {
  return supportsOverlay() && canTransitionDisplay();
}

export async function closeDialog(dialog: HTMLDialogElement): Promise<void> {
  if (dialog.hasAttribute(CLOSING_ATTRIBUTE)) return;
  if (supportsTopLayerExit()) {
    dialog.close();
    return;
  }
  await playExit(dialog);
}

function listenForBackdrop(dialog: HTMLDialogElement): () => void {
  let pressedOutside = false;
  const onDown = (event: PointerEvent) => {
    pressedOutside = isOutside(event, dialog);
  };
  const onUp = (event: PointerEvent) => {
    const shouldClose = pressedOutside && isOutside(event, dialog);
    pressedOutside = false;
    if (shouldClose) void closeDialog(dialog);
  };
  dialog.addEventListener("pointerdown", onDown);
  dialog.addEventListener("pointerup", onUp);
  return () => {
    dialog.removeEventListener("pointerdown", onDown);
    dialog.removeEventListener("pointerup", onUp);
  };
}

function isOutside(event: PointerEvent, dialog: HTMLDialogElement): boolean {
  const rect = dialog.getBoundingClientRect();
  const outsideX = event.clientX < rect.left || event.clientX > rect.right;
  const outsideY = event.clientY < rect.top || event.clientY > rect.bottom;
  return outsideX || outsideY;
}

function supportsOverlay(): boolean {
  return window.CSS?.supports("overlay", "auto") === true;
}

function canTransitionDisplay(): boolean {
  if (displayTransition !== undefined) return displayTransition;
  displayTransition = probeDisplayTransition();
  return displayTransition;
}

function probeDisplayTransition(): boolean {
  if (!window.CSS?.supports("transition-behavior", "allow-discrete") || !document.body)
    return false;
  const probe = document.createElement("div");
  probe.style.cssText = "transition: display 1s allow-discrete !important; display: block;";
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = "none";
  const supported = getComputedStyle(probe).display === "block";
  probe.remove();
  return supported;
}

async function playExit(dialog: HTMLDialogElement): Promise<void> {
  dialog.setAttribute(CLOSING_ATTRIBUTE, "");
  const animations = dialog.getAnimations({ subtree: true });
  if (animations.length > 0) await settle(animations);
  if (!dialog.hasAttribute(CLOSING_ATTRIBUTE)) return;
  dialog.removeAttribute(CLOSING_ATTRIBUTE);
  dialog.close();
}

async function settle(animations: readonly Animation[]): Promise<void> {
  await Promise.race([
    Promise.allSettled(animations.map((animation) => animation.finished)),
    wait(TOP_LAYER_EXIT_LIMIT_MS),
  ]);
}

function wait(durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, durationMs);
  });
}
