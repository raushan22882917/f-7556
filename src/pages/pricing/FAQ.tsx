const frequentlyAskedQuestions = [
  {
    question: "Can I switch plans later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    question: "Is there a student discount?",
    answer:
      "Yes! Students can get 50% off the Pro plan with a valid student email address.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Yes, we offer a 30-day money-back guarantee for all paid plans.",
  },
];

export function FAQ() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {frequentlyAskedQuestions.map((faq, index) => (
          <details
            key={index}
            className="p-4 border border-gray-300 rounded-lg shadow-md dark:border-gray-700"
          >
            <summary className="cursor-pointer text-xl font-semibold">
              {faq.question}
            </summary>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}