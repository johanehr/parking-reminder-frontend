import { NotifUnsocialHours, UserInput } from "../types";

export const handleSelectionChange = (value: string, setState: React.Dispatch<React.SetStateAction<number>>) => {
  setState(parseInt(value)); //currently only using for number selection, refactor if more generalised is needed.
};


export const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, setState: React.Dispatch<React.SetStateAction<any>>, state: any) => {
  const { name, value } = e.target;
  setState({ ...state, [name]: value });
};
