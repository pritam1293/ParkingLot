package com.quickpark.parkinglot.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@quickpark.com}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendSignupEmail(String toEmail, String firstName, String lastName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
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

    public void sendSigninEmail(String toEmail, String firstName, String lastName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("QuickPark - New Login Detected");

            String fullName = firstName + " " + lastName;
            fullName = fullName.trim();
            String htmlContent = buildLoginEmailHtml(fullName);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send login email: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error while sending login email: " + e.getMessage());
        }
    }

    public void sendUpdateEmail(String toEmail, String firstName, String lastName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
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

    public void sendPasswordChangeEmail(String toEmail, String firstName, String lastName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
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

    public void sendOtpEmail(String toEmail, String firstName, String lastName, String otp, int expiryMinutes) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
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

    public void sendSimpleEmail(String toEmail, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
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

    private String buildLoginEmailHtml(String fullName) {
        String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                        .alert { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                        .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Login Detected</h1>
                        </div>
                        <div class="content">
                            <h2>Hello %s!</h2>
                            <p>We detected a new login to your QuickPark account.</p>
                            <p><strong>Login Details:</strong></p>
                            <ul>
                                <li>Date & Time: %s</li>
                            </ul>
                            <div class="alert">
                                <strong>⚠️ Security Notice:</strong><br>
                                If this wasn't you, please change your password immediately and contact our support team.
                            </div>
                            <p>Stay secure and enjoy our services!</p>
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
}
