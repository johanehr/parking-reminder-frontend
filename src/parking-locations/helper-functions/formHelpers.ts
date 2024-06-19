import { NotifDayBefore } from "../types";


export const handleToggleChange = (stateSetter: React.Dispatch<React.SetStateAction<any>>, value: boolean, identifier: string) => {
    if (identifier === "notif") {
        stateSetter((prevState: NotifDayBefore) => ({
            ...prevState,
            acceptedNotifDayBefore: value,
        }));
    } else if (identifier === "terms") {
        stateSetter(value);
    }
};

export const handleSelectionChange = (value: string, stateSetter: React.Dispatch<React.SetStateAction<number>>) => {
    stateSetter(parseInt(value)); //currently only using for number selection, refactor if more generalised is needed.
  };


  export const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, setState: React.Dispatch<React.SetStateAction<any>>, state: any) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };
  