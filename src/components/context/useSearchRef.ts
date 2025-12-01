import { useContext } from "react";
import {SearchRefContext} from "./SearchRefContext.ts";

export const useSearchRef = () => useContext(SearchRefContext);

