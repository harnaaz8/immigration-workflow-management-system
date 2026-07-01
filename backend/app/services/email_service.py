import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
import os

BREVO_API_KEY = os.getenv("BREVO_API_KEY")


def send_student_credentials_email(
    student_name,
    student_email,
    password
):
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = BREVO_API_KEY

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
        sib_api_v3_sdk.ApiClient(configuration)
    )

    sender = {
        "name": "EMunch Immigration",
        "email": "harnaaz@antiersolutions.com"
    }

    subject = "Welcome to EMunch Immigration"

    html_content = f"""
    <html>
    <body>

    <h2>Welcome to EMunch Immigration</h2>

    <p>Hello {student_name},</p>

    <p>Your student portal account has been created.</p>

    <p><b>Email:</b> {student_email}</p>

    <p><b>Password:</b> {password}</p>

    <p>
    Student Login:
    <br>
    http://localhost:5173/login
    </p>

    <br>

    <p>
    Regards,<br>
    EMunch Immigration Team
    </p>

    </body>
    </html>
    """

    email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": student_email}],
        sender=sender,
        subject=subject,
        html_content=html_content
    )

    try:
        api_instance.send_transac_email(email)
        print("Student Email Sent Successfully")

    except ApiException as e:
        print("Student Email Error:", e)

def send_staff_credentials_email(
    staff_name,
    staff_email,
    password
):
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = BREVO_API_KEY

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
        sib_api_v3_sdk.ApiClient(configuration)
    )

    sender = {
        "name": "EMunch Immigration",
        "email": "harnaaz@antiersolutions.com"
    }

    subject = "Welcome to EMunch Immigration"

    html_content = f"""
    <html>
    <body>

    <h2>Welcome to EMunch Immigration</h2>

    <p>Hello {staff_name},</p>

    <p>Your staff account has been created.</p>

    <p>
    <b>Email:</b> {staff_email}
    </p>

    <p>
    <b>Password:</b> {password}
    </p>

    <p>
    Login URL:
    <br>
    http://localhost:5173/login
    </p>

    <br>

    <p>
    Regards,<br>
    EMunch Immigration Team
    </p>

    </body>
    </html>
    """

    email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": staff_email}],
        sender=sender,
        subject=subject,
        html_content=html_content
    )

    try:
        api_instance.send_transac_email(email)
        print("Email Sent Successfully")

    except ApiException as e:
        print("Email Error:", e)


def send_visa_completion_email(student_name, student_email):
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = BREVO_API_KEY

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
        sib_api_v3_sdk.ApiClient(configuration)
    )

    sender = {
        "name": "EMunch Immigration",
        "email": "harnaaz@antiersolutions.com"
    }

    subject = "Your Visa Has Been Approved - EMunch Immigration"

    html_content = f"""
    <html>
    <body>
    <h2>Congratulations, {student_name}! 🎉</h2>
    <p>Your immigration file has been fully processed and your visa is now ready.</p>
    <p>You can download your visa document by logging into your student portal:</p>
    <p><a href="http://localhost:5173/login">http://localhost:5173/login</a></p>
    <p>Once logged in, click the <b>Download Visa</b> button on your dashboard.</p>
    <br>
    <p>Regards,<br>EMunch Immigration Team</p>
    </body>
    </html>
    """

    email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": student_email}],
        sender=sender,
        subject=subject,
        html_content=html_content
    )

    try:
        api_instance.send_transac_email(email)
        print("Visa completion email sent")
    except ApiException as e:
        print("Visa email error:", e)