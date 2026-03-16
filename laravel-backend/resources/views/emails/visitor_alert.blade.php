<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visitor Access Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #334155;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header / Logo Area -->
        <div style="background-color: #0f172a; padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px;">
                <span style="color: #f97316;">Secure</span>Gate
            </h1>
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px;">
            <h2 style="margin-top: 0; font-size: 22px; color: #0f172a; text-align: left; margin-bottom: 20px;">Visitor Access Request</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px; margin-top: 0;">
                A visitor is at the gate requesting access to your flat. Please click the button below to view the visitor's face and live camera feed.
            </p>

            <!-- Visitor Details Card -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 40%;"><strong>Visitor Name</strong></td>
                        <td style="padding: 8px 0; color: #0f172a; font-size: 16px; font-weight: 600;">{{ $visitor->name ?? 'Unknown' }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;"><strong>Flat Number</strong></td>
                        <td style="padding: 8px 0; color: #0f172a; font-size: 16px; font-weight: 600;">{{ $visitor->flat ?? 'N/A' }}</td>
                    </tr>
                </table>
            </div>

            <!-- Action Button -->
            <div style="text-align: center; margin-top: 10px;">
                <a href="{{ $verifyLink }}" style="display: inline-block; background-color: #f97316; color: #ffffff; text-decoration: none; padding: 16px 30px; border-radius: 8px; font-weight: 700; font-size: 18px; text-align: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">View & Verify Visitor</a>
            </div>
            
            <div style="text-align: center; margin-top: 25px;">
                <p style="font-size: 13px; color: #94a3b8; font-style: italic;">Upon clicking, you can view the live gate camera and then approve or reject.</p>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 25px 30px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="margin: 0; color: #64748b; font-size: 14px; font-weight: 600;">SecureGate &ndash; Smart Visitor Access System</p>
            <p style="margin: 10px 0 0 0; color: #94a3b8; font-size: 13px; line-height: 1.5;">If you did not expect this visitor, you can safely reject the request.</p>
            <p style="margin: 8px 0 0 0; color: #cbd5e1; font-size: 11px;">&copy; {{ date('Y') }} SecureGate. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
