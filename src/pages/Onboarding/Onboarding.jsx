import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ONBOARDING_QUESTIONS } from "../../constants/onboardingQuestions";
import useAuthStore from "../../store/authStore";
import useOnboardingStore from "../../store/onboardingStore";
import QuestionScreen from "./QuestionScreen";
import OnboardingLoading from "./OnboardingLoading";

export default function Onboarding() {

    const navigate = useNavigate();
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);

    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});

    // 로그아웃 상태로 이 화면에 남아 있으면 로그인 화면으로 되돌린다
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/", { replace: true });
        }
    }, [isLoggedIn, navigate]);

    // 문항이 바뀌면 스크롤을 맨 위로 되돌린다. 스크롤 컨테이너(RootLayout의 <main>)는
    // 문항 전환 시 언마운트되지 않아 이전 문항의 스크롤 위치가 그대로 남는다.
    useEffect(() => {
        document.querySelector("main")?.scrollTo({ top: 0 });
    }, [step]);

    if (!isLoggedIn) {
        return null;
    }

    const question = ONBOARDING_QUESTIONS[step];

    if (step >= ONBOARDING_QUESTIONS.length) {
        return <OnboardingLoading />;
    }

    const handleSelect = (optionId) => {
        setAnswers({ ...answers, [question.id]: optionId });
    };

    const handleNext = () => {
        // 마지막 문항이면 답변을 저장하고 로딩 화면으로 넘어간다
        if (step === ONBOARDING_QUESTIONS.length - 1) {
            completeOnboarding({ ...answers });
        }
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
