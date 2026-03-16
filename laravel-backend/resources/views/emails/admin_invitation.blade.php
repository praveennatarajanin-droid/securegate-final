<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #FF5C2A; margin: 0; }
        .content { margin-bottom: 30px; }
        .credentials { background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #FF5C2A; }
        .credentials p { margin: 5px 0; font-family: monospace; font-size: 1.1rem; }
        .btn { display: inline-block; background: #FF5C2A; color: #fff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
        .footer { font-size: 0.875rem; color: #777; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SecureGate</h1>
            <p>Admin Portal Access</p>
        </div>
        <div class="content">
            <p>Hello <strong>{{ $admin->name }}</strong>,</p>
            <p>You have been assigned as an administrator for <strong>{{ $admin->society->name }}</strong> on the SecureGate platform.</p>
            <p>Your account has been created successfully. Use the credentials below to log in and access your dashboard:</p>
            
            <div class="credentials">
                <p><strong>Email:</strong> {{ $admin->email }}</p>
                <p><strong>Temporary Password:</strong> {{ $password }}</p>
            </div>

            <p>For security reasons, we recommend changing your password after your first login.</p>
            
            <a href="{{ config('app.frontend_url', 'http://localhost:5173') }}/admin-login" class="btn">Login to Dashboard</a>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} SecureGate. All rights reserved.</p>
            <p>If you did not expect this invitation, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
