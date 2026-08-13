import { createContext } from 'react';

export type NavRefs = {
	menu: React.MutableRefObject<HTMLDialogElement | null>;
	cart: React.MutableRefObject<HTMLDialogElement | null>;
	search: React.MutableRefObject<HTMLDialogElement | null>;
};

export default createContext<NavRefs | null>( null );
