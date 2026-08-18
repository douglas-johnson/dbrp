import {forwardRef, type ForwardedRef, type ReactNode} from 'react';

type DialogProps = {
  children?: ReactNode;
};

export default forwardRef<HTMLDialogElement, DialogProps>(Dialog);

function Dialog({children}: DialogProps, ref: ForwardedRef<HTMLDialogElement>) {
  return (
    <dialog className="dbrp-dialog" ref={ref}>
      <div className="dbrp-dialog-header">
        <button
          className="button is-transparent"
          type="button"
          onClick={(e) => e.currentTarget.closest('dialog')?.close()}
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M2.4,24l-2.4-2.4,9.6-9.6L0,2.4,2.4,0l9.6,9.6L21.6,0l2.4,2.4-9.6,9.6,9.6,9.6-2.4,2.4-9.6-9.6L2.4,24Z" />
          </svg>
        </button>
      </div>
      <div className="dbrp-dialog-content">{children}</div>
    </dialog>
  );
}
