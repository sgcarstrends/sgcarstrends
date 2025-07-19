import { compareAsc, compareDesc } from "date-fns";

const sortAscendingDates = (dates: Date[]) => [...dates].sort(compareAsc);

const sortDescendingDates = (dates: Date[]) => [...dates].sort(compareDesc);

export { sortAscendingDates, sortDescendingDates };
