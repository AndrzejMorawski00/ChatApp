import { UserDataForm } from "../../types/userDataTypes";

export const isValidProfileForm = (formData : UserDataForm): boolean => {
    return !!formData.firstName.trim() && !!formData.lastName.trim()    
}