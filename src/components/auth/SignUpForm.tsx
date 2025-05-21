import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormEvent } from "react"

import 'primeicons/primeicons.css'

function SignUp() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    upperCase: false,
    specialChar: false
  })

  const validatePassword = (password: string): boolean => {
    const lengthValid = password.length >= 8 && password.length <= 15
    const hasUpperCase = /[A-Z]/.test(password)
    const hasSpecialChar = /[@#?]/.test(password)
    return lengthValid && hasUpperCase && hasSpecialChar
  }

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('All fields are required')
      return
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!validatePassword(password)) {
      setError('Password must be 8–15 characters with 1 uppercase & 1 special symbol (@, #, ?)')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Simulated success
    alert('Signup successful (frontend only)')
    navigate('/')
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-0 bg-gradient-to-r from-[#9614d0] to-[#9614d0] shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>

      <div className="relative bg-white shadow-lg sm:rounded-3xl px-4 py-6 sm:px-6 sm:py-6">
        <form onSubmit={handleSubmit}>
          <div className="mx-auto">
            <h1 className="text-xl font-semibold mb-4 text-center">Sign Up</h1>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                className="mt-1 w-full border-b-2 border-gray-300 focus:outline-none h-8"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                className="mt-1 w-full border-b-2 border-gray-300 focus:outline-none h-8"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 w-full border-b-2 border-gray-300 focus:outline-none h-8"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative mb-3">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="flex items-center border-b-2 border-gray-300">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="flex-1 h-8 focus:outline-none"
                  value={password}
                  onChange={(e) => {
                    const newPassword = e.target.value
                    setPassword(newPassword)
                    setPasswordValidations({
                      length: newPassword.length >= 8 && newPassword.length <= 15,
                      upperCase: /[A-Z]/.test(newPassword),
                      specialChar: /[@#?]/.test(newPassword)
                    })
                  }}
                />
                <button type="button" className="px-1 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                  <i className={`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'}`} style={{ fontSize: '1rem' }}></i>
                </button>
              </div>
            </div>

            <div className="mb-2 text-xs">
              <ul className="space-y-0.5">
                <li className={`${passwordValidations.length ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordValidations.length ? '✔️' : '❌'} 8–15 characters
                </li>
                <li className={`${passwordValidations.upperCase ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordValidations.upperCase ? '✔️' : '❌'} 1 uppercase letter
                </li>
                <li className={`${passwordValidations.specialChar ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordValidations.specialChar ? '✔️' : '❌'} 1 special char (@, #, ?)
                </li>
              </ul>
            </div>

            <div className="relative mb-3">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="flex items-center border-b-2 border-gray-300">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="flex-1 h-8 focus:outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="button" className="px-1 text-gray-500" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <i className={`pi ${showConfirmPassword ? 'pi-eye-slash' : 'pi-eye'}`} style={{ fontSize: '1rem' }}></i>
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

            <button type="submit" className="bg-[#9614d0] text-white rounded-md px-4 py-2 w-full cursor-pointer">
              Sign Up
            </button>

            <div className="mt-2 text-center text-sm">
              <p>
                Already a user?{' '}
                <button
                  type="button"
                  className="border border-[#9614d0] px-4 py-2 rounded text-sm font-medium text-gray-700 cursor-pointer ml-2"
                  onClick={() => navigate('/signin')}
                >
                  Log In
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp
