import { forwardRef } from "react";

export default forwardRef( Dialog );

function Dialog( props, ref ) {

	return (
		<dialog ref={ref}>
			{props.children}
			<button type="button" onClick={() => ref.current?.close()}> Close </button>
		</dialog>
	)

}
