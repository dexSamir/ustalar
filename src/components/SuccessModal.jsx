import React from 'react'
import { useNavigate } from "react-router-dom"
import { CheckCircle, User } from 'lucide-react'

const SuccessModal = ({
  isOpen,
  onClose,
  type = "success",
  title = "Profiliniz uğurla yaradıldı!",
  message = "Hesabınıza daxil olaraq profilinizi tamamlaya bilərsiniz.",
  buttonText = "Hesabıma keç",
  redirectPath = "/login",
}) => {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleAction = () => {
    onClose()
    if (redirectPath) {
      navigate(redirectPath)
    }
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
        )
      case "error":
        return (
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )
      case "info":
        return (
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  const getButtonColor = () => {
    switch (type) {
      case "success":
        return "bg-[#1A4862] hover:bg-[#1A4862]/90"
      case "error":
        return "bg-red-500 hover:bg-red-600"
      case "info":
        return "bg-blue-500 hover:bg-blue-600"
      default:
        return "bg-[#1A4862] hover:bg-[#1A4862]/90"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl">
        {getIcon()}
        <h2 className="text-xl font-semibold text-[#1A4862] mb-4">{title}</h2>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        <button
          onClick={handleAction}
          className={`w-full ${getButtonColor()} text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2`}
        >
          <User className="w-5 h-5" />
          {buttonText}
        </button>
      </div>
    </div>
  )
}

export default SuccessModal
