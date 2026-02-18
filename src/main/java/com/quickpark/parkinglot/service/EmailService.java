package com.quickpark.parkinglot.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.quickpark.parkinglot.entities.ParkedTicket;
import com.quickpark.parkinglot.entities.UnparkedTicket;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@quickpark.com}")
    private String fromEmail;

    @Value("${email.from.name:QuickPark Support}")
    private String fromName;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    private String getFromAddress() {
        return fromName + " <" + fromEmail + ">";
    }

    @Async
    public void sendSignupEmail(String toEmail, String firstName, String lastName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(getFromAddress());
            helper.setTo(toEmail);
            helper.setSubject("Welcome to QuickPark - Registration Successful!");
            String fullName = firstName + " " + lastName;
            fullName = fullName.trim();
            String htmlContent = buildSignupEmailHtml(fullName, toEmail);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send signup email: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error while sending signup email: " + e.getMessage());
        }
    }

    @Async
    public void sendUpdateEmail(String toEmail, String firstName, String lastName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(getFromAddress());
            helper.setTo(toEmail);
            helper.setSubject("QuickPark - Profile Updated Successfully");
            String fullName = firstName + " " + lastName;
            fullName = fullName.trim();
            String htmlContent = buildUpdateEmailHtml(fullName);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send profile update email: " + e.getMessage());
        }
    }

    @Async
    public void sendPasswordChangeEmail(String toEmail, String firstName, String lastName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(getFromAddress());
            helper.setTo(toEmail);
            helper.setSubject("QuickPark - Password Changed Successfully");
            String fullName = firstName + " " + lastName;
            fullName = fullName.trim();
            String htmlContent = buildPasswordChangeEmailHtml(fullName);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send password change email: " + e.getMessage());
        }
    }

    @Async
    public void sendOtpEmail(String toEmail, String firstName, String lastName, String otp, int expiryMinutes) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(getFromAddress());
            helper.setTo(toEmail);
            helper.setSubject("QuickPark - Your OTP Code");
            String fullName = firstName + " " + lastName;
            fullName = fullName.trim();
            String htmlContent = buildOtpEmailHtml(fullName, otp, expiryMinutes);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
    }

    // Send Parking Ticket Email with all the details
    @Async
    public void SendParkingTicketEmail(String toEmail, ParkedTicket ticket) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(getFromAddress());
            helper.setTo(toEmail);
            helper.setSubject("QuickPark - Your Parking Ticket #" + ticket.getId());

            String htmlContent = buildParkingTicketEmailHtml(ticket);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send parking ticket email: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error while sending parking ticket email: " + e.getMessage());
        }
    }

    // Send Unparking Receipt Email with payment details
    @Async
    public void sendUnparkingReceiptEmail(String toEmail, UnparkedTicket ticket) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(getFromAddress());
            helper.setTo(toEmail);
            helper.setSubject("QuickPark - Payment Receipt #" + ticket.getId());

            String htmlContent = buildUnparkingReceiptEmailHtml(ticket);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send unparking receipt email: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error while sending unparking receipt email: " + e.getMessage());
        }
    }

    @Async
    public void sendSimpleEmail(String toEmail, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(getFromAddress());
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    // HTML Email Templates
    private String buildSignupEmailHtml(String fullName, String toEmail) {
        String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                        .button { background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
                        .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🚗 Welcome to QuickPark!</h1>
                        </div>
                        <div class="content">
                            <h2>Hello %s!</h2>
                            <p>Thank you for registering with QuickPark. Your account has been successfully created.</p>
                            <p><strong>Account Details:</strong></p>
                            <ul>
                                <li>Email: %s</li>
                                <li>Registration Date: %s</li>
                            </ul>
                            <p>You can now log in and start using our parking services to find and book parking spots easily.</p>
                            <p>If you have any questions or need assistance, feel free to contact our support team.</p>
                            <p>Happy Parking! 🅿️</p>
                        </div>
                        <div class="footer">
                            <p>© 2025 QuickPark. All rights reserved.</p>
                            <p>This is an automated email. Please do not reply to this message.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(fullName, toEmail, currentDateTime);
    }

    private String buildUpdateEmailHtml(String fullName) {
        String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                        .success { background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
                        .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>📝 Profile Updated</h1>
                        </div>
                        <div class="content">
                            <h2>Hello %s!</h2>
                            <div class="success">
                                <strong>✅ Success!</strong><br>
                                Your profile has been updated successfully.
                            </div>
                            <p><strong>Update Details:</strong></p>
                            <ul>
                                <li>Date & Time: %s</li>
                            </ul>
                            <p>If you did not make this change, please contact our support team immediately.</p>
                        </div>
                        <div class="footer">
                            <p>© 2025 QuickPark. All rights reserved.</p>
                            <p>This is an automated email. Please do not reply to this message.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(fullName, currentDateTime);
    }

    private String buildPasswordChangeEmailHtml(String fullName) {
        String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                        .success { background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
                        .alert { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                        .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔒 Password Changed</h1>
                        </div>
                        <div class="content">
                            <h2>Hello %s!</h2>
                            <div class="success">
                                <strong>✅ Success!</strong><br>
                                Your password has been changed successfully.
                            </div>
                            <p><strong>Change Details:</strong></p>
                            <ul>
                                <li>Date & Time: %s</li>
                            </ul>
                            <div class="alert">
                                <strong>⚠️ Security Notice:</strong><br>
                                If you did not make this change, please contact our support team immediately. Your account security is important to us.
                            </div>
                            <p>You can now use your new password to log in to your account.</p>
                        </div>
                        <div class="footer">
                            <p>© 2025 QuickPark. All rights reserved.</p>
                            <p>This is an automated email. Please do not reply to this message.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(fullName, currentDateTime);
    }

    private String buildOtpEmailHtml(String firstName, String otp, int expiryMinutes) {
        String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #9C27B0; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; text-align: center; }
                        .otp-box { background-color: #fff; border: 2px dashed #9C27B0; padding: 20px; margin: 20px 0; border-radius: 5px; }
                        .otp-code { font-size: 32px; font-weight: bold; color: #9C27B0; letter-spacing: 5px; }
                        .warning { background-color: #ffebee; border-left: 4px solid #f44336; padding: 15px; margin: 20px 0; text-align: left; }
                        .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔑 Your OTP Code</h1>
                        </div>
                        <div class="content">
                            <h2>Hello %s!</h2>
                            <p>You requested a One-Time Password (OTP) for your QuickPark account.</p>
                            <div class="otp-box">
                                <p style="margin: 0; color: #666;">Your OTP Code:</p>
                                <div class="otp-code">%s</div>
                            </div>
                            <p><strong>⏱️ This code will expire in %d minutes.</strong></p>
                            <p>Request Time: %s</p>
                            <div class="warning">
                                <strong>🛡️ Security Tips:</strong>
                                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                                    <li>Never share this code with anyone</li>
                                    <li>QuickPark will never ask for your OTP via phone or email</li>
                                    <li>If you didn't request this code, please ignore this email</li>
                                </ul>
                            </div>
                        </div>
                        <div class="footer">
                            <p>© 2025 QuickPark. All rights reserved.</p>
                            <p>This is an automated email. Please do not reply to this message.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(firstName, otp, expiryMinutes, currentDateTime);
    }

    private String buildParkingTicketEmailHtml(ParkedTicket ticket) {
        String entryDateTime = ticket.getEntryTime().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));
        String fullName = (ticket.getFirstName() + " " + ticket.getLastName()).trim();

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
                        .header { background: linear-gradient(135deg, #4CAF50 0%%, #45a049 100%%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
                        .header h1 { margin: 0; font-size: 28px; }
                        .header p { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
                        .content { background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        .ticket-id { background: linear-gradient(135deg, #2196F3 0%%, #1976D2 100%%); color: white; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 25px; }
                        .ticket-id-label { font-size: 12px; opacity: 0.9; margin: 0; }
                        .ticket-id-value { font-size: 24px; font-weight: bold; margin: 5px 0 0 0; letter-spacing: 2px; }
                        .highlight-box { background: linear-gradient(135deg, #22c55e 0%%, #16a34a 100%%); padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; color: white; }
                        .highlight-box h3 { margin: 0; font-size: 20px; }
                        .highlight-box p { margin: 5px 0 0 0; font-size: 13px; opacity: 0.9; }
                        .section { margin: 25px 0; }
                        .section-title { font-size: 14px; font-weight: bold; color: #666; text-transform: uppercase; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #e0e0e0; }
                        .info-row { display: flex; justify-content: space-between; padding: 10px 15px; margin: 5px 0; background-color: #f9f9f9; border-radius: 5px; }
                        .info-label { color: #666; font-size: 14px; margin-right: 8px; }
                        .info-value { font-weight: 600; color: #333; font-size: 14px; text-align: right; }
                        .warning-box { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
                        .warning-box p { margin: 0; color: #856404; font-size: 13px; }
                        .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
                        .footer p { margin: 5px 0; }
                        .important-note { background-color: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; border-radius: 5px; }
                        .important-note p { margin: 0; color: #1565C0; font-size: 13px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎫 Parking Ticket Confirmed</h1>
                            <p>Your vehicle has been successfully parked</p>
                        </div>
                        <div class="content">
                            <p style="margin-top: 0;">Hello <strong>%s</strong>,</p>
                            <p>Your parking reservation has been confirmed. Below are the details of your parking ticket:</p>

                            <div class="ticket-id">
                                <p class="ticket-id-label">TICKET ID</p>
                                <p class="ticket-id-value">%s</p>
                            </div>

                            <div class="section">
                                <div class="section-title">👤 Owner Information</div>
                                <div class="info-row">
                                    <span class="info-label">Name: </span>
                                    <span class="info-value">%s</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Contact: </span>
                                    <span class="info-value">%s</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Email: </span>
                                    <span class="info-value">%s</span>
                                </div>
                            </div>

                            <div class="section">
                                <div class="section-title">🚗 Vehicle Details</div>
                                <div class="info-row">
                                    <span class="info-label">Vehicle Number: </span>
                                    <span class="info-value">%s</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Vehicle Model: </span>
                                    <span class="info-value">%s</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Vehicle Type: </span>
                                    <span class="info-value" style="text-transform: capitalize;">%s</span>
                                </div>
                            </div>

                            <div class="section">
                                <div class="section-title">📍 Parking Information</div>
                                <div class="info-row">
                                    <span class="info-label">Parking Spot: </span>
                                    <span class="info-value">%s</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Rate: </span>
                                    <span class="info-value">₹%d/hour</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Entry Time: </span>
                                    <span class="info-value">%s</span>
                                </div>
                            </div>

                            <div class="warning-box">
                                <p><strong>⚠️ Important:</strong> Keep this ticket safe for exit and payment calculation</p>
                            </div>

                            <div class="important-note">
                                <p><strong>ℹ️ Note:</strong> Please present this ticket ID when exiting. Payment will be calculated based on the duration of your parking.</p>
                            </div>

                            <div class="highlight-box">
                                <h3>⏰ First 30 Minutes FREE!</h3>
                                <p>Enjoy complimentary parking for the first half hour</p>
                            </div>

                            <p style="text-align: center; margin-top: 25px;">
                                <strong>Need Help?</strong><br>
                                Contact our support team at <a href="mailto:support@quickpark.com" style="color: #4CAF50;">support@quickpark.com</a>
                            </p>
                        </div>
                        <div class="footer">
                            <p>🅿️ 24/7 Security • CCTV Monitored</p>
                            <p>© 2025 QuickPark. All rights reserved.</p>
                            <p>This is an automated email. Please do not reply to this message.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(
                        fullName,
                        ticket.getId(),
                        fullName,
                        ticket.getOwnerContact(),
                        ticket.getEmail(),
                        ticket.getVehicleNo(),
                        ticket.getVehicleModel(),
                        ticket.getParkingSpot().getType(),
                        ticket.getParkingSpot().getLocation(),
                        ticket.getParkingSpot().getCost(),
                        entryDateTime);
    }

    private String buildUnparkingReceiptEmailHtml(UnparkedTicket ticket) {
        String entryDateTime = ticket.getEntryTime().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));
        String exitDateTime = ticket.getExitTime().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));
        String fullName = (ticket.getFirstName() + " " + ticket.getLastName()).trim();

        // Convert duration from minutes to hours and minutes
        long hours = ticket.getTotalDuration() / 60;
        long minutes = ticket.getTotalDuration() % 60;
        String durationText = hours > 0 ? hours + " hr " + minutes + " min" : minutes + " min";

        // Determine if parking was free
        boolean isFree = ticket.getTotalCost() == 0;

        // Build HTML content based on whether parking is free or paid
        String htmlTemplate;

        if (isFree) {
            htmlTemplate = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
                            .header { background: linear-gradient(135deg, #FF5722 0%%, #E64A19 100%%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
                            .header h1 { margin: 0; font-size: 28px; }
                            .header p { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
                            .content { background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                            .receipt-id { background: linear-gradient(135deg, #9C27B0 0%%, #7B1FA2 100%%); color: white; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 25px; }
                            .receipt-id-label { font-size: 12px; opacity: 0.9; margin: 0; }
                            .receipt-id-value { font-size: 24px; font-weight: bold; margin: 5px 0 0 0; letter-spacing: 2px; }
                            .success-box { background: linear-gradient(135deg, #4CAF50 0%%, #388E3C 100%%); padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; color: white; }
                            .success-box h3 { margin: 0; font-size: 20px; }
                            .success-box p { margin: 5px 0 0 0; font-size: 13px; opacity: 0.9; }
                            .total-amount { background: linear-gradient(135deg, #4CAF50 0%%, #388E3C 100%%); color: white; padding: 25px; text-align: center; border-radius: 8px; margin: 25px 0; }
                            .total-amount-label { font-size: 14px; margin: 0; opacity: 0.9; }
                            .total-amount-value { font-size: 36px; font-weight: bold; margin: 5px 0 0 0; }
                            .section { margin: 25px 0; }
                            .section-title { font-size: 14px; font-weight: bold; color: #666; text-transform: uppercase; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #e0e0e0; }
                            .info-row { display: flex; justify-content: space-between; padding: 10px 15px; margin: 5px 0; background-color: #f9f9f9; border-radius: 5px; }
                            .info-label { color: #666; font-size: 14px; margin-right: 8px; }
                            .info-value { font-weight: 600; color: #333; font-size: 14px; text-align: right; }
                            .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
                            .footer p { margin: 5px 0; }
                            .thank-you-box { background-color: #e8f5e9; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0; border-radius: 5px; }
                            .thank-you-box p { margin: 5px 0; color: #2E7D32; font-size: 13px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>🧾 Parking Receipt</h1>
                                <p>Thank you for using QuickPark</p>
                            </div>
                            <div class="content">
                                <p style="margin-top: 0;">Hello <strong>%s</strong>,</p>
                                <p>Your vehicle has been successfully exited from our parking facility. Below is your parking summary:</p>

                                <div class="receipt-id">
                                    <p class="receipt-id-label">RECEIPT ID</p>
                                    <p class="receipt-id-value">%s</p>
                                </div>

                                <div class="success-box">
                                    <h3>🎉 Complimentary Parking</h3>
                                    <p>No charges apply as per our First 30 Minutes FREE policy</p>
                                </div>

                                <div class="total-amount">
                                    <p class="total-amount-label">TOTAL AMOUNT</p>
                                    <p class="total-amount-value">₹0</p>
                                    <p style="font-size: 14px; margin: 5px 0 0 0; opacity: 0.9;">FREE PARKING</p>
                                </div>

                                <div class="section">
                                    <div class="section-title">👤 Customer Information</div>
                                    <div class="info-row">
                                        <span class="info-label">Name: </span>
                                        <span class="info-value">%s</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Contact: </span>
                                        <span class="info-value">%s</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Email: </span>
                                        <span class="info-value">%s</span>
                                    </div>
                                </div>

                                <div class="section">
                                    <div class="section-title">🚗 Vehicle Details</div>
                                    <div class="info-row">
                                        <span class="info-label">Vehicle Number: </span>
                                        <span class="info-value">%s</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Vehicle Model: </span>
                                        <span class="info-value">%s</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Vehicle Type: </span>
                                        <span class="info-value" style="text-transform: capitalize;">%s</span>
                                    </div>
                                </div>

                                <div class="section">
                                    <div class="section-title">⏱️ Parking Duration</div>
                                    <div class="info-row">
                                        <span class="info-label">Entry Time: </span>
                                        <span class="info-value">%s</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Exit Time: </span>
                                        <span class="info-value">%s</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Total Duration: </span>
                                        <span class="info-value">%s</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Parking Spot: </span>
                                        <span class="info-value">%s</span>
                                    </div>
                                </div>

                                <div class="section">
                                    <div class="section-title">💳 Billing Details</div>
                                    <div class="info-row">
                                        <span class="info-label">Hourly Rate: </span>
                                        <span class="info-value">₹%d/hour</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Total Duration: </span>
                                        <span class="info-value">%s</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">First 30 min: </span>
                                        <span class="info-value" style="color: #4CAF50;">FREE</span>
                                    </div>
                                    <div class="info-row" style="background-color: #E8F5E9; border: 2px solid #4CAF50;">
                                        <span class="info-label" style="font-weight: bold; color: #2E7D32;">Total Amount: </span>
                                        <span class="info-value" style="font-size: 18px; color: #2E7D32;">₹0</span>
                                    </div>
                                </div>

                                <div class="thank-you-box">
                                    <p><strong>🙏 Thank you for choosing QuickPark!</strong></p>
                                    <p>You enjoyed complimentary parking as your stay was within our free 30-minute window. We hope to serve you again soon. Drive safely!</p>
                                </div>

                                <p style="text-align: center; margin-top: 25px;">
                                    <strong>Need Help?</strong><br>
                                    Contact our support team at <a href="mailto:support@quickpark.com" style="color: #FF5722;">support@quickpark.com</a>
                                </p>
                            </div>
                            <div class="footer">
                                <p>🅿️ QuickPark Parking Services</p>
                                <p>© 2025 QuickPark. All rights reserved.</p>
                                <p>This is an automated email. Please do not reply to this message.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                    """
                    .formatted(
                            fullName,
                            ticket.getId(),
                            fullName,
                            ticket.getOwnerContact(),
                            ticket.getEmail(),
                            ticket.getVehicleNo(),
                            ticket.getVehicleModel(),
                            ticket.getParkingSpot().getType(),
                            entryDateTime,
                            exitDateTime,
                            durationText,
                            ticket.getParkingSpot().getLocation(),
                            ticket.getParkingSpot().getCost(),
                            durationText);
        } else {
            htmlTemplate = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
                            .header { background: linear-gradient(135deg, #FF5722 0%%, #E64A19 100%%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
                            .header h1 { margin: 0; font-size: 28px; }
                            .header p { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
                            .content { background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                            .receipt-id { background: linear-gradient(135deg, #9C27B0 0%%, #7B1FA2 100%%); color: white; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 25px; }
                            .receipt-id-label { font-size: 12px; opacity: 0.9; margin: 0; }
                            .receipt-id-value { font-size: 24px; font-weight: bold; margin: 5px 0 0 0; letter-spacing: 2px; }
                            .success-box { background: linear-gradient(135deg, #2196F3 0%%, #1976D2 100%%); padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; color: white; }
                            .success-box h3 { margin: 0; font-size: 20px; }
                            .success-box p { margin: 5px 0 0 0; font-size: 13px; opacity: 0.9; }
                            .total-amount { background: linear-gradient(135deg, #FFC107 0%%, #FFA000 100%%); color: white; padding: 25px; text-align: center; border-radius: 8px; margin: 25px 0; }
                            .total-amount-label { font-size: 14px; margin: 0; opacity: 0.9; }
                            .total-amount-value { font-size: 36px; font-weight: bold; margin: 5px 0 0 0; }
                            .section { margin: 25px 0; }
                            .section-title { font-size: 14px; font-weight: bold; color: #666; text-transform: uppercase; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #e0e0e0; }
                            .info-row { display: flex; justify-content: space-between; padding: 10px 15px; margin: 5px 0; background-color: #f9f9f9; border-radius: 5px; }
                            .info-label { color: #666; font-size: 14px; margin-right: 8px; }
                            .info-value { font-weight: 600; color: #333; font-size: 14px; text-align: right; }
                            .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
                            .footer p { margin: 5px 0; }
                            .thank-you-box { background-color: #FFF9C4; border-left: 4px solid #FFC107; padding: 15px; margin: 20px 0; border-radius: 5px; }
                            .thank-you-box p { margin: 5px 0; color: #F57C00; font-size: 13px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>🧾 Parking Receipt</h1>
                                <p>Thank you for using QuickPark</p>
                            </div>
                            <div class="content">
                                <p style="margin-top: 0;">Hello <strong>%s</strong>,</p>
                                <p>Your vehicle has been successfully exited from our parking facility. Below is your parking summary:</p>

                                <div class="receipt-id">
                                    <p class="receipt-id-label">RECEIPT ID</p>
                                    <p class="receipt-id-value">%s</p>
                                </div>

                                <div class="success-box">
                                    <h3>✅ Exit Successful</h3>
                                    <p>Your parking session has ended</p>
                                </div>

                                <div class="total-amount">
                                    <p class="total-amount-label">AMOUNT DUE AT EXIT</p>
                                    <p class="total-amount-value">₹%d</p>
                                    <p style="font-size: 14px; margin: 5px 0 0 0; opacity: 0.9;">Please pay at the exit counter</p>
                                </div>

                                <div class="section">
                                    <div class="section-title">👤 Customer Information</div>
                                    <div class="info-row">
                                        <span class="info-label">Name: </span>
                                        <span class="info-value">%s</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Contact: </span>
                                        <span class="info-value">%s</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Email: </span>
                                        <span class="info-value">%s</span>
                                    </div>
                                </div>

                                <div class="section">
                                    <div class="section-title">🚗 Vehicle Details</div>
                                    <div class="info-row">
                                        <span class="info-label">Vehicle Number: </span>
                                        <span class="info-value">%s</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Vehicle Model: </span>
                                        <span class="info-value">%s</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Vehicle Type: </span>
                                        <span class="info-value" style="text-transform: capitalize;">%s</span>
                                    </div>
                                </div>

                                <div class="section">
                                    <div class="section-title">⏱️ Parking Duration</div>
                                    <div class="info-row">
                                        <span class="info-label">Entry Time: </span>
                                        <span class="info-value">%s</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Exit Time: </span>
                                        <span class="info-value">%s</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Total Duration: </span>
                                        <span class="info-value">%s</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Parking Spot: </span>
                                        <span class="info-value">%s</span>
                                    </div>
                                </div>

                                <div class="section">
                                    <div class="section-title">💳 Payment Breakdown</div>
                                    <div class="info-row">
                                        <span class="info-label">Hourly Rate: </span>
                                        <span class="info-value">₹%d/hour</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Total Duration: </span>
                                        <span class="info-value">%s</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">First 30 min: </span>
                                        <span class="info-value" style="color: #4CAF50;">FREE</span>
                                    </div>
                                    <div class="info-row" style="background-color: #FFF9C4; border: 2px solid #FFC107;">
                                        <span class="info-label" style="font-weight: bold;">Amount Payable: </span>
                                        <span class="info-value" style="font-size: 18px; color: #F57C00;">₹%d</span>
                                    </div>
                                </div>

                                <div class="thank-you-box">
                                    <p><strong>� Payment Required</strong></p>
                                    <p>Kindly pay <strong>₹%d</strong> at the exit counter before leaving. Thank you for choosing QuickPark. Drive safely!</p>
                                </div>

                                <p style="text-align: center; margin-top: 25px;">
                                    <strong>Need Help?</strong><br>
                                    Contact our support team at <a href="mailto:support@quickpark.com" style="color: #FF5722;">support@quickpark.com</a>
                                </p>
                            </div>
                            <div class="footer">
                                <p>🅿️ QuickPark Parking Services</p>
                                <p>© 2025 QuickPark. All rights reserved.</p>
                                <p>This is an automated email. Please do not reply to this message.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                    """
                    .formatted(
                            fullName,
                            ticket.getId(),
                            ticket.getTotalCost(),
                            fullName,
                            ticket.getOwnerContact(),
                            ticket.getEmail(),
                            ticket.getVehicleNo(),
                            ticket.getVehicleModel(),
                            ticket.getParkingSpot().getType(),
                            entryDateTime,
                            exitDateTime,
                            durationText,
                            ticket.getParkingSpot().getLocation(),
                            ticket.getParkingSpot().getCost(),
                            durationText,
                            ticket.getTotalCost(),
                            ticket.getTotalCost());
        }

        return htmlTemplate;
    }
}
