import { NotifDayBefore, UserInput } from "../types";


export const handleToggleChange = (setState: React.Dispatch<React.SetStateAction<any>>, value: boolean, identifier: string) => {
  if (identifier === "notif") {
    setState((prevState: NotifDayBefore) => ({
      ...prevState,
      acceptedNotifDayBefore: value,
    }));
  } else if (identifier === "terms") {
    console.log("hello terms", value)
    setState((prevState: UserInput) => ({
      ...prevState,
      acceptTerms: value,
    }));
  }
}

export const handleSelectionChange = (value: string, setState: React.Dispatch<React.SetStateAction<number>>) => {
  setState(parseInt(value)); //currently only using for number selection, refactor if more generalised is needed.
};


export const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, setState: React.Dispatch<React.SetStateAction<any>>, state: any) => {
  const { name, value } = e.target;
  setState({ ...state, [name]: value });
};
