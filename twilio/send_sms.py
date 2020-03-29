# YOU MUST SET THE ENV VARS FOR this to work
from twilio.rest import Client
import os
# Load tokens from env vars
account_sid = os.environ['TWILIO_ACCOUNT_SID']
auth_token = os.environ['TWILIO_AUTH_TOKEN']
client = Client(account_sid, auth_token)

message = client.messages \
                .create(
                     body="The env vars seem to work",
                     from_='+12024103519',
                     to="+15713268426"
                 )

print(message.sid)