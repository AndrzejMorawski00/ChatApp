export type RegisterFormType = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    repeatPassword: string;
};

export type LoginFormType = {
    email: string;
    password: string;
};

export type useLoginUserType = {
    loginUser: ({ email, password }: LoginFormType) => Promise<void>;
    loading: boolean;
    error: string | null;
};

export type useLogoutType = {
    logoutUser: () => void;
};

export type useRegisterUserType = {
    registerUser: (registerData: RegisterFormType) => Promise<void>;
    loading: boolean;
    error: string | null;
};
