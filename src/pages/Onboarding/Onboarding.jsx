import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ONBOARDING_QUESTIONS } from "../../constants/onboardingQuestions";
import useAuthStore from "../../store/authStore";
import QuestionScreen from "./QuestionScreen";

export default function Onboarding() {

    const navigate = useNavigate();
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});

    // 로그아웃 상태로 이 화면에 남아 있으면 로그인 화면으로 되돌린다
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/", { replace: true });
        }
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) {
        return null;
    }

    const question = ONBOARDING_QUESTIONS[step];

    const handleSelect = (optionId) => {
        setAnswers({ ...answers, [question.id]: optionId });
    };

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    return (
        <QuestionScreen
            question={question}
            stepIndex={step}
            totalSteps={ONBOARDING_QUESTIONS.length}
            selectedId={answers[question.id]}
            onSelect={handleSelect}
            onBack={handleBack}
            onNext={handleNext}
        />
    );
}
