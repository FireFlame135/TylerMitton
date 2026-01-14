// src/components/Contact.tsx
/**
 * Contact section with form and social links.
 * Author: Tyler Mitton
 * Allows visitors to send messages and provides social media links.
 */

import React, { useState } from 'react'

// Icons
import { SiMedium, SiInstagram, SiLinkedin } from 'react-icons/si'
import { Mail } from 'lucide-react'

// Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'

// Contact form configuration and validation
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit' 
// Access key is intentionally exposed; see: https://docs.web3forms.com/getting-started/faq
const ACCESS_KEY = '83d97da9-fc41-414d-9528-45394bc1976a' 
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/

const Contact: React.FC = () => {
  // Form field state
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  // Honeypot checkbox to prevent spam bots
  const [botcheck, setBotcheck] = useState(false)

  // Validation error state
  const [nameError, setNameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [messageError, setMessageError] = useState<string | null>(null)

  // Submit state and dialog management
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState<{ title: string; desc: string }>({
    title: '',
    desc: '',
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Handle form submission, validation, and Web3Forms API call
    e.preventDefault()

    // clear previous errors
    setNameError(null)
    setEmailError(null)
    setPhoneError(null)
    setMessageError(null)

    // honeypot validation
    if (botcheck) {
      return
    }

    // required‐field validation
    if (!fullName.trim()) {
      setNameError('Please enter your name')
      return
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address')
      return
    }
    if (phone && !phoneRegex.test(phone)) {
      setPhoneError('Please enter a valid phone number')
      return
    }
    if (!message.trim()) {
      setMessageError('Please enter a message')
      return
    }

    setIsSubmitting(true)

    const payload = {
      access_key: ACCESS_KEY,
      name: fullName,
      email,
      phone,
      subject,
      message,
      botcheck,
      from_name: 'New Message from Portfolio Website Contact Form',
      replyto: email,
    }

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()

      if (json.success) {
        setDialogContent({ title: 'Thank you!', desc: 'Your message has been sent. I’ll get back to you shortly.' })
        // reset visible fields
        setFullName('')
        setEmail('')
        setPhone('')
        setSubject('')
        setMessage('')
        setBotcheck(false)
      } else {
        setDialogContent({ title: 'Oops!', desc: 'Something went wrong. Please try again later.' })
      }
    } catch {
      setDialogContent({ title: 'Error', desc: 'Network error. Please check your connection and try again.' })
    } finally {
      setIsSubmitting(false)
      setDialogOpen(true)
    }
  }

  return (
    <section id="contact" className="py-16 px-6 sm:px-8 mx-auto scroll-mt-16 bg-[#F0F1F4] dark:bg-gray-800">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact info + social links */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-normal text-gray-900 mb-6 dark:text-gray-100"> 
            Let's Connect!
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed dark:text-gray-300">
            Questions? Feedback? Want to work together?
            <br />
            I'm always interested in new opportunities and collaborations.
            Whether you have a project in mind or just want to say hello and chat,
            I would love to hear from you. :)
          </p>
          <div className="space-y-6 space-x-3.5">
            <div className="flex items-center space-x-4">
              <a
                href="mailto:tylermitton@gmail.com?subject=Let's Chat!"
                target="_blank" 
                rel="noopener noreferrer"
                title="Email Tyler Mitton"
                className="
                  group inline-flex items-center space-x-2
                  px-3 py-2 rounded-md"
              > 
                <Mail
                  size={30}
                  className="text-gray-700 dark:text-gray-200 group-hover:text-gray-950 dark:group-hover:text-gray-50"
                />
                <span className="text-gray-700 dark:text-gray-200 group-hover:text-gray-950 dark:group-hover:text-gray-50">
                  tylermitton@gmail.com
                </span>
              </a>
            </div>
            <div className="flex items-center space-x-6 pt-4">
              <a
                href="https://www.linkedin.com/in/tyler-mitton/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200"
              >
                <SiLinkedin size={30} />
              </a>
              <a
                href="https://medium.com/@tyler-mitton"
                target="_blank"
                rel="noopener noreferrer"
                title="Medium"
                className="text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200"
              >
                <SiMedium size={30} />
              </a>
              <a 
                href="https://www.instagram.com/tylermitton135/"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200"
              >
                <SiInstagram size={30} />
              </a>
            </div>
          </div>
        </div>

        {/* The Form */}
        <div className="bg-[#D4D5D8] p-8 rounded-lg dark:bg-gray-900">
          <h3 className="text-xl font-normal text-gray-900 mb-6 dark:text-gray-200 dark:font-bold">
            Send a Message
          </h3>
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Honeypot checkbox (must stay unchecked) */}
            <input
              type="checkbox"
              name="botcheck"
              checked={botcheck}
              onChange={e => setBotcheck(e.target.checked)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div>
              <Label htmlFor="fullName" className="dark:text-gray-300">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
              {nameError && <p className="text-sm text-red-600 mt-1">{nameError}</p>}
            </div>

            <div>
              <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="johndoe@example.com"
                required
                autoComplete="email"
              />
              {emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>}
            </div>

            <div>
              <Label htmlFor="phone" className="dark:text-gray-300">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="(123) 456-7890"
                autoCapitalize="tel"
              />
              {phoneError && <p className="text-sm text-red-600 mt-1">{phoneError}</p>}
            </div>

            <div>
              <Label htmlFor="subject" className="dark:text-gray-300">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Let's Connect!"
              />
            </div>

            <div>
              <Label htmlFor="message" className="dark:text-gray-300">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Tell me about yourself..."
                className="min-h-[120px]"
                required
              />
              {messageError && <p className="text-sm text-red-600 mt-1">{messageError}</p>}
            </div>

            <Button type="submit" className="w-full bg-gray-500 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 " disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>

      {/* Success/error messages */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <DialogDescription>{dialogContent.desc}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
)
}

export default Contact
