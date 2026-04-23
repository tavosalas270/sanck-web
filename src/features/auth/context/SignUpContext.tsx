'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { z } from 'zod';
import {
    walletSelectionSchema,
    emailLinkSchema,
    verificationCodeSchema,
    setCredentialsSchema,
} from '../schemas';

export type SubSectionType = 'create' | 'verify' | 'credentials';

export type WalletSelectionData = z.infer<typeof walletSelectionSchema>;
export type LinkEmailData = z.infer<typeof emailLinkSchema>;
export type VerifyCodeData = z.infer<typeof verificationCodeSchema>;
export type SetCredentialsData = z.infer<typeof setCredentialsSchema>;

interface SignUpLoginContextProps {
    tabSelected: 'login' | 'sign';
    setTabSelected: (tab: 'login' | 'sign') => void;
    subSectionSelected: SubSectionType;
    setSubSectionSelected: (section: SubSectionType) => void;
    
    // Form Data States
    walletData: WalletSelectionData;
    setWalletData: (data: WalletSelectionData) => void;
    linkEmailData: LinkEmailData;
    setLinkEmailData: (data: LinkEmailData) => void;
    verifyCodeData: VerifyCodeData;
    setVerifyCodeData: (data: VerifyCodeData) => void;
    setCredentialsData: SetCredentialsData;
    setSetCredentialsData: (data: SetCredentialsData) => void;
    signUpStep: number;
    setSignUpStep: (step: number) => void;
}

const SignUpLoginContext = createContext<SignUpLoginContextProps | undefined>(undefined);

export function SignUpLoginProvider({ children }: { children: ReactNode }) {
    const [tabSelected, setTabSelected] = useState<'login' | 'sign'>('login');
    const [subSectionSelected, setSubSectionSelected] = useState<SubSectionType>('create');
    const [signUpStep, setSignUpStep] = useState<number>(1);

    const [walletData, setWalletData] = useState<WalletSelectionData>({
        walletType: 'snak',
    });

    const [linkEmailData, setLinkEmailData] = useState<LinkEmailData>({
        walletType: 'snak',
        email: '',
        acceptedTerms: false,
    });

    const [verifyCodeData, setVerifyCodeData] = useState<VerifyCodeData>({
        walletType: 'snak',
        email: '',
        acceptedTerms: false,
        verificationCode: '',
    });

    const [setCredentialsData, setSetCredentialsData] = useState<SetCredentialsData>({
        username: '',
        password: '',
        confirmPassword: '',
    });

    return (
        <SignUpLoginContext.Provider value={{
            tabSelected,
            setTabSelected,
            subSectionSelected,
            setSubSectionSelected,
            walletData,
            setWalletData,
            linkEmailData,
            setLinkEmailData,
            verifyCodeData,
            setVerifyCodeData,
            setCredentialsData,
            setSetCredentialsData,
            signUpStep,
            setSignUpStep,
        }}>
            {children}
        </SignUpLoginContext.Provider>
    );
}

export function useSignUpContext() {
    const context = useContext(SignUpLoginContext);
    if (context === undefined) {
        throw new Error('useSignUpContext must be used within a SignUpLoginProvider');
    }
    return context;
}