import smtplib
from email.message import EmailMessage

# Формирование сообщения
message = EmailMessage()
message['Subject'] = 'Тема сообщения'
message['From'] = 'serb.2002@mail.ru'
message['To'] = 'fridalif2@gmail.com'
message.set_content('Вечный двигатель — это миф!')

with smtplib.SMTP_SSL('smtp.mail.ru', 465) as smtp:
    smtp.login('serb.2002@mail.ru', 'aJfThQ6jpngxqJsxMeEm')
    smtp.send_message(message)