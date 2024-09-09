import { forwardRef } from "react";

export default forwardRef( Dialog );

function Dialog( props, ref ) {

	return (
		<dialog className="dbrp-dialog" ref={ref}>
			<button type="button" onClick={() => ref.current?.close()}> Close </button>
			{props.children}
		</dialog>
	)

}
