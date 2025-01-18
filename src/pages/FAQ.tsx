import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function FAQ() {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  const predefinedQuestions = [
    { question: 'How do I reset my password?', answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page and following the instructions.' },
    { question: 'How can I contact support?', answer: 'You can contact support by visiting our "Contact Us" page or sending an email to support@companyname.com.' },
    { question: 'What is this platform about?', answer: 'This platform helps users prepare for interviews by providing resources, study materials, and a personalized experience.' },
    { question: 'How can I access interview preparation materials?', answer: 'You can access materials through our dashboard after signing up.' },
    { question: 'What are the benefits of premium features?', answer: 'Premium features include unlimited access to study materials, expert sessions, and advanced analytics.' },
    { question: 'How secure is my data on this platform?', answer: 'We prioritize data security using encryption and secure protocols.' },
  ];

  return (
    <div className="container py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {predefinedQuestions.map((qa, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm"
          >
            <button
              onClick={() => toggleAnswer(index)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-lg font-semibold">{qa.question}</span>
              {index === expandedQuestion ? (
                <Minus className="flex-shrink-0" />
              ) : (
                <Plus className="flex-shrink-0" />
              )}
            </button>
            {index === expandedQuestion && (
              <p className="mt-4 text-gray-600 dark:text-gray-300">{qa.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}