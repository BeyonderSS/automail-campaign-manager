import { CheckIcon } from 'lucide-react'

export function ProgressBar({ currentStep, totalSteps }) {
  const steps = ['Enter Details', 'Upload File & Select Template', 'Preview & Trigger Loop']

  return (
    <div className="flex items-center space-x-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index + 1 <= currentStep ? 'dark:bg-purple-dark bg-purple text-white' : 'dark:bg-purple-dark/20 bg-purple/20 text-gray-500'
            }`}
          >
            {index + 1 < currentStep ? <CheckIcon className="w-5 h-5" /> : index + 1}
          </div>
          <div className="ml-2 text-sm font-medium">{step}</div>
          {index < totalSteps - 1 && (
            <div
              className={`h-1 w-16 mx-2 ${index + 1 < currentStep ? 'dark:bg-purple-dark bg-purple' : 'bg-gray-200'}`}
            ></div>
          )}
        </div>
      ))}
    </div>
  )
}

