from dotenv import load_dotenv
import os

load_dotenv()

email = os.getenv("EMAIL")
email_password = os.getenv("PASSWORD_EMAIL")

