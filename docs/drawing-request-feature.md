# Drawing Request Feature Documentation

## Overview

The Drawing Request feature allows users to submit requests for custom drawings through a modal form. The form collects the user's email address and details about the drawing they would like to request. The form data is then sent via email using the EmailJS service.

## Setup

### 1. EmailJS Configuration

This feature uses [EmailJS](https://www.emailjs.com/) to send emails without a backend server. To set it up:

1. Create an account on [EmailJS](https://www.emailjs.com/)
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template with the following variables:
   - `from_email`: The email address of the requester
   - `drawing_details`: The details of the drawing request
4. Get your Service ID, Template ID, and Public Key
5. Add these credentials to your `.env.local` file:

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

### 2. EmailJS Template Example

Here's an example of what your EmailJS template might look like:

**Subject:**
```
New Drawing Request from {{from_email}}
```

**Body:**
```html
<h2>New Drawing Request</h2>
<p><strong>From:</strong> {{from_email}}</p>
<h3>Drawing Details:</h3>
<p>{{drawing_details}}</p>
```

## Components

### 1. RequestDrawingModal

The modal component that contains the form for requesting drawings. It includes:

- Email input field with validation
- Drawing details textarea with validation (minimum 10 characters)
- Form submission handling with loading state
- Success and error messages

### 2. Header Integration

The modal can be opened from the header via a "Request Drawing" button that appears in both desktop and mobile views.

### 3. CTA Section

The Call-to-Action section on the homepage has been updated to focus on requesting custom drawings. It includes a button that triggers the same modal form.

## Usage

### Opening the Modal

The modal can be opened in two ways:

1. Clicking the "Request Drawing" button in the header
2. Clicking the "Request Now" button in the CTA section on the homepage

### Form Validation

The form validates:

- Email format (must be a valid email address)
- Drawing details (must be at least 10 characters)

### Submission Process

1. User fills out the form and clicks "Submit Request"
2. Form data is validated
3. If validation passes, the form data is sent to EmailJS
4. During submission, a loading spinner is shown
5. On success, a success message is displayed and the modal closes after 3 seconds
6. On error, an error message is displayed

## Customization

### Styling

The modal and buttons use Tailwind CSS classes for styling. The main color scheme uses green for the request drawing buttons and modal header.

### Modal Content

You can customize the modal content by editing the `RequestDrawingModal.jsx` file. This includes:

- Form fields
- Success and error messages
- Button text and styling

## Troubleshooting

### Common Issues

1. **Emails not being sent**: Check that your EmailJS credentials are correct in the `.env.local` file
2. **Form validation errors**: Check the console for any JavaScript errors
3. **Modal not opening**: Ensure the `useModal` hook is properly imported and used

### EmailJS Debugging

EmailJS provides a dashboard where you can see the status of sent emails and any errors that occurred. Check the [EmailJS dashboard](https://dashboard.emailjs.com/) for more information.

## Future Enhancements

Possible future enhancements for this feature:

1. Add more form fields (name, phone, preferred style, etc.)
2. Add file upload capability for reference images
3. Implement a captcha to prevent spam
4. Add a pricing calculator based on drawing complexity