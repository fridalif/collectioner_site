import smtplib
from email.message import EmailMessage
import psycopg2

# Параметры подключения
db_params = {
    'dbname': 'collectioner_db',
    'user': 'postgres',
    'password': 'postgres',
    'host': 'localhost',  
    'port': '5432'  
}

address = 'http://127.0.0.1:3000/activate/'

try:
    with smtplib.SMTP_SSL('smtp.mail.ru', 465) as smtp:
        smtp.login('my_test_mail_for_dev@mail.ru', '*********')
        connection = psycopg2.connect(**db_params)
        cursor = connection.cursor()
        cursor.execute("SELECT custom_user.id, activate_hash, email FROM custom_user LEFT JOIN auth_user on custom_user.user_id = auth_user.id WHERE custom_user.sended_message is null;")
        rows = cursor.fetchall()
        for row in rows:
            user_id = row[0]
            activate_hash = row[1]
            email = row[2]

            message = EmailMessage()
            message['Subject'] = 'Подтверждение регистрации на сайте'
            message['From'] = 'serb.2002@mail.ru'
            message['To'] = email
            message.set_content(f'Благодарим Вас за регистрацию на сайте. Для подтверждения регистрации перейдите по ссылке: {address}?hash={activate_hash}')
            try:
                smtp.send_message(message)
                cursor.execute(f"UPDATE custom_user SET sended_message = now() WHERE id = {user_id};")
            except Exception as e:
                print(f"Не удалось отправить письмо пользователю {user_id}: {e}")
                continue

        connection.commit()

except Exception as e:
    print(f"Ошибка: {e}")

finally:
    # Закрываем курсор и соединение
    if cursor:
        cursor.close()
    if connection:
        connection.close()
