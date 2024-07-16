import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'

const policyModalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '90%',
    md: '70%',
    lg: '40%',
  },
  bgcolor: 'background.paper',
  border: '1px solid #000',
  maxHeight: '80vh',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto' as const,
}

const PrivacyPolicyModal = () => {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const titleStyling = { mt: 4, textDecoration: 'underline', fontWeight: 'bold' }

  return (
    <div>
      <Button variant='outlined' className='text-white mt-6' onClick={handleOpen}>Privacy policy</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={policyModalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2" color="black" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }} color="black">
            Last updated: 2024-07-17
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }} color="black">
            We (the creators of this project) are committed to protecting your privacy and ensuring you have a positive experience using our parking reminder service.
            This Privacy Policy outlines the types of information we collect, how we use it, and the measures we take to safeguard your data.
            Keep in mind that the creators of the project are not operating as a company, but as individuals contributing to a hobby project.
          </Typography>

          <Typography variant="subtitle1" sx={titleStyling} color="black">
            Information Collection and Use
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }} color="black">
            <strong>Personal Information:</strong> We collect minimal personal information, such as your email address or phone number, solely for the purpose of providing you with timely parking reminders and confirmation emails. Your contact details are never used for marketing purposes, and are not stored on our platform after providing the requested communications.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }} color="black">
            <strong>Location Data:</strong> The parking location you select helps us tailor reminders specifically to your needs. This information is used exclusively for setting up your reminder and is not shared with third parties or used for any other purpose.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }} color="black">
            <strong>Interaction Data:</strong> Although not present at the time of writing, we reserve the right to add interaction tracking to better understand how the service is being used.
            This data is not tied to your personal contact details.
          </Typography>

          <Typography variant="subtitle1" sx={titleStyling} color="black">
            Data Security
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }} color="black">
                    We employ industry-standard security measures to protect your personal information from unauthorised access, alteration, or destruction. Despite our efforts, please be aware that no security measures are completely infallible.
          </Typography>

          <Typography variant="subtitle1" sx={titleStyling} color="black">
            Data Sharing and Disclosure
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }} color="black">
            <strong>Service Providers:</strong> We may share your information with trusted third parties who assist us in operating our service, conducting our business, or serving our users, so long as those parties agree to keep this information confidential. This includes e.g. Google Cloud Platform (for hosting the service) and SendGrid (for sending emails). 
          </Typography>

          <Typography variant="subtitle1" sx={titleStyling} color="black">
            Your Rights
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }} color="black">
            <strong>Access and Control:</strong> You have the right to access the personal information we hold about you and to request corrections, deletions, or modifications to this information.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }} color="black">
            <strong>Opt-Out:</strong> If at any point you wish to blacklist your email from receiving reminders from our service, please contact us, or opt-out through the link that will potentially be included in future reminder and confirmation email.
            This is primarily a way to prevent abuse by other people. If you do not schedule more reminders, you won&apos;t receive any more.
          </Typography>
          <Typography variant="subtitle1" sx={titleStyling} color="black">
                        Contact Us
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }} color="black">
                    If you have any questions about this Privacy Policy or our treatment of your personal information, please contact us at johanehrenfors@hotmail.com.
          </Typography>
          <Button variant='outlined' className='text-black mt-6' onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
    </div>
  )
}

export default PrivacyPolicyModal
