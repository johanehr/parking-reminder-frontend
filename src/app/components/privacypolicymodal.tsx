import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    maxHeight: '90vh',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto' as 'auto',
};



const PrivacyPolicyModal = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    return (
        <div>
            <Button variant='outlined' className='text-white mt-6' onClick={handleOpen}>Privacy policy</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" color="black" gutterBottom>
                        Privacy Policy for BoendeParkering
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }} color="black">
                        Last Updated: 1/4/2024
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }} color="black">
                        <strong>At BoendeParkering, we are committed to protecting your privacy and ensuring you have a positive experience using our parking reminder service.</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }} color="black">
                        This Privacy Policy outlines the types of information we collect, how we use it, and the measures we take to safeguard your data.
                    </Typography>

                    <Typography variant="subtitle1" sx={{ mt: 4, textDecoration: 'underline', fontWeight: 'bold' }} color="black">
                        Information Collection and Use
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }} color="black">
                        <strong>Personal Information:</strong> We collect minimal personal information, such as your email address and parking location, solely for the purpose of providing you with timely parking reminders and confirmation emails. Your contact details are never used for marketing purposes.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }} color="black">
                        <strong>Location Data:</strong> The parking location you provide helps us tailor reminders specifically to your needs. This information is used exclusively for setting up your reminder and is not shared with third parties or used for any other purpose.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }} color="black">
                        <strong>Device Information:</strong> We may collect non-identifying information about the device you use to access our service, such as the browser type and operating system. This information is used to improve our service and solve any technical issues that may arise.
                    </Typography>

                    <Typography variant="subtitle1" sx={{ mt: 4, textDecoration: 'underline', fontWeight: 'bold' }} color="black">
                        Data Security:
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }} color="black">
                        We employ industry-standard security measures to protect your personal information from unauthorized access, alteration, or destruction. Despite our efforts, please be aware that no security measures are completely infallible.
                    </Typography>

                    <Typography variant="subtitle1" sx={{ mt: 4, textDecoration: 'underline', fontWeight: 'bold' }} color="black">
                        Data Sharing and Disclosure
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }} color="black">
                        <strong>Service Providers:</strong> We may share your information with trusted third parties who assist us in operating our service, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }} color="black">
                        <strong>Legal Requirements:</strong> We may disclose your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.
                    </Typography>

                    <Typography variant="subtitle1" sx={{ mt: 4, textDecoration: 'underline', fontWeight: 'bold' }} color="black">
                        Your Rights
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }} color="black">
                        <strong>Access and Control:</strong> You have the right to access the personal information we hold about you and to request corrections, deletions, or modifications to this information.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }} color="black">
                        <strong>Opt-Out:</strong> If at any point you wish to discontinue receiving reminders from us, you can easily opt-out through the link provided in every reminder and confirmation email.
                    </Typography>

                    <Typography variant="subtitle1" sx={{ mt: 4, textDecoration: 'underline', fontWeight: 'bold' }} color="black">
                        Changes to This Privacy Policy
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }} color="black">
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top.
                    </Typography>

                    <Typography variant="subtitle1" sx={{ mt: 4, textDecoration: 'underline', fontWeight: 'bold' }} color="black">
                        Contact Us
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }} color="black">
                        If you have any questions about this Privacy Policy or our treatment of your personal information, please contact us at ouremailwhenwemakeit@gmail.com.
                    </Typography>
                    <Button variant='outlined' className='text-black mt-6' onClick={handleClose}>Close</Button>
                </Box>
            </Modal>
        </div>
    )
}

export default PrivacyPolicyModal