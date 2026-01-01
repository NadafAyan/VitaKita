import { DiagnosticTest } from "@/components/feature/diagnostic-test";

export default function OnboardingPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Let's check in</h1>
                <p className="text-gray-600 max-w-md mx-auto">
                    To provide the best support, we need to understand how you've been feeling lately.
                    Your answers are private and help us tailor your experience.
                </p>
            </div>
            <DiagnosticTest />
        </div>
    );
}
