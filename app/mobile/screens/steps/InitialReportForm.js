import React, {useState} from 'react';
import PhoneNumberStep from './PhoneNumberStep';

function InitialReportForm({onExitPress}) {
    const [currentStep, setCurrentStep] = useState(0);
    const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState('');
    const [age, setAge] = useState();

    function nextStep() {
        setCurrentStep(currentStep + 1);
    }

    function previousStep() {
        setCurrentStep(currentStep - 1);
    }

    function handleVerifiedPhoneNumberChange(phoneNumber) {
        setVerifiedPhoneNumber(phoneNumber);
    }

    function handleAgeChange(age) {}

    switch (currentStep) {
        case 0: {
            // since there's no secondary action, there's no back button
            return (
                <PhoneNumberStep
                    primaryAction={
                        verifiedPhoneNumber ? t('report.nextAction') : t('report.skipAction')
                    }
                    onPrimaryActionPress={nextStep}
                    onExitPress={onExitPress}
                    onPhoneNumberVerified={handleVerifiedPhoneNumberChange}
                />
            );
        }
        case 1: {
            return (
                <AgeStep
                    primaryAction={
                        verifiedPhoneNumber ? t('report.nextAction') : t('report.skipAction')
                    }
                    onPrimaryActionPress={nextStep}
                    onExitPress={onExitPress}
                    onPhoneNumberVerified={handleVerifiedPhoneNumberChange}
                />
            );
        }
        default: {
            return null;
        }
    }
}
