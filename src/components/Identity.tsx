import { useEffect, useRef, type FormEvent, type MouseEvent, type RefObject } from "react";
import { LOCATION, NAME, PHOTO_HEIGHT, PHOTO_WIDTH, ROLE, photoUrl } from "../data/portfolio";
import { bindLightDismiss, closeDialog, supportsTopLayerExit } from "../dialog";

const PHOTO_LABEL = `View photo of ${NAME}`;
const PHOTO_DIALOG_LABEL = `Photo of ${NAME}`;
const CLOSE_LABEL = "Close";
const PHOTO_DIALOG_ID = "photo-dialog";
const PHOTO_TITLE_ID = "photo-dialog-title";
const SHOW_MODAL = "show-modal";

export function Identity() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.setAttribute("closedby", "any");
    return bindLightDismiss(dialog);
  }, []);

  return (
    <div className="identity">
      <button
        type="button"
        className="photo-button"
        aria-label={PHOTO_LABEL}
        aria-haspopup="dialog"
        ref={bindPhotoButton}
        command={SHOW_MODAL}
        commandfor={PHOTO_DIALOG_ID}
        onClick={openPhoto}
      >
        <ProfilePhoto />
      </button>
      <PhotoViewer dialogRef={dialogRef} />
      <div className="identity-copy">
        <h1>{NAME}</h1>
        <p className="role">
          {ROLE} · {LOCATION}
        </p>
      </div>
    </div>
  );
}

function ProfilePhoto() {
  return (
    <img
      className="profile-photo"
      src={photoUrl()}
      alt={NAME}
      width={PHOTO_WIDTH}
      height={PHOTO_HEIGHT}
      fetchPriority="high"
    />
  );
}

function PhotoViewer({ dialogRef }: { dialogRef: RefObject<HTMLDialogElement | null> }) {
  return (
    <dialog
      id={PHOTO_DIALOG_ID}
      ref={dialogRef}
      className="photo-dialog"
      closedby="any"
      aria-labelledby={PHOTO_TITLE_ID}
      onCancel={(event) => keepOpenForExit(event, dialogRef.current)}
    >
      <h2 id={PHOTO_TITLE_ID} className="visually-hidden">
        {PHOTO_DIALOG_LABEL}
      </h2>
      <LargePhoto />
      <form method="dialog" onSubmit={(event) => keepOpenForExit(event, dialogRef.current)}>
        <ClosePhoto />
      </form>
    </dialog>
  );
}

function LargePhoto() {
  return (
    <img
      className="photo-large"
      src={photoUrl()}
      alt={NAME}
      width={PHOTO_WIDTH}
      height={PHOTO_HEIGHT}
      decoding="async"
      loading="lazy"
      fetchPriority="low"
    />
  );
}

function ClosePhoto() {
  return (
    <button type="submit" className="photo-close" ref={markAutofocus}>
      <span aria-hidden="true">×</span>
      <span className="visually-hidden">{CLOSE_LABEL}</span>
    </button>
  );
}

function bindPhotoButton(node: HTMLButtonElement | null): void {
  if (!node) return;
  node.setAttribute("commandfor", PHOTO_DIALOG_ID);
  node.setAttribute("command", SHOW_MODAL);
}

function openPhoto(event: MouseEvent<HTMLButtonElement>): void {
  const button = event.currentTarget;
  const nativeCommand = "commandForElement" in HTMLButtonElement.prototype;
  if (nativeCommand && button.getAttribute("commandfor") === PHOTO_DIALOG_ID) return;
  event.preventDefault();
  const dialog = document.getElementById(PHOTO_DIALOG_ID);
  if (dialog instanceof HTMLDialogElement && !dialog.open) dialog.showModal();
}

function keepOpenForExit(event: FormEvent | Event, dialog: HTMLDialogElement | null): void {
  if (!dialog || supportsTopLayerExit()) return;
  event.preventDefault();
  void closeDialog(dialog);
}

function markAutofocus(node: HTMLButtonElement | null): void {
  node?.setAttribute("autofocus", "");
}
