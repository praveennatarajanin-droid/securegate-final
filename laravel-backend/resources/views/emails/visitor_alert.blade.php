<!DOCTYPE html>
<html>
<head>
    <title>Visitor Alert</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #2563eb;">SecureGate Visitor Alert</h2>
    <p><strong>Visitor:</strong> {{ $visitor->name }}</p>
    <p><strong>Purpose:</strong> {{ $visitor->purpose }}</p>
    <p><strong>Flat:</strong> {{ $visitor->flat }}</p>
    <br/>
    <a href="{{ $verifyLink }}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">View & Approve Visitor</a>
    <br/><br/>
    <p style="font-size: 0.8rem; color: #666;">Or copy this link: {{ $verifyLink }}</p>
</body>
</html>
