import { useRef, type MouseEvent, type RefObject } from "react";
import { LOCATION, NAME, ROLE, photoLargeUrl, photoUrl } from "../data/portfolio";

const PHOTO_LABEL = `View photo of ${NAME}`;
const CLOSE_LABEL = "Close";
const THUMB_SIZE = 144;
const LARGE_SIZE = 320;

export function Identity() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div className="identity">
      <button
        type="button"
        className="photo-button"
        aria-label={PHOTO_LABEL}
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
      >
        <img
          className="profile-photo"
          src={photoUrl()}
          alt={NAME}
          width={THUMB_SIZE}
          height={THUMB_SIZE}
          fetchPriority="high"
        />
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

function PhotoViewer({ dialogRef }: { dialogRef: RefObject<HTMLDialogElement | null> }) {
  return (
    <dialog
      ref={dialogRef}
      className="photo-dialog"
      aria-label={NAME}
      onClick={(event) => closeIfBackdrop(event, dialogRef)}
    >
      <button
        type="button"
        className="photo-close"
        aria-label={CLOSE_LABEL}
        onClick={() => dialogRef.current?.close()}
      >
        ×
      </button>
      <img
        className="photo-large"
        src={photoLargeUrl()}
        alt={NAME}
        width={LARGE_SIZE}
        height={LARGE_SIZE}
        loading="lazy"
      />
    </dialog>
  );
}

function closeIfBackdrop(
  event: MouseEvent<HTMLDialogElement>,
  dialogRef: RefObject<HTMLDialogElement | null>,
): void {
  if (event.target === event.currentTarget) dialogRef.current?.close();
}
