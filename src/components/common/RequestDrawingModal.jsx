'use client';

import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const RequestDrawingModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name:'',
    email: '',
    drawingDetails: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form validation
  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }

    // Check if drawing details are provided
    if (formData.drawingDetails.trim().length < 10) {
      setErrorMessage("Please provide more details about your drawing request (at least 10 characters)");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      // Use environment variables with fallbacks
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_uak2ma6';
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_84lonsj';
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'fPAvY4TXJeAen167a';
      
      const result = await emailjs.send(
        serviceId,
        templateId,
        {
          from_email: formData.email,
          name:formData.name,
          drawing_details: formData.drawingDetails,
        },
        publicKey
      );

      if (result.status === 200) {
        setSubmitStatus('success');
        // Reset form after successful submission
        setFormData({
          name:'',
          email: '',
          drawingDetails: ''
        });
        // Close modal after 3 seconds
        setTimeout(() => {
          onClose();
          setSubmitStatus(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
      setErrorMessage("Failed to send your request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#ffffff64] bg-opacity-50">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl dark:bg-gray-800">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal content */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">
            Request a Custom Drawing
          </h3>
          
          {submitStatus === 'success' ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-lg font-medium text-gray-900 dark:text-white">Thank you!</p>
              <p className="text-gray-600 dark:text-gray-300">Your drawing request has been submitted successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="name"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="eg. john."
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="drawingDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Drawing Details
                </label>
                <textarea
                  id="drawingDetails"
                  name="drawingDetails"
                  value={formData.drawingDetails}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Describe the drawing you'd like us to create..."
                ></textarea>
              </div>
              
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  <p>{errorMessage}</p>
                </div>
              )}
              
              {submitStatus === 'error' && !errorMessage && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  <p>There was an error submitting your request. Please try again.</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 text-white font-medium rounded-lg ${isSubmitting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'} transition-colors duration-200`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : 'Submit Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDrawingModal;